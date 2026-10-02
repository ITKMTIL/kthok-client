import { User } from "lucide-react";
import { facultyOf } from "@/constants/faculties";
import type { Partner } from "@/types/chat";

export function ChatHeader({
  partner,
  onNext,
  onLeave,
}: {
  partner: Partner | null;
  onNext: () => void;
  onLeave: () => void;
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
      <button type="button" className="doodle-btn px-3 py-1" onClick={onNext}>
        คนถัดไป
      </button>
      <button type="button" className="doodle-btn px-3 py-1" onClick={onLeave}>
        ออก
      </button>
    </header>
  );
}
