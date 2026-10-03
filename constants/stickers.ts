import type { Dict } from "@/lib/i18n";

export const STICKERS = [
  { id: "hello" },
  { id: "train" },
  { id: "laugh" },
  { id: "cry" },
  { id: "love" },
  { id: "sleepy" },
  { id: "hungry" },
  { id: "study" },
  { id: "thanks" },
  { id: "bye" },
] as const;

export type StickerId = (typeof STICKERS)[number]["id"];

export function stickerLabel(dict: Dict, id: StickerId): string {
  return dict.stickers.labels[id];
}
