import { useCallback, useEffect, useReducer, useRef } from "react";
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
    case "closed":
      return state.phase === "chatting" && state.roomId === action.roomId
        ? { ...state, phase: "ended", partnerTyping: false }
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

  return { state, find, leave, send, setTyping };
}
