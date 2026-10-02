import { CircleCheck, Shuffle } from "lucide-react";
import { facultyOf, type FacultyId } from "@/constants/faculties";

export function MatchNotice({
  prefers,
  preferenceMet,
}: {
  prefers: FacultyId | null;
  preferenceMet: boolean;
}) {
  const preferred = prefers ? facultyOf(prefers) : undefined;
  if (!preferred) return null;

  const Icon = preferenceMet ? CircleCheck : Shuffle;

  return (
    <p
      className={`flex items-center gap-2.5 rounded-2xl border-2 border-ink px-4 py-2.5 font-bold ${preferenceMet ? "bg-safe-soft" : "bg-accent-soft"}`}
      role="status"
    >
      <Icon
        className={`size-6 shrink-0 ${preferenceMet ? "text-safe" : "text-accent"}`}
        aria-hidden
      />
      <span className="min-w-0">
        {preferenceMet ? (
          <>ตรงคณะที่ขอ: {preferred.name}</>
        ) : (
          <>
            ไม่มีเด็ก{preferred.short}ว่างตอนนี้
            <span className="font-medium"> เลยจับคู่ให้ห้องนี้แทน</span>
          </>
        )}
      </span>
    </p>
  );
}
