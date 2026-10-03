import { useCallback, useEffect } from "react";
import { createStoredValue } from "@/lib/storage";
import { THEME_KEY, THEMES, type Theme } from "@/lib/theme";

const themeStore = createStoredValue<Theme>(
  THEME_KEY,
  (raw) => (THEMES.includes(raw as Theme) ? (raw as Theme) : undefined),
  () => "system",
);

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function useTheme(): [Theme, () => void] {
  const theme = themeStore.use() ?? "system";

  useEffect(() => apply(theme), [theme]);

  const cycle = useCallback(() => {
    const next = THEMES[(THEMES.indexOf(themeStore.get()) + 1) % THEMES.length];
    themeStore.set(next);
  }, []);

  return [theme, cycle];
}
