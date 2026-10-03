import { DISCONNECTED_MESSAGE } from "@/constants/messages";
import type { FacultyId } from "@/constants/faculties";
import type {
  ChatMessage,
  ChatState,
  MatchedPayload,
  MessageReactions,
  MusicState,
} from "@/types/chat";

export type ChatAction =
  | { type: "connected"; recovered: boolean }
  | { type: "disconnected" }
  | { type: "authenticated"; faculty: FacultyId; admin: boolean }
  | { type: "features"; call: boolean; voice: boolean; block: boolean }
  | { type: "stats"; online: number }
  | { type: "search"; prefers: FacultyId | null }
  | { type: "waiting"; roomId: string }
  | { type: "fellBack"; roomId: string }
  | ({ type: "matched" } & MatchedPayload)
  | { type: "message"; message: ChatMessage }
  | { type: "typing"; typing: boolean }
  | { type: "presence"; away: boolean }
  | {
      type: "reaction";
      roomId: string;
      messageId: string;
      reactions: MessageReactions;
    }
  | { type: "music"; roomId: string; music: MusicState }
  | { type: "closed"; roomId: string }
  | { type: "reset"; error?: string };

export const initialChatState: ChatState = {
  connected: false,
  callEnabled: false,
  voiceEnabled: false,
  blockEnabled: false,
  isAdmin: false,
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
  partnerAway: false,
  music: null,
  error: null,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  const inRoom = (roomId: string) =>
    state.phase === "chatting" && state.roomId === roomId;

  switch (action.type) {
    case "connected":
      if (action.recovered || state.phase === "idle" || state.phase === "ended") {
        return { ...state, connected: true };
      }
      return state.phase === "chatting"
        ? {
            ...state,
            connected: true,
            phase: "ended",
            partnerTyping: false,
            partnerAway: false,
            music: null,
          }
        : {
            ...initialChatState,
            connected: true,
            callEnabled: state.callEnabled,
            voiceEnabled: state.voiceEnabled,
            blockEnabled: state.blockEnabled,
            isAdmin: state.isAdmin,
            selfFaculty: state.selfFaculty,
            online: state.online,
            error: DISCONNECTED_MESSAGE,
          };
    case "disconnected":
      return { ...state, connected: false, partnerTyping: false };
    case "features":
      return {
        ...state,
        callEnabled: action.call,
        voiceEnabled: action.voice,
        blockEnabled: action.block,
      };
    case "authenticated":
      return { ...state, selfFaculty: action.faculty, isAdmin: action.admin };
    case "stats":
      return { ...state, online: action.online };
    case "search":
      return {
        ...initialChatState,
        connected: state.connected,
        callEnabled: state.callEnabled,
        voiceEnabled: state.voiceEnabled,
        blockEnabled: state.blockEnabled,
        isAdmin: state.isAdmin,
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
            partnerAway: action.partnerAway ?? false,
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
    case "presence":
      return state.phase === "chatting"
        ? { ...state, partnerAway: action.away, partnerTyping: false }
        : state;
    case "reaction":
      return inRoom(action.roomId)
        ? {
            ...state,
            messages: state.messages.map((message) =>
              message.id === action.messageId
                ? { ...message, reactions: action.reactions }
                : message,
            ),
          }
        : state;
    case "music":
      return inRoom(action.roomId) ? { ...state, music: action.music } : state;
    case "closed":
      return inRoom(action.roomId)
        ? {
            ...state,
            phase: "ended",
            partnerTyping: false,
            partnerAway: false,
            music: null,
          }
        : state;
    case "reset":
      return {
        ...initialChatState,
        connected: state.connected,
        callEnabled: state.callEnabled,
        voiceEnabled: state.voiceEnabled,
        blockEnabled: state.blockEnabled,
        isAdmin: state.isAdmin,
        selfFaculty: state.selfFaculty,
        online: state.online,
        error: action.error ?? null,
      };
  }
}
