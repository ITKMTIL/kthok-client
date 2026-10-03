"use client";

import { BellRing, LoaderCircle } from "lucide-react";
import type { usePush } from "@/hooks/use-push";
import { useT } from "@/hooks/use-locale";

export function PushToggle({ push }: { push: ReturnType<typeof usePush> }) {
  const t = useT();
  if (!push.available || push.support === "unsupported") return null;

  if (push.support === "needs-install") {
    return (
      <p className="flex items-center gap-2 text-left text-sm text-ink-soft">
        <BellRing className="size-4 shrink-0" aria-hidden />
        {t.push.install}
      </p>
    );
  }

  const on = push.status === "on";
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-ink px-4 py-2 text-left">
      <BellRing className="size-5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-bold">{t.push.title}</p>
        <p className="text-xs text-ink-soft">{t.push.hints[push.status]}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={t.push.title}
        className={`doodle-btn shrink-0 px-3 py-1 text-sm font-bold ${on ? "doodle-btn-primary" : ""}`}
        disabled={push.status === "busy" || push.status === "denied"}
        onClick={() => void (on ? push.disable() : push.enable())}
      >
        {push.status === "busy" ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden />
        ) : on ? (
          t.push.on
        ) : (
          t.push.turnOn
        )}
      </button>
    </div>
  );
}
