"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useT } from "@/hooks/use-locale";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const [theme, cycle] = useTheme();
  const t = useT();
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const label = t.theme[theme];

  return (
    <button
      type="button"
      className="grid size-8 cursor-pointer place-items-center rounded-full text-ink hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent"
      aria-label={t.theme.tapToChange(label)}
      title={label}
      onClick={cycle}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
