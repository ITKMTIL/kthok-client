"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { formatClock } from "@/lib/voice";
import { useT } from "@/hooks/use-locale";

export function Waveform({
  peaks,
  progress = 0,
  duration,
  className = "",
  onSeek,
}: {
  peaks: number[];
  progress?: number;
  duration?: number;
  className?: string;
  onSeek?: (fraction: number) => void;
}) {
  const t = useT();
  const bars = (
    <span className="flex h-full w-full min-w-0 items-center gap-px overflow-hidden" aria-hidden>
      {peaks.map((peak, index) => (
        <span
          key={index}
          className={`min-w-0 flex-1 rounded-full transition-colors ${(index + 0.5) / peaks.length <= progress ? "bg-ink" : "bg-current opacity-40"}`}
          style={{ height: `${Math.max(12, peak * 100)}%` }}
        />
      ))}
    </span>
  );

  if (!onSeek || duration === undefined) {
    return <span className={`flex ${className}`}>{bars}</span>;
  }

  const seekFromPointer = (event: PointerEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onSeek(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
  };

  const seekFromKey = (event: KeyboardEvent<HTMLSpanElement>) => {
    const step = 5 / duration;
    if (event.key === "ArrowRight") onSeek(Math.min(1, progress + step));
    else if (event.key === "ArrowLeft") onSeek(Math.max(0, progress - step));
    else return;
    event.preventDefault();
  };

  return (
    <span
      role="slider"
      tabIndex={0}
      aria-label={t.voice.position}
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(progress * duration)}
      aria-valuetext={t.voice.positionText(formatClock(progress * duration), formatClock(duration))}
      className={`flex cursor-pointer touch-none rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
      onPointerDown={(event) => {
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        seekFromPointer(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          seekFromPointer(event);
        }
      }}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={seekFromKey}
    >
      {bars}
    </span>
  );
}
