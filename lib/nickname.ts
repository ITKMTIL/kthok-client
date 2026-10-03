import type { Dict } from "@/lib/i18n";

export const MAX_NICKNAME_LENGTH = 24;

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function randomNickname(dict: Dict): string {
  return pick(dict.nickname.heads) + pick(dict.nickname.tails);
}
