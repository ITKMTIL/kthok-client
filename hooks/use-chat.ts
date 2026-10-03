import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import {
  ADD_TRACK_ERROR_FALLBACK,
  ADD_TRACK_ERRORS,
  BLOCK_DONE_MESSAGE,
  BLOCK_FAILED_MESSAGE,
  FIND_ERROR_FALLBACK,
  FIND_ERRORS,
  SEND_ERROR_FALLBACK,
  PROMPT_RATE_LIMITED,
  SEND_ERRORS,
  VOICE_SEND_ERRORS,
} from "@/constants/messages";
import { facultyOf } from "@/constants/faculties";
import type { Reaction } from "@/constants/reactions";
import { chatReducer, initialChatState } from "@/lib/chat-reducer";
import { CORE_URL } from "@/lib/config";
import { voicePlayer } from "@/lib/voice-player";
import type { Profile } from "@/types/auth";
import type {
  AddTrackAck,
  IncomingMessage,
  IncomingVoice,
  FindAck,
  MatchedPayload,
  MusicControls,
  MusicPayload,
  PromptAck,
  PromptPayload,
  ReactionPayload,
  RecordedVoice,
  SearchOptions,
  SendAck,
  VoiceSendAck,
  WaitingSummary,
} from "@/types/chat";

const NO_REACTIONS = { mine: null, theirs: null };

