import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import type { FacultyId } from "./faculties";
import type { Profile } from "./profile";

const CORE_URL = process.env.NEXT_PUBLIC_CORE_URL ?? "http://localhost:3001";

export interface Partner {
  nickname: string;
  faculty: FacultyId;
}

export interface ChatMessage {
  id: string;
  text: string;
  at: number;
  mine: boolean;
}

export interface Track {
  id: string;
  videoId: string;
  title: string;
  addedBy: string;
}

export interface MusicState {
  current: Track | null;
  queue: Track[];
  playing: boolean;
  positionSec: number;
  receivedAt: number;
}

export interface MusicControls {
  add: (url: string) => Promise<string | null>;
  play: () => void;
  pause: () => void;
  skip: (trackId: string) => void;
  remove: (trackId: string) => void;
}

type MusicPayload = Omit<MusicState, "receivedAt"> & { roomId: string };

type AddTrackAck = { ok: true } | { ok: false; error: string };

const ADD_TRACK_ERRORS: Record<string, string> = {
  invalid_url: "ลิงก์นี้ไม่ใช่ลิงก์ YouTube ที่ใช้ได้",
  video_unavailable: "คลิปนี้ไม่มีอยู่ หรือไม่อนุญาตให้เล่นนอก YouTube",
  queue_full: "คิวเต็มแล้ว ลองลบเพลงออกก่อนนะ",
  not_in_chat: "ห้องนี้ปิดแล้ว",
};

interface MatchedPayload {
  roomId: string;
  partner: Partner;
  preferenceMet: boolean;
}

type FindAck =
  | ({ ok: true; status: "matched" } & MatchedPayload)
  | { ok: true; status: "waiting"; roomId: string }
  | { ok: false; error: string };

type SendAck =
  | { ok: true; message: Omit<ChatMessage, "mine"> }
  | { ok: false; error: string };

export interface ChatState {
  connected: boolean;
  online: number | null;
  phase: "idle" | "searching" | "chatting" | "ended";
  prefers: FacultyId | null;
  fellBack: boolean;
  roomId: string | null;
  partner: Partner | null;
  preferenceMet: boolean;
  messages: ChatMessage[];
  partnerTyping: boolean;
  music: MusicState | null;
  error: string | null;
}

type Action =
  | { type: "connected" }
  | { type: "disconnected" }
  | { type: "stats"; online: number }
  | { type: "search"; prefers: FacultyId | null }
  | { type: "waiting"; roomId: string }
  | { type: "fellBack"; roomId: string }
  | ({ type: "matched" } & MatchedPayload)
  | { type: "message"; message: ChatMessage }
  | { type: "typing"; typing: boolean }
  | { type: "music"; roomId: string; music: MusicState }
  | { type: "closed"; roomId: string }
  | { type: "reset"; error?: string };

const initialState: ChatState = {
  connected: false,
  online: null,
  phase: "idle",
  prefers: null,
  fellBack: false,
  roomId: null,
  partner: null,
  preferenceMet: false,
  messages: [],
  partnerTyping: false,
  music: null,
  error: null,
};

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "connected":
      return { ...state, connected: true, error: null };
    case "disconnected":
      return {
        ...initialState,
        online: state.online,
        error: state.phase === "idle" ? null : "หลุดการเชื่อมต่อ ลองหาห้องใหม่อีกครั้งนะ",
      };
    case "stats":
      return { ...state, online: action.online };
    case "search":
      return {
        ...initialState,
        connected: state.connected,
        online: state.online,
        phase: "searching",
        prefers: action.prefers,
      };
    case "waiting":
      return state.phase === "searching"
        ? { ...state, roomId: action.roomId }
        : state;
    case "fellBack":
      return state.phase === "searching" && state.roomId === action.roomId
        ? { ...state, fellBack: true }
        : state;
    case "matched":
      return state.phase === "searching"
        ? {
            ...state,
            phase: "chatting",
            roomId: action.roomId,
            partner: action.partner,
            preferenceMet: action.preferenceMet,
          }
        : state;
    case "message":
      return state.phase === "chatting"
        ? {
            ...state,
            messages: [...state.messages, action.message],
            partnerTyping: action.message.mine ? state.partnerTyping : false,
          }
        : state;
    case "typing":
      return state.phase === "chatting"
        ? { ...state, partnerTyping: action.typing }
        : state;
    case "music":
      return state.phase === "chatting" && state.roomId === action.roomId
        ? { ...state, music: action.music }
        : state;
    case "closed":
      return state.phase === "chatting" && state.roomId === action.roomId
        ? { ...state, phase: "ended", partnerTyping: false, music: null }
        : state;
    case "reset":
      return {
        ...initialState,
        connected: state.connected,
        online: state.online,
        error: action.error ?? null,
      };
  }
}

export function useChat() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(CORE_URL);
    socketRef.current = socket;

    socket.on("connect", () => dispatch({ type: "connected" }));
    socket.on("disconnect", () => dispatch({ type: "disconnected" }));
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
  }, []);

  const find = useCallback((profile: Profile, prefers: FacultyId | null) => {
    dispatch({ type: "search", prefers });
    socketRef.current?.emit(
      "match:find",
      { ...profile, preferFaculty: prefers },
      (ack: FindAck) => {
        if (!ack.ok) {
          dispatch({ type: "reset", error: "หาห้องไม่สำเร็จ ลองใหม่อีกครั้งนะ" });
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

  const send = useCallback((text: string) => {
    socketRef.current?.emit("chat:send", { text }, (ack: SendAck) => {
      if (ack.ok) {
        dispatch({ type: "message", message: { ...ack.message, mine: true } });
      }
    });
  }, []);

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
                : (ADD_TRACK_ERRORS[ack.error] ?? "เพิ่มเพลงไม่สำเร็จ ลองใหม่อีกครั้งนะ"),
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
