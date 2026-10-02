export function AppHeader({
  connected,
  selfName,
  onSignOut,
}: {
  connected: boolean;
  selfName: string | null;
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
      <span className="flex shrink-0 items-center gap-3 text-sm text-ink-soft">
        <span>
          <span
            className={`mr-1.5 inline-block size-2.5 rounded-full border-2 border-ink ${connected ? "bg-online" : "bg-paper"}`}
            aria-hidden
          />
          {connected ? "ออนไลน์" : "ออฟไลน์"}
        </span>
        {onSignOut && (
          <button type="button" className="doodle-btn px-2 py-0.5" onClick={onSignOut}>
            ออกจากระบบ
          </button>
        )}
      </span>
    </header>
  );
}
