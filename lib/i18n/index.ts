import { en } from "./en";
import { th } from "./th";
import type { Dict } from "./types";

export type { Dict } from "./types";

export const LOCALES = ["th", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DICTS: Record<Locale, Dict> = { th, en };

export function errorText(
  map: Readonly<Record<string, string>>,
  code: string | undefined,
  fallback: string,
): string {
  return (code !== undefined ? map[code] : undefined) ?? fallback;
}

export function promptText(dict: Dict, key: string): string {
  const [group, index] = key.split(".");
  const list = dict.prompts[group as keyof Dict["prompts"]];
  return list?.[Number(index)] ?? "";
}
