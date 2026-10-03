"use client";

import { CircleCheck, Shuffle, X } from "lucide-react";
import { useState } from "react";
import { SlideIn } from "@/components/ui/slide-in";
import { facultyText, type FacultyId } from "@/constants/faculties";
import { useT } from "@/hooks/use-locale";

export function MatchNotice({
  prefers,
  preferenceMet,
}: {
  prefers: FacultyId | null;
  preferenceMet: boolean;
}) {
  const t = useT();
  const [dismissed, setDismissed] = useState(false);
  const preferred = prefers ? facultyText(t, prefers) : undefined;
  if (!preferred || dismissed) return null;

  const Icon = preferenceMet ? CircleCheck : Shuffle;

  return (
    <SlideIn>
    <div
      className={`flex items-center gap-2.5 rounded-2xl border-2 border-ink px-3 py-1.5 text-sm font-bold sm:px-4 sm:py-2.5 sm:text-base ${preferenceMet ? "bg-safe-soft" : "bg-accent-soft"}`}
      role="status"
    >
      <Icon
        className={`size-6 shrink-0 ${preferenceMet ? "text-safe" : "text-accent"}`}
        aria-hidden
      />
      <span className="min-w-0 flex-1">
        {preferenceMet ? (
          t.room.preferenceMet(preferred.name)
        ) : (
          <>
            {t.room.preferenceMissed(preferred.short)}
            <span className="font-medium"> {t.room.preferenceFallback}</span>
          </>
        )}
      </span>
      <button
        type="button"
        className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-card focus-visible:outline-2 focus-visible:outline-accent"
        aria-label={t.common.dismiss}
        onClick={() => setDismissed(true)}
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
    </SlideIn>
  );
}
