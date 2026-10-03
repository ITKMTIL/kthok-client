import { LogOut, Phone, ShieldAlert, SkipForward, User } from "lucide-react";
import { facultyOf } from "@/constants/faculties";
import type { GameType, Partner } from "@/types/chat";
import { ChatMenu } from "./chat-menu";

export function ChatHeader({
  partner,
  canShare,
  onShare,
  onStartGame,
  onReport,
  onBlock,
  canCall,
  onCall,
  onNext,
  onLeave,
  onPanic,
}: {
  partner: Partner | null;
  canShare: boolean;
  onShare: () => void;
  onStartGame: ((type: GameType) => void) | null;
  onReport: (() => void) | null;
  onBlock: (() => void) | null;
  canCall: boolean;
  onCall: (() => void) | null;
  onNext: () => void;
  onLeave: () => void;
  onPanic: (() => void) | null;
}) {
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
          {faculty?.name}
        </p>
      </div>
      <ChatMenu
        canShare={canShare}
        onShare={onShare}
        onStartGame={onStartGame}
        onReport={onReport}
        onBlock={onBlock}
      />
      {onCall && (
        <button
          type="button"
          className="doodle-btn grid size-9 shrink-0 place-items-center"
          disabled={!canCall}
          aria-label="ชวนคุยเสียง"
          title="ชวนคุยเสียง"
          onClick={onCall}
        >
          <Phone className="size-4" aria-hidden />
        </button>
      )}
      {onPanic && (
        <button
          type="button"
          className="doodle-btn grid size-9 shrink-0 place-items-center bg-danger text-card"
          aria-label="ออกฉุกเฉิน: ออกจากห้องและบล็อกทันที"
          title="ออกฉุกเฉิน: ออกและบล็อกทันที"
          onClick={onPanic}
        >
          <ShieldAlert className="size-4" aria-hidden />
        </button>
      )}
      <button
        type="button"
        className="doodle-btn flex h-9 shrink-0 items-center gap-1.5 px-2.5 sm:px-3"
        aria-label="คนถัดไป"
        title="คนถัดไป"
        onClick={onNext}
      >
        <SkipForward className="size-4" aria-hidden />
        <span className="max-sm:hidden">คนถัดไป</span>
      </button>
      <button
        type="button"
        className="doodle-btn flex h-9 shrink-0 items-center gap-1.5 px-2.5 sm:px-3"
        aria-label="ออกจากห้อง"
        title="ออกจากห้อง"
        onClick={onLeave}
      >
        <LogOut className="size-4" aria-hidden />
        <span className="max-sm:hidden">ออก</span>
      </button>
    </header>
  );
}
