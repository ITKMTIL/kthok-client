import { ChevronDown, ChevronUp, Music, Pause, Play, Volume2 } from "lucide-react";
import { useT } from "@/hooks/use-locale";

export function MusicMiniBar({
  title,
  playing,
  blocked,
  collapsed,
  queueLength,
  controlsDisabled,
  onToggle,
  onResume,
  onCollapsedChange,
}: {
  title: string | null;
  playing: boolean;
  blocked: boolean;
  collapsed: boolean;
  queueLength: number;
  controlsDisabled: boolean;
  onToggle: () => void;
  onResume: () => void;
  onCollapsedChange: (collapsed: boolean) => void;
}) {
  const t = useT();
  const Chevron = collapsed ? ChevronDown : ChevronUp;

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <button
        type="button"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
        aria-expanded={!collapsed}
        aria-controls="music-panel"
        onClick={() => onCollapsedChange(!collapsed)}
      >
        <Music className="size-5 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-bold leading-tight">
            {title ?? t.music.title}
          </span>
          <span className="block truncate text-xs text-ink-soft">
            {title
              ? `${playing ? t.music.playing : t.music.paused} · ${t.music.queueCount(queueLength)}`
              : t.music.tapToOpen}
          </span>
        </span>
        <Chevron className="size-5 shrink-0" aria-hidden />
        <span className="sr-only">{collapsed ? t.music.expand : t.music.collapse}</span>
      </button>
      {collapsed && title && blocked && (
        <button
          type="button"
          className="doodle-btn doodle-btn-primary flex shrink-0 items-center gap-1 px-2 py-1 text-sm font-bold"
          onClick={onResume}
        >
          <Volume2 className="size-4" aria-hidden />
          {t.music.listen}
        </button>
      )}
      {collapsed && title && !blocked && (
        <button
          type="button"
          className="doodle-btn doodle-btn-primary shrink-0 p-1.5"
          disabled={controlsDisabled}
          aria-label={playing ? t.music.pauseSong : t.music.playSong}
          onClick={onToggle}
        >
          {playing ? (
            <Pause className="size-4" aria-hidden />
          ) : (
            <Play className="size-4" aria-hidden />
          )}
        </button>
      )}
    </div>
  );
}
