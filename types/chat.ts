import type { FacultyId } from "@/constants/faculties";

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

export interface ChatState {
  connected: boolean;
  selfFaculty: FacultyId | null;
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

export interface MatchedPayload {
  roomId: string;
  partner: Partner;
  preferenceMet: boolean;
}

export type FindAck =
  | ({ ok: true; status: "matched" } & MatchedPayload)
  | { ok: true; status: "waiting"; roomId: string }
  | { ok: false; error: string };

export type SendAck =
  | { ok: true; message: Omit<ChatMessage, "mine"> }
  | { ok: false; error: string };

export type AddTrackAck = { ok: true } | { ok: false; error: string };

export type MusicPayload = Omit<MusicState, "receivedAt"> & { roomId: string };
