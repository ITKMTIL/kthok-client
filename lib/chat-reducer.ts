import type { FacultyId } from "@/constants/faculties";
import { DEFAULT_TOPIC, type TopicId } from "@/constants/topics";
import { currentDict } from "@/hooks/use-locale";
import type {
  ChatMessage,
  ChatState,
  MatchedPayload,
  GameView,
  MessageReactions,
  MusicState,
  WaitingSummary,
} from "@/types/chat";

export type ChatAction =
  | { type: "connected"; recovered: boolean }
  | { type: "disconnected" }
  | { type: "authenticated"; faculty: FacultyId; admin: boolean }
  | {
      type: "features";
      call: boolean;
      voice: boolean;
      block: boolean;
      report: boolean;
      pushKey: string | null;
    }
  | { type: "stats"; online: number; waiting: WaitingSummary }
  | { type: "search"; prefers: FacultyId | null; topic: TopicId }
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
  | { type: "game"; roomId: string; game: GameView | null }
  | { type: "keepSent" }
  | { type: "keepOffered"; roomId: string }
  | { type: "contact"; roomId: string; contact: string }
  | { type: "closed"; roomId: string }
  | { type: "left" }
  | { type: "unsent"; messageId: string }
  | { type: "read"; messageId: string }
  | { type: "reset"; error?: string };

export const initialChatState: ChatState = {
  connected: false,
  callEnabled: false,
  voiceEnabled: false,
  blockEnabled: false,
  reportEnabled: false,
  pushKey: null,
  isAdmin: false,
  selfFaculty: null,
  online: null,
  waiting: null,
  phase: "idle",
  prefers: null,
  topic: DEFAULT_TOPIC,
  fellBack: false,
  roomId: null,
  partner: null,
  preferenceMet: false,
  messages: [],
  partnerTyping: false,
  partnerAway: false,
  music: null,
  game: null,
  endedBy: null,
  readUpTo: null,
  keep: { offered: false, partnerOffered: false, partnerContact: null },
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
            game: null,
          }
        : {
            ...initialChatState,
            connected: true,
            callEnabled: state.callEnabled,
            voiceEnabled: state.voiceEnabled,
            blockEnabled: state.blockEnabled,
            reportEnabled: state.reportEnabled,
            pushKey: state.pushKey,
            isAdmin: state.isAdmin,
            selfFaculty: state.selfFaculty,
            online: state.online,
            waiting: state.waiting,
            error: currentDict().errors.disconnected,
          };
    case "disconnected":
      return { ...state, connected: false, partnerTyping: false };
    case "features":
      return {
        ...state,
        callEnabled: action.call,
        voiceEnabled: action.voice,
        blockEnabled: action.block,
        reportEnabled: action.report,
        pushKey: action.pushKey,
      };
    case "authenticated":
      return { ...state, selfFaculty: action.faculty, isAdmin: action.admin };
    case "stats":
      return { ...state, online: action.online, waiting: action.waiting };
    case "search":
      return {
        ...initialChatState,
        connected: state.connected,
        callEnabled: state.callEnabled,
        voiceEnabled: state.voiceEnabled,
        blockEnabled: state.blockEnabled,
        reportEnabled: state.reportEnabled,
        pushKey: state.pushKey,
        isAdmin: state.isAdmin,
        selfFaculty: state.selfFaculty,
        online: state.online,
        waiting: state.waiting,
        phase: "searching",
        prefers: action.prefers,
        topic: action.topic,
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
    case "keepSent":
      return state.phase === "ended"
        ? { ...state, keep: { ...state.keep, offered: true } }
        : state;
    case "keepOffered":
      return state.roomId === action.roomId
        ? { ...state, keep: { ...state.keep, partnerOffered: true } }
        : state;
    case "contact":
      return state.roomId === action.roomId
        ? {
            ...state,
            keep: {
              offered: true,
              partnerOffered: true,
              partnerContact: action.contact,
            },
          }
        : state;
    case "game":
      return inRoom(action.roomId) ? { ...state, game: action.game } : state;
    case "closed":
      return inRoom(action.roomId)
        ? {
            ...state,
            phase: "ended",
            endedBy: "partner",
            partnerTyping: false,
            partnerAway: false,
            music: null,
            game: null,
          }
        : state;
    case "unsent":
      return state.phase === "chatting" || state.phase === "ended"
        ? {
            ...state,
            messages: state.messages.map((message) =>
              message.id === action.messageId
                ? {
                    ...message,
                    text: "",
                    voice: undefined,
                    sticker: undefined,
                    unsent: true,
                  }
                : message,
            ),
          }
        : state;
    case "read":
      return state.phase === "chatting"
        ? { ...state, readUpTo: action.messageId }
        : state;
    case "left":
      return state.phase === "chatting"
        ? {
            ...state,
            phase: "ended",
            endedBy: "me",
            partnerTyping: false,
            partnerAway: false,
            music: null,
            game: null,
          }
        : chatReducer(state, { type: "reset" });
    case "reset":
      return {
        ...initialChatState,
        connected: state.connected,
        callEnabled: state.callEnabled,
        voiceEnabled: state.voiceEnabled,
        blockEnabled: state.blockEnabled,
        reportEnabled: state.reportEnabled,
        pushKey: state.pushKey,
        isAdmin: state.isAdmin,
        selfFaculty: state.selfFaculty,
        online: state.online,
        waiting: state.waiting,
        error: action.error ?? null,
      };
  }
}
