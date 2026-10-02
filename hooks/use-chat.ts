import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import {
  ADD_TRACK_ERROR_FALLBACK,
  ADD_TRACK_ERRORS,
  FIND_ERROR_FALLBACK,
  FIND_ERRORS,
  SEND_ERROR_FALLBACK,
  SEND_ERRORS,
} from "@/constants/messages";
import { facultyOf, type FacultyId } from "@/constants/faculties";
import { chatReducer, initialChatState } from "@/lib/chat-reducer";
import { CORE_URL } from "@/lib/config";
import type { Profile } from "@/types/auth";
import type {
  AddTrackAck,
  ChatMessage,
  FindAck,
  MatchedPayload,
  MusicControls,
  MusicPayload,
  SendAck,
} from "@/types/chat";

export function useChat({
  token,
  enabled,
  onAuthError,
}: {
  token: string | null;
  enabled: boolean;
  onAuthError: () => void;
}) {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const socketRef = useRef<Socket | null>(null);
  const onAuthErrorRef = useRef(onAuthError);

  useEffect(() => {
    onAuthErrorRef.current = onAuthError;
  }, [onAuthError]);

  useEffect(() => {
    if (!enabled) return;
    const socket = io(CORE_URL, { auth: token ? { token } : {} });
    socketRef.current = socket;

    socket.on("connect", () => dispatch({ type: "connected" }));
    socket.on("disconnect", () => dispatch({ type: "disconnected" }));
    socket.on("auth:error", () => onAuthErrorRef.current());
    socket.on("auth:ok", (payload: { faculty: string }) => {
      const faculty = facultyOf(payload.faculty);
      if (faculty) dispatch({ type: "authenticated", faculty: faculty.id });
    });
    socket.on("stats", (stats: { online: number }) =>
      dispatch({ type: "stats", online: stats.online }),
    );
    socket.on("match:found", (payload: MatchedPayload) =>
      dispatch({ type: "matched", ...payload }),
    );
    socket.on("match:fallback", (payload: { roomId: string }) =>
      dispatch({ type: "fellBack", roomId: payload.roomId }),
    );
    socket.on("chat:message", (message: Omit<ChatMessage, "mine">) =>
      dispatch({ type: "message", message: { ...message, mine: false } }),
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

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, enabled]);

  const find = useCallback((profile: Profile, prefers: FacultyId | null) => {
    dispatch({ type: "search", prefers });
    socketRef.current?.emit(
      "match:find",
      { ...profile, preferFaculty: prefers },
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
        if (!socket?.connected) return resolve(SEND_ERRORS.not_in_chat);
        socket.emit("chat:send", { text }, (ack: SendAck) => {
          if (!ack.ok) {
            return resolve(SEND_ERRORS[ack.error] ?? SEND_ERROR_FALLBACK);
          }
          dispatch({
            type: "message",
            message: { ...ack.message, mine: true },
          });
          resolve(null);
        });
      }),
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

  return { state, find, leave, send, setTyping, music };
}
