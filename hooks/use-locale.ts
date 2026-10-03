import { useEffect } from "react";
import { DICTS, LOCALES, type Dict, type Locale } from "@/lib/i18n";
import { createStoredValue } from "@/lib/storage";

export const localeStore = createStoredValue<Locale>(
  "kthok:locale",
  (raw) => (LOCALES.includes(raw as Locale) ? (raw as Locale) : undefined),
  () => "th",
);

export function currentDict(): Dict {
  return DICTS[localeStore.get()];
}

export function useLocale(): [Locale, (locale: Locale) => void] {
  const locale = localeStore.use() ?? "th";
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return [locale, localeStore.set];
}

export function useT(): Dict {
  return DICTS[localeStore.use() ?? "th"];
}
