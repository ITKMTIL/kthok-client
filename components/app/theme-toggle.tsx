"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import type { Theme } from "@/lib/theme";

const LABELS: Record<Theme, string> = {
  system: "ธีมตามเครื่อง",
  light: "ธีมสว่าง",
  dark: "ธีมมืด",
};

export function ThemeToggle() {
  const [theme, cycle] = useTheme();
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <button
      type="button"
      className="grid size-8 cursor-pointer place-items-center rounded-full text-ink hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent"
      aria-label={`${LABELS[theme]} กดเพื่อเปลี่ยน`}
      title={LABELS[theme]}
      onClick={cycle}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
