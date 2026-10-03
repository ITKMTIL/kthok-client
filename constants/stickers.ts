export const STICKERS = [
  { id: "hello", label: "หวัดดี" },
  { id: "train", label: "ปู๊น ๆ" },
  { id: "laugh", label: "ขำ" },
  { id: "cry", label: "ร้องไห้" },
  { id: "love", label: "ปลื้ม" },
  { id: "sleepy", label: "ง่วง" },
  { id: "hungry", label: "หิว" },
  { id: "study", label: "อ่านไม่ทัน" },
  { id: "thanks", label: "ขอบคุณ" },
  { id: "bye", label: "บาย" },
] as const;

export type StickerId = (typeof STICKERS)[number]["id"];

export function stickerLabel(id: StickerId): string {
  return STICKERS.find((sticker) => sticker.id === id)?.label ?? id;
}
