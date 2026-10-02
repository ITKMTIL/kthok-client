import { Bell, BellOff } from "lucide-react";

export function AppHeader({
  connected,
  selfName,
  soundMuted,
  onToggleSound,
  onSignOut,
}: {
  connected: boolean;
  selfName: string | null;
  soundMuted: boolean;
  onToggleSound: () => void;
  onSignOut: (() => void) | null;
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 py-3">
      <span className="shrink-0 text-2xl font-bold tracking-wide">
        K<span className="text-accent">-</span>THOK
      </span>
      {selfName && (
        <span className="min-w-0 flex-1 truncate text-center text-sm">
          <span className="text-ink-soft">เธอคือ </span>
          <span className="font-bold">{selfName}</span>
        </span>
      )}
      <span className="flex shrink-0 items-center gap-2 text-sm text-ink-soft">
        <span>
          <span
            className={`mr-1.5 inline-block size-2.5 rounded-full border-2 border-ink ${connected ? "bg-online" : "bg-paper"}`}
            aria-hidden
          />
          {connected ? "ออนไลน์" : "ออฟไลน์"}
        </span>
        <button
          type="button"
          className="grid size-8 cursor-pointer place-items-center rounded-full text-ink hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent"
          aria-pressed={!soundMuted}
          aria-label={soundMuted ? "เปิดเสียงแจ้งเตือน" : "ปิดเสียงแจ้งเตือน"}
          title={soundMuted ? "เปิดเสียงแจ้งเตือน" : "ปิดเสียงแจ้งเตือน"}
          onClick={onToggleSound}
        >
          {soundMuted ? (
            <BellOff className="size-4" aria-hidden />
          ) : (
            <Bell className="size-4" aria-hidden />
          )}
        </button>
        {onSignOut && (
          <button type="button" className="doodle-btn px-2 py-0.5" onClick={onSignOut}>
            ออกจากระบบ
          </button>
        )}
      </span>
    </header>
  );
}
