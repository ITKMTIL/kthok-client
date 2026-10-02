import { DISCONNECTED_MESSAGE } from "@/constants/messages";
import type { FacultyId } from "@/constants/faculties";
import type {
  ChatMessage,
  ChatState,
  MatchedPayload,
  MusicState,
} from "@/types/chat";

export type ChatAction =
  | { type: "connected" }
  | { type: "disconnected" }
  | { type: "authenticated"; faculty: FacultyId }
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

export const initialChatState: ChatState = {
  connected: false,
  selfFaculty: null,
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

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  const inRoom = (roomId: string) =>
    state.phase === "chatting" && state.roomId === roomId;

  switch (action.type) {
    case "connected":
      return { ...state, connected: true, error: null };
    case "disconnected":
      return {
        ...initialChatState,
        online: state.online,
        error: state.phase === "idle" ? state.error : DISCONNECTED_MESSAGE,
      };
    case "authenticated":
      return { ...state, selfFaculty: action.faculty };
    case "stats":
      return { ...state, online: action.online };
    case "search":
      return {
        ...initialChatState,
        connected: state.connected,
        selfFaculty: state.selfFaculty,
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
      return inRoom(action.roomId) ? { ...state, music: action.music } : state;
    case "closed":
      return inRoom(action.roomId)
        ? { ...state, phase: "ended", partnerTyping: false, music: null }
        : state;
    case "reset":
      return {
        ...initialChatState,
        connected: state.connected,
        selfFaculty: state.selfFaculty,
        online: state.online,
        error: action.error ?? null,
      };
  }
}
