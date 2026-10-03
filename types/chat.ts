import type { FacultyId } from "@/constants/faculties";
import type { TopicId } from "@/constants/topics";

export interface Partner {
  nickname: string;
  faculty: FacultyId;
}

export interface MessageReactions {
  mine: string | null;
  theirs: string | null;
}

export interface VoiceClip {
  url: string;
  duration: number;
  peaks: number[];
}

export interface RecordedVoice {
  blob: Blob;
  duration: number;
  peaks: number[];
}

export interface ChatMessage {
  id: string;
  text: string;
  at: number;
  mine: boolean;
  reactions: MessageReactions;
  voice?: VoiceClip;
  prompt?: boolean;
}

export type IncomingMessage = Omit<ChatMessage, "mine" | "reactions" | "voice">;

export interface VoiceMeta {
  id: string;
  at: number;
  duration: number;
  peaks: number[];
  mime: string;
}

export type IncomingVoice = VoiceMeta & { audio: ArrayBuffer };

export type ReactionPayload = MessageReactions & {
  roomId: string;
  messageId: string;
};

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

export interface SearchOptions {
  prefers: FacultyId | null;
  topic: TopicId;
}

export interface WaitingSummary {
  faculties: FacultyId[];
  topics: TopicId[];
}

export type GameType = "xo" | "rps";
export type RpsChoice = "rock" | "paper" | "scissors";
export type Side = "me" | "them";
export type GameResult = "win" | "lose" | "draw";

export type GameView =
  | {
      type: "xo";
      startedBy: Side;
      board: (Side | null)[];
      myTurn: boolean;
      result: GameResult | null;
      line: number[] | null;
    }
  | {
      type: "rps";
      startedBy: Side;
      round: number;
      myPick: RpsChoice | null;
      theyPicked: boolean;
      score: { me: number; them: number };
      last: { mine: RpsChoice; theirs: RpsChoice; result: GameResult } | null;
    };

export interface GameControls {
  start: (type: GameType) => void;
  playXo: (cell: number) => void;
  playRps: (choice: RpsChoice) => void;
  end: () => void;
}

export interface KeepState {
  offered: boolean;
  partnerOffered: boolean;
  partnerContact: string | null;
}

export type ReportReason = "harassment" | "sexual" | "hate" | "spam" | "other";

export interface ReportInput {
  reason: ReportReason;
  note: string;
  messages: { id: string; text: string }[];
}

export interface ChatState {
  connected: boolean;
  callEnabled: boolean;
  voiceEnabled: boolean;
  blockEnabled: boolean;
  reportEnabled: boolean;
  isAdmin: boolean;
  selfFaculty: FacultyId | null;
  online: number | null;
  waiting: WaitingSummary | null;
  phase: "idle" | "searching" | "chatting" | "ended";
  prefers: FacultyId | null;
  topic: TopicId;
  fellBack: boolean;
  roomId: string | null;
  partner: Partner | null;
  preferenceMet: boolean;
  messages: ChatMessage[];
  partnerTyping: boolean;
  partnerAway: boolean;
  music: MusicState | null;
  game: GameView | null;
  keep: KeepState;
  error: string | null;
}

export interface MatchedPayload {
  roomId: string;
  partner: Partner;
  preferenceMet: boolean;
  partnerAway?: boolean;
}

export type FindAck =
  | ({ ok: true; status: "matched" } & MatchedPayload)
  | { ok: true; status: "waiting"; roomId: string }
  | { ok: false; error: string };

export type SendAck =
  | { ok: true; message: IncomingMessage }
  | { ok: false; error: string };

export type VoiceSendAck =
  | { ok: true; message: VoiceMeta }
  | { ok: false; error: string };

export interface PromptPayload {
  id: string;
  text: string;
  at: number;
  mine: boolean;
}

export type PromptAck =
  | { ok: true; prompt: PromptPayload }
  | { ok: false; error: string };

export type AddTrackAck = { ok: true } | { ok: false; error: string };

export type MusicPayload = Omit<MusicState, "receivedAt"> & { roomId: string };
