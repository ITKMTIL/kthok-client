"use client";

import { Pause, Play } from "lucide-react";
import { formatClock } from "@/lib/voice";
import { useVoicePlayer, voicePlayer } from "@/lib/voice-player";
import type { ChatMessage, VoiceClip } from "@/types/chat";
import { Waveform } from "./waveform";

export function VoiceBubble({
  id,
  voice,
  mine,
}: {
  id: string;
  voice: VoiceClip;
  mine: ChatMessage["mine"];
}) {
  const player = useVoicePlayer();
  const current = player.id === id;
  const playing = current && player.playing;
  const position = current ? player.position : 0;
  const progress = voice.duration > 0 ? Math.min(1, position / voice.duration) : 0;

  return (
    <span className="flex w-60 max-w-full items-center gap-2">
      <button
        type="button"
        className={`grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${mine ? "bg-card" : "bg-accent-soft"}`}
        aria-label={playing ? "หยุดข้อความเสียง" : "เล่นข้อความเสียง"}
        onClick={(event) => {
          event.stopPropagation();
          voicePlayer.toggle(id, voice.url);
        }}
      >
        {playing ? (
          <Pause className="size-4 fill-current" aria-hidden />
        ) : (
          <Play className="ml-0.5 size-4 fill-current" aria-hidden />
        )}
      </button>
      <Waveform
        peaks={voice.peaks}
        progress={progress}
        duration={voice.duration}
        className="h-8 min-w-0 flex-1"
        onSeek={(fraction) =>
          voicePlayer.seek(id, voice.url, fraction * voice.duration)
        }
      />
      <span className="flex w-10 shrink-0 flex-col items-end text-xs leading-tight tabular-nums">
        <span>{formatClock(current && position > 0 ? position : voice.duration)}</span>
        {current && (
          <button
            type="button"
            className="cursor-pointer rounded font-bold focus-visible:outline-2 focus-visible:outline-accent"
            aria-label={`ความเร็ว ${player.rate} เท่า กดเพื่อเปลี่ยน`}
            onClick={(event) => {
              event.stopPropagation();
              voicePlayer.cycleRate();
            }}
          >
            {player.rate}x
          </button>
        )}
      </span>
    </span>
  );
}
