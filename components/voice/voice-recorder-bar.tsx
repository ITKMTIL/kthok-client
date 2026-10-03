"use client";

import { SendHorizontal, Trash2 } from "lucide-react";
import { formatClock, MAX_VOICE_SECONDS, VOICE_LIVE_BARS } from "@/lib/voice";
import { useT } from "@/hooks/use-locale";

export function VoiceRecorderBar({
  elapsed,
  live,
  onCancel,
  onSend,
}: {
  elapsed: number;
  live: number[];
  onCancel: () => void;
  onSend: () => void;
}) {
  const t = useT();
  const bars = [
    ...Array.from({ length: Math.max(0, VOICE_LIVE_BARS - live.length) }, () => 0),
    ...live,
  ];
  const nearLimit = MAX_VOICE_SECONDS - elapsed <= 10;

  return (
    <div className="flex items-center gap-2" role="group" aria-label={t.voice.recording}>
      <button
        type="button"
        className="doodle-btn grid size-11 shrink-0 place-items-center p-0"
        aria-label={t.voice.cancel}
        onClick={onCancel}
      >
        <Trash2 className="size-5" aria-hidden />
      </button>
      <div className="doodle-field flex min-w-0 flex-1 items-center gap-3">
        <span className="relative flex size-3 shrink-0" aria-hidden>
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-60" />
          <span className="relative inline-flex size-3 rounded-full bg-danger" />
        </span>
        <span
          className={`shrink-0 text-sm tabular-nums ${nearLimit ? "font-bold text-danger" : ""}`}
          aria-live="off"
        >
          {formatClock(elapsed)} / {formatClock(MAX_VOICE_SECONDS)}
        </span>
        <span className="flex h-6 min-w-0 flex-1 items-center justify-end gap-[2px] overflow-hidden" aria-hidden>
          {bars.map((level, index) => (
            <span
              key={index}
              className="w-[3px] shrink-0 rounded-full bg-ink/70"
              style={{ height: `${Math.max(10, Math.min(1, level * 1.6) * 100)}%` }}
            />
          ))}
        </span>
      </div>
      <button
        type="button"
        className="doodle-btn doodle-btn-primary grid size-11 shrink-0 place-items-center p-0"
        aria-label={t.voice.send}
        onClick={onSend}
      >
        <SendHorizontal className="size-5" aria-hidden />
      </button>
    </div>
  );
}
