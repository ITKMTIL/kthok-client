import { LogOut, Music, Phone, SkipForward, User } from "lucide-react";
import { PanicButton } from "@/components/safety/panic-button";
import { facultyOf, facultyText } from "@/constants/faculties";
import { useT } from "@/hooks/use-locale";
import type { GameType, Partner } from "@/types/chat";
import { ChatMenu } from "./chat-menu";

export function ChatHeader({
  partner,
  canShare,
  onShare,
  onStartGame,
  onReport,
  readReceipts,
  onToggleReadReceipts,
  onBlock,
  canCall,
  onCall,
  onNext,
  onLeave,
  onPanic,
  music,
}: {
  partner: Partner | null;
  canShare: boolean;
  onShare: () => void;
  onStartGame: ((type: GameType) => void) | null;
  onReport: (() => void) | null;
  readReceipts: boolean;
  onToggleReadReceipts: () => void;
  onBlock: (() => void) | null;
  canCall: boolean;
  onCall: (() => void) | null;
  onNext: () => void;
  onLeave: () => void;
  onPanic: (() => void) | null;
  music: { open: boolean; playing: boolean; onToggle: () => void };
}) {
  const t = useT();
  const faculty = partner ? facultyOf(partner.faculty) : undefined;
  const FacultyIcon = faculty?.icon ?? User;

  return (
    <header className="doodle-card flex items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-accent-soft sm:size-11">
        <FacultyIcon className="size-5 sm:size-6" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-bold leading-tight sm:text-lg">{partner?.nickname}</h1>
        <p className="truncate text-sm text-ink-soft">
          {partner && facultyText(t, partner.faculty)?.name}
        </p>
      </div>
      <button
        type="button"
        className={`doodle-btn relative grid size-9 shrink-0 place-items-center lg:hidden ${music.open ? "bg-accent-soft" : ""}`}
        aria-label={t.music.title}
        aria-expanded={music.open}
        aria-controls="music-panel"
        title={t.music.title}
        onClick={music.onToggle}
      >
        <Music className="size-4" aria-hidden />
        {music.playing && (
          <span
            className="absolute -right-1 -top-1 size-3 animate-pulse rounded-full border-2 border-ink bg-online"
            aria-hidden
          />
        )}
      </button>
      <ChatMenu
        canShare={canShare}
        onShare={onShare}
        onStartGame={onStartGame}
        onReport={onReport}
        readReceipts={readReceipts}
        onToggleReadReceipts={onToggleReadReceipts}
        onBlock={onBlock}
        onLeave={onLeave}
        onPanic={onPanic}
      />
      {onCall && (
        <button
          type="button"
          className="doodle-btn grid size-9 shrink-0 place-items-center"
          disabled={!canCall}
          aria-label={t.room.call}
          title={t.room.call}
          onClick={onCall}
        >
          <Phone className="size-4" aria-hidden />
        </button>
      )}
      {onPanic && (
        <span className="max-sm:hidden">
          <PanicButton onConfirm={onPanic} />
        </span>
      )}
      <button
        type="button"
        className="doodle-btn flex h-9 shrink-0 items-center gap-1.5 px-2.5 sm:px-3"
        aria-label={t.room.next}
        title={t.room.next}
        onClick={onNext}
      >
        <SkipForward className="size-4" aria-hidden />
        <span className="max-sm:hidden">{t.room.next}</span>
      </button>
      <button
        type="button"
        className="doodle-btn flex h-9 shrink-0 items-center gap-1.5 px-2.5 max-sm:hidden sm:px-3"
        aria-label={t.room.leave}
        title={t.room.leave}
        onClick={onLeave}
      >
        <LogOut className="size-4" aria-hidden />
        <span className="max-sm:hidden">{t.room.leaveShort}</span>
      </button>
    </header>
  );
}
