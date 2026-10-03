"use client";

import { Ban, HeartHandshake, ShieldAlert, UserX } from "lucide-react";
import { useEffect, useRef } from "react";
import { useT } from "@/hooks/use-locale";

const RULES = [
  { id: "respect", icon: HeartHandshake },
  { id: "noHate", icon: Ban },
  { id: "anonymity", icon: UserX },
  { id: "trouble", icon: ShieldAlert },
] as const;

export function RulesDialog({
  onAccept,
  onClose,
}: {
  onAccept: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="doodle-card m-auto flex max-h-[calc(var(--app-height,100dvh)-1.5rem)] w-[min(26rem,calc(100vw-1.5rem))] flex-col gap-3 overflow-y-auto p-5 text-left backdrop:bg-ink/50"
      aria-labelledby="rules-title"
      onClose={onClose}
    >
      <h2 id="rules-title" className="text-xl font-bold">
        {t.safety.rulesTitle}
      </h2>
      <ul className="flex flex-col gap-3">
        {RULES.map(({ id, icon: Icon }) => (
          <li key={id} className="flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-accent-soft">
              <Icon className="size-4" aria-hidden />
            </span>
            <span>
              <span className="block font-bold">{t.safety.rules[id].title}</span>
              <span className="block text-sm text-ink-soft">{t.safety.rules[id].body}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-1 flex gap-2">
        <button
          type="button"
          className="doodle-btn flex-1 px-3 py-2"
          onClick={() => dialogRef.current?.close()}
        >
          {t.safety.later}
        </button>
        <button
          type="button"
          className="doodle-btn doodle-btn-primary flex-[2] px-3 py-2 font-bold"
          onClick={onAccept}
        >
          {t.safety.accept}
        </button>
      </div>
    </dialog>
  );
}
