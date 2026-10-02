import { useSyncExternalStore } from "react";
import { FACULTIES, facultyOf, type FacultyId } from "./faculties";

export interface Profile {
  nickname: string;
  faculty: FacultyId;
}

const STORAGE_KEY = "kthok:profile";

const ALIAS_HEADS = ["ชาไทย", "หมูกรอบ", "ไข่เจียว", "โกโก้", "มาม่า", "ลูกชิ้น", "ชานม", "กะเพรา", "ปังปิ้ง", "น้ำแดง"];
const ALIAS_TAILS = ["ง่วงนอน", "ขี้เหงา", "สายชิล", "ติดแล็บ", "ตื่นสาย", "หิวข้าว", "อ่านไม่ทัน", "รอรถไฟ", "ปั่นงาน", "นอนดึก"];

const pick = <T,>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)];

export function randomNickname(): string {
  return pick(ALIAS_HEADS) + pick(ALIAS_TAILS);
}

let cached: Profile | undefined;
const listeners = new Set<() => void>();

function load(): Profile {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (typeof stored?.nickname === "string" && facultyOf(stored?.faculty)) {
      return { nickname: stored.nickname, faculty: stored.faculty };
    }
  } catch {}
  const fresh = { nickname: randomNickname(), faculty: pick(FACULTIES).id };
  persist(fresh);
  return fresh;
}

function persist(profile: Profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}

function getSnapshot(): Profile {
  return (cached ??= load());
}

export function saveProfile(profile: Profile) {
  cached = profile;
  persist(profile);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useProfile(): Profile | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
