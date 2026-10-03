import { Pause, Play, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useT } from "@/hooks/use-locale";

export function PlayerControls({
  playing,
  muted,
  disabled,
  onToggle,
  onSkip,
  onToggleMute,
}: {
  playing: boolean;
  muted: boolean;
  disabled: boolean;
  onToggle: () => void;
  onSkip: () => void;
  onToggleMute: () => void;
}) {
  const t = useT();
  const muteLabel = muted ? t.music.unmute : t.music.mute;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="doodle-btn doodle-btn-primary flex items-center gap-1.5 px-3 py-1 font-bold"
        disabled={disabled}
        onClick={onToggle}
      >
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
        {playing ? t.music.pause : t.music.play}
      </button>
      <button
        type="button"
        className="doodle-btn flex items-center gap-1.5 px-3 py-1"
        disabled={disabled}
        onClick={onSkip}
      >
        <SkipForward className="size-4" aria-hidden />
        {t.music.skip}
      </button>
      <button
        type="button"
        className="doodle-btn px-3 py-1"
        onClick={onToggleMute}
        aria-pressed={muted}
        aria-label={muteLabel}
        title={muteLabel}
      >
        {muted ? <VolumeX className="size-5" aria-hidden /> : <Volume2 className="size-5" aria-hidden />}
      </button>
    </div>
  );
}
