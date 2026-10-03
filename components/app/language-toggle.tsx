"use client";

import { Languages } from "lucide-react";
import { useLocale, useT } from "@/hooks/use-locale";

export function LanguageToggle() {
  const [locale, setLocale] = useLocale();
  const t = useT();

  return (
    <button
      type="button"
      className="flex h-8 cursor-pointer items-center gap-1 rounded-full px-2 text-xs font-bold text-ink hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent"
      aria-label={t.header.switchLanguage}
      title={t.header.switchLanguage}
      onClick={() => setLocale(locale === "th" ? "en" : "th")}
    >
      <Languages className="size-4" aria-hidden />
      {locale === "th" ? "TH" : "EN"}
    </button>
  );
}
