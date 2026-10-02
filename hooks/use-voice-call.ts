import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import {
  CALL_ENDED,
  CALL_ERROR_FALLBACK,
  CALL_ERRORS,
  CALL_FAILED,
  CALL_MIC_BLOCKED,
} from "@/constants/messages";
import { ICE_SERVERS } from "@/lib/config";
import { playSound } from "@/lib/sounds";

const RING_INTERVAL_MS = 2500;

export type CallStatus =
  | "idle"
  | "outgoing"
  | "incoming"
  | "connecting"
  | "active";

export interface CallState {
  status: CallStatus;
  muted: boolean;
  startedAt: number | null;
  notice: string | null;
}

interface SignalPayload {
  description?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

type Ack = { ok: true } | { ok: false; error: string };

const IDLE: CallState = {
  status: "idle",
  muted: false,
  startedAt: null,
  notice: null,
};

async function openMicrophone(): Promise<MediaStream | null> {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
    });
  } catch {
    return null;
  }
}

export function useVoiceCall(
  socket: Socket | null,
  { enabled, soundMuted }: { enabled: boolean; soundMuted: boolean },
) {
  const [call, setCall] = useState<CallState>(IDLE);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingRef = useRef<RTCIceCandidateInit[]>([]);
  const statusRef = useRef<CallStatus>("idle");

  useEffect(() => {
    statusRef.current = call.status;
  }, [call.status]);

  const release = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    pendingRef.current = [];
    if (audioRef.current) audioRef.current.srcObject = null;
  }, []);

  const finish = useCallback(
    (notice: string | null) => {
      release();
      setCall({ ...IDLE, notice });
    },
    [release],
  );

  const createPeer = useCallback(
    (stream: MediaStream) => {
      const peer = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("call:signal", { candidate: event.candidate.toJSON() });
        }
      };
      peer.ontrack = (event) => {
        const audio = (audioRef.current ??= new Audio());
        audio.srcObject = event.streams[0];
        void audio.play().catch(() => undefined);
      };
      peer.onconnectionstatechange = () => {
        if (peerRef.current !== peer) return;
        if (peer.connectionState === "connected") {
          setCall((current) =>
            current.status === "connecting"
              ? { ...current, status: "active", startedAt: Date.now() }
              : current,
          );
        } else if (peer.connectionState === "failed") {
          socket?.emit("call:end");
          finish(CALL_FAILED);
        }
      };
      peerRef.current = peer;
      streamRef.current = stream;
      return peer;
    },
    [socket, finish],
  );

  useEffect(() => {
    if (!socket) return;

    const onIncoming = () => {
      if (statusRef.current === "idle") setCall({ ...IDLE, status: "incoming" });
    };

    const onAccepted = async () => {
      const stream = streamRef.current;
      if (statusRef.current !== "outgoing" || !stream) return;
      setCall((current) => ({ ...current, status: "connecting" }));
      const peer = createPeer(stream);
      await peer.setLocalDescription(await peer.createOffer());
      socket.emit("call:signal", { description: peer.localDescription });
    };

    const onSignal = async ({ description, candidate }: SignalPayload) => {
      const peer = peerRef.current;
      if (!peer) return;
      try {
        if (description) {
          await peer.setRemoteDescription(description);
          for (const queued of pendingRef.current.splice(0)) {
            await peer.addIceCandidate(queued);
          }
          if (description.type === "offer") {
            await peer.setLocalDescription(await peer.createAnswer());
            socket.emit("call:signal", { description: peer.localDescription });
          }
        } else if (candidate) {
          if (peer.remoteDescription) await peer.addIceCandidate(candidate);
          else pendingRef.current.push(candidate);
        }
      } catch {
        socket.emit("call:end");
        finish(CALL_FAILED);
      }
    };

    const onEnded = ({ reason }: { reason: string }) => {
      if (statusRef.current !== "idle") finish(CALL_ENDED[reason] ?? null);
    };

    socket.on("call:incoming", onIncoming);
    socket.on("call:accepted", onAccepted);
    socket.on("call:signal", onSignal);
    socket.on("call:ended", onEnded);
    return () => {
      socket.off("call:incoming", onIncoming);
      socket.off("call:accepted", onAccepted);
      socket.off("call:signal", onSignal);
      socket.off("call:ended", onEnded);
    };
  }, [socket, createPeer, finish]);

  useEffect(() => {
    if (call.status !== "incoming" || soundMuted) return;
    playSound("ring");
    const timer = setInterval(() => playSound("ring"), RING_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [call.status, soundMuted]);

  useEffect(() => {
    if (!enabled) release();
  }, [enabled, release]);

  useEffect(() => release, [release]);

  const invite = useCallback(async () => {
    if (!socket || statusRef.current !== "idle") return;
    setCall({ ...IDLE, status: "outgoing" });
    const stream = await openMicrophone();
    if (!stream) return finish(CALL_MIC_BLOCKED);
    streamRef.current = stream;
    socket.emit("call:invite", (ack: Ack) => {
      if (!ack.ok) finish(CALL_ERRORS[ack.error] ?? CALL_ERROR_FALLBACK);
    });
  }, [socket, finish]);

  const accept = useCallback(async () => {
    if (!socket || statusRef.current !== "incoming") return;
    setCall((current) => ({ ...current, status: "connecting" }));
    const stream = await openMicrophone();
    if (!stream) {
      socket.emit("call:decline");
      return finish(CALL_MIC_BLOCKED);
    }
    createPeer(stream);
    socket.emit("call:accept", (ack: Ack) => {
      if (!ack.ok) finish(CALL_ERROR_FALLBACK);
    });
  }, [socket, createPeer, finish]);

  const decline = useCallback(() => {
    socket?.emit("call:decline");
    finish(null);
  }, [socket, finish]);

  const hangUp = useCallback(() => {
    socket?.emit("call:end");
    finish(null);
  }, [socket, finish]);

  const toggleMute = useCallback(() => {
    setCall((current) => {
      const muted = !current.muted;
      streamRef.current?.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
      return { ...current, muted };
    });
  }, []);

  const dismissNotice = useCallback(
    () => setCall((current) => ({ ...current, notice: null })),
    [],
  );

  const visible: CallState = enabled ? call : IDLE;
  return { call: visible, invite, accept, decline, hangUp, toggleMute, dismissNotice };
}
