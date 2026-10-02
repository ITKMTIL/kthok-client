"use client";

import { CircleCheck, Shuffle, X } from "lucide-react";
import { useState } from "react";
import { SlideIn } from "@/components/ui/slide-in";
import { facultyOf, type FacultyId } from "@/constants/faculties";

export function MatchNotice({
  prefers,
  preferenceMet,
}: {
  prefers: FacultyId | null;
  preferenceMet: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  const preferred = prefers ? facultyOf(prefers) : undefined;
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
          <>ตรงคณะที่ขอ: {preferred.name}</>
        ) : (
          <>
            ไม่มีเด็ก{preferred.short}ว่างตอนนี้
            <span className="font-medium"> เลยจับคู่ให้ห้องนี้แทน</span>
          </>
        )}
      </span>
      <button
        type="button"
        className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-card focus-visible:outline-2 focus-visible:outline-accent"
        aria-label="ปิดข้อความนี้"
        onClick={() => setDismissed(true)}
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
    </SlideIn>
  );
}