export function useChat({
  token,
  enabled,
  onAuthError,
  onBanned,
}: {
  token: string | null;
  enabled: boolean;
  onAuthError: () => void;
  onBanned: () => void;
}) {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const socketRef = useRef<Socket | null>(null);
  const onAuthErrorRef = useRef(onAuthError);
  const onBannedRef = useRef(onBanned);

  useEffect(() => {
    onAuthErrorRef.current = onAuthError;
    onBannedRef.current = onBanned;
  }, [onAuthError, onBanned]);

  const socket = useMemo(
    () =>
      enabled
        ? io(CORE_URL, { auth: token ? { token } : {}, autoConnect: false })
        : null,
    [token, enabled],
  );

  useEffect(() => {
    if (!socket) return;
    socketRef.current = socket;

    socket.on("connect", () =>
      dispatch({ type: "connected", recovered: socket.recovered }),
    );
    socket.on("partner:presence", (payload: { away: boolean }) =>
      dispatch({ type: "presence", away: payload.away === true }),
    );
    const leaveOnUnload = () => socket.emit("room:leave");
    window.addEventListener("pagehide", leaveOnUnload);
    socket.on("disconnect", () => dispatch({ type: "disconnected" }));
    socket.on("auth:error", () => onAuthErrorRef.current());
    socket.on("auth:banned", () => onBannedRef.current());
    socket.on(
      "features",
      (features: { call?: boolean; voice?: boolean; block?: boolean }) =>
        dispatch({
          type: "features",
          call: features.call === true,
          voice: features.voice === true,
          block: features.block === true,
        }),
    );
    socket.on("auth:ok", (payload: { faculty: string; admin?: boolean }) => {
      const faculty = facultyOf(payload.faculty);
      if (faculty) {
        dispatch({
          type: "authenticated",
          faculty: faculty.id,
          admin: payload.admin === true,
        });
      }
    });
    socket.on(
      "stats",
      (stats: { online: number } & Partial<WaitingSummary>) =>
        dispatch({
          type: "stats",
          online: stats.online,
          waiting: {
            faculties: stats.faculties ?? [],
            topics: stats.topics ?? [],
          },
        }),
    );
    socket.on("match:found", (payload: MatchedPayload) =>
      dispatch({ type: "matched", ...payload }),
    );
    socket.on("match:fallback", (payload: { roomId: string }) =>
      dispatch({ type: "fellBack", roomId: payload.roomId }),
    );
    socket.on("chat:message", (message: IncomingMessage) =>
      dispatch({
        type: "message",
        message: { ...message, mine: false, reactions: NO_REACTIONS },
      }),
    );
    socket.on("voice:message", ({ audio, mime, ...meta }: IncomingVoice) =>
      dispatch({
        type: "message",
        message: {
          id: meta.id,
          at: meta.at,
          text: "",
          mine: false,
          reactions: NO_REACTIONS,
          voice: {
            url: URL.createObjectURL(new Blob([audio], { type: mime })),
            duration: meta.duration,
            peaks: meta.peaks,
          },
        },
      }),
    );
    socket.on("chat:prompt", (prompt: PromptPayload) =>
      dispatch({
        type: "message",
        message: { ...prompt, prompt: true, reactions: NO_REACTIONS },
      }),
    );
    socket.on(
      "chat:reaction",
      ({ roomId, messageId, mine, theirs }: ReactionPayload) =>
        dispatch({
          type: "reaction",
          roomId,
          messageId,
          reactions: { mine, theirs },
        }),
    );
    socket.on("chat:typing", (payload: { typing: boolean }) =>
      dispatch({ type: "typing", typing: payload.typing }),
    );
    socket.on("music:state", ({ roomId, ...music }: MusicPayload) =>
      dispatch({
        type: "music",
        roomId,
        music: { ...music, receivedAt: performance.now() },
      }),
    );
    socket.on("room:closed", (payload: { roomId: string }) =>
      dispatch({ type: "closed", roomId: payload.roomId }),
    );

    socket.connect();

    return () => {
      window.removeEventListener("pagehide", leaveOnUnload);
      socket.disconnect();
      socket.off();
      socketRef.current = null;
    };
  }, [socket]);

  const voiceUrlsRef = useRef(new Set<string>());

  useEffect(() => {
    const current = new Set(
      state.messages.flatMap((message) =>
        message.voice ? [message.voice.url] : [],
      ),
    );
    for (const url of voiceUrlsRef.current) {
      if (!current.has(url)) URL.revokeObjectURL(url);
    }
    if (current.size === 0) voicePlayer.stop();
    voiceUrlsRef.current = current;
  }, [state.messages]);

  useEffect(
    () => () => {
      voiceUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      voicePlayer.stop();
    },
    [],
  );

  const find = useCallback((profile: Profile, { prefers, topic }: SearchOptions) => {
    dispatch({ type: "search", prefers, topic });
    socketRef.current?.emit(
      "match:find",
      { ...profile, preferFaculty: prefers, topic },
      (ack: FindAck) => {
        if (!ack.ok) {
          socketRef.current?.emit("room:leave");
          dispatch({
            type: "reset",
            error: FIND_ERRORS[ack.error] ?? FIND_ERROR_FALLBACK,
          });
        } else if (ack.status === "matched") {
          dispatch({ type: "matched", ...ack });
        } else {
          dispatch({ type: "waiting", roomId: ack.roomId });
        }
      },
    );
  }, []);

  const leave = useCallback(() => {
    socketRef.current?.emit("room:leave");
    dispatch({ type: "reset" });
  }, []);

  const send = useCallback(
    (text: string) =>
      new Promise<string | null>((resolve) => {
        const socket = socketRef.current;
        if (!socket?.connected) return resolve(SEND_ERRORS.offline);
        socket.emit("chat:send", { text }, (ack: SendAck) => {
          if (!ack.ok) {
            return resolve(SEND_ERRORS[ack.error] ?? SEND_ERROR_FALLBACK);
          }
          dispatch({
            type: "message",
            message: { ...ack.message, mine: true, reactions: NO_REACTIONS },
          });
          resolve(null);
        });
      }),
    [],
  );

  const sendVoice = useCallback(
    async (voice: RecordedVoice) => {
      const socket = socketRef.current;
      if (!socket?.connected) return SEND_ERRORS.offline;
      const audio = await voice.blob.arrayBuffer();
      return new Promise<string | null>((resolve) => {
        socket.emit(
          "voice:send",
          { audio, duration: voice.duration, peaks: voice.peaks },
          (ack: VoiceSendAck) => {
            if (!ack.ok) {
              return resolve(
                VOICE_SEND_ERRORS[ack.error] ??
                  SEND_ERRORS[ack.error] ??
                  SEND_ERROR_FALLBACK,
              );
            }
            dispatch({
              type: "message",
              message: {
                id: ack.message.id,
                at: ack.message.at,
                text: "",
                mine: true,
                reactions: NO_REACTIONS,
                voice: {
                  url: URL.createObjectURL(voice.blob),
                  duration: ack.message.duration,
                  peaks: ack.message.peaks,
                },
              },
            });
            resolve(null);
          },
        );
      });
    },
    [],
  );

  const askPrompt = useCallback(
    () =>
      new Promise<string | null>((resolve) => {
        const socket = socketRef.current;
        if (!socket?.connected) return resolve(SEND_ERRORS.offline);
        socket.emit("chat:prompt", (ack: PromptAck) => {
          if (!ack.ok) {
            return resolve(
              ack.error === "rate_limited"
                ? PROMPT_RATE_LIMITED
                : (SEND_ERRORS[ack.error] ?? SEND_ERROR_FALLBACK),
            );
          }
          dispatch({
            type: "message",
            message: { ...ack.prompt, prompt: true, reactions: NO_REACTIONS },
          });
          resolve(null);
        });
      }),
    [],
  );

  const block = useCallback(
    () =>
      new Promise<string | null>((resolve) => {
        const active = socketRef.current;
        if (!active?.connected) return resolve(BLOCK_FAILED_MESSAGE);
        active.emit("room:block", (ack: { ok: boolean }) => {
          if (!ack.ok) return resolve(BLOCK_FAILED_MESSAGE);
          dispatch({ type: "reset", error: BLOCK_DONE_MESSAGE });
          resolve(null);
        });
      }),
    [],
  );

  const sendFeedback = useCallback((rating: "up" | "down") => {
    socketRef.current?.emit("room:feedback", { rating });
  }, []);

  const react = useCallback(
    (messageId: string, reaction: Reaction | null) => {
      socketRef.current?.emit("chat:react", { messageId, reaction });
    },
    [],
  );

  const setTyping = useCallback((typing: boolean) => {
    socketRef.current?.emit("chat:typing", { typing });
  }, []);

  const music = useMemo<MusicControls>(
    () => ({
      add: (url) =>
        new Promise((resolve) => {
          const socket = socketRef.current;
          if (!socket?.connected) return resolve(ADD_TRACK_ERRORS.not_in_chat);
          socket.emit("music:add", { url }, (ack: AddTrackAck) =>
            resolve(
              ack.ok
                ? null
                : (ADD_TRACK_ERRORS[ack.error] ?? ADD_TRACK_ERROR_FALLBACK),
            ),
          );
        }),
      play: () => socketRef.current?.emit("music:play"),
      pause: () => socketRef.current?.emit("music:pause"),
      skip: (trackId) => socketRef.current?.emit("music:skip", { trackId }),
      remove: (trackId) => socketRef.current?.emit("music:remove", { trackId }),
    }),
    [],
  );

  return {
    state,
    socket,
    find,
    leave,
    send,
    sendVoice,
    askPrompt,
    react,
    block,
    sendFeedback,
    setTyping,
    music,
  };
}
