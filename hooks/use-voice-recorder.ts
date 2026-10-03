import { useCallback, useEffect, useRef, useState } from "react";
import { setVoiceActive } from "@/lib/voice-activity";
import {
  MAX_VOICE_SECONDS,
  pickRecorderType,
  toPeaks,
  VOICE_BITRATE,
  VOICE_LIVE_BARS,
} from "@/lib/voice";
import type { RecordedVoice } from "@/types/chat";

const SAMPLE_INTERVAL_MS = 50;

interface Session {
  stream: MediaStream;
  recorder: MediaRecorder;
  context: AudioContext;
  chunks: Blob[];
  levels: number[];
  startedAt: number;
  timer: number;
  limit: number;
  keep: boolean;
}

export type RecorderStatus = "idle" | "starting" | "recording";

export function useVoiceRecorder(onRecorded: (voice: RecordedVoice) => void) {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [live, setLive] = useState<number[]>([]);
  const sessionRef = useRef<Session | null>(null);
  const onRecordedRef = useRef(onRecorded);

  useEffect(() => {
    onRecordedRef.current = onRecorded;
  }, [onRecorded]);

  const finish = useCallback((keep: boolean) => {
    const session = sessionRef.current;
    if (!session) return;
    session.keep = keep;
    window.clearInterval(session.timer);
    window.clearTimeout(session.limit);
    if (session.recorder.state !== "inactive") session.recorder.stop();
  }, []);

  const start = useCallback(async (): Promise<boolean> => {
    if (sessionRef.current) return true;
    setStatus("starting");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      setStatus("idle");
      return false;
    }

    const mimeType = pickRecorderType();
    const recorder = new MediaRecorder(stream, {
      ...(mimeType ? { mimeType } : {}),
      audioBitsPerSecond: VOICE_BITRATE,
    });
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    context.createMediaStreamSource(stream).connect(analyser);
    const samples = new Float32Array(analyser.fftSize);

    const session: Session = {
      stream,
      recorder,
      context,
      chunks: [],
      levels: [],
      startedAt: performance.now(),
      timer: 0,
      limit: 0,
      keep: false,
    };
    sessionRef.current = session;

    session.timer = window.setInterval(() => {
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) sum += sample * sample;
      const level = Math.min(1, Math.sqrt(sum / samples.length) * 4);
      session.levels.push(level);
      setLive((current) => [...current, level].slice(-VOICE_LIVE_BARS));
      setElapsed((performance.now() - session.startedAt) / 1000);
    }, SAMPLE_INTERVAL_MS);
    session.limit = window.setTimeout(
      () => finish(true),
      MAX_VOICE_SECONDS * 1000,
    );

    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) session.chunks.push(event.data);
    });
    recorder.addEventListener("stop", () => {
      const duration = Math.min(
        MAX_VOICE_SECONDS,
        (performance.now() - session.startedAt) / 1000,
      );
      stream.getTracks().forEach((track) => track.stop());
      void context.close();
      sessionRef.current = null;
      setVoiceActive("recorder", false);
      setStatus("idle");
      setElapsed(0);
      setLive([]);
      if (!session.keep || session.chunks.length === 0 || duration < 0.5) {
        return;
      }
      onRecordedRef.current({
        blob: new Blob(session.chunks, { type: recorder.mimeType }),
        duration,
        peaks: toPeaks(session.levels),
      });
    });

    recorder.start();
    setVoiceActive("recorder", true);
    setStatus("recording");
    return true;
  }, [finish]);

  const send = useCallback(() => finish(true), [finish]);
  const cancel = useCallback(() => finish(false), [finish]);

  useEffect(() => () => finish(false), [finish]);

  return { status, elapsed, live, start, send, cancel };
}
