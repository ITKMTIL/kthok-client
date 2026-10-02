import { Check, Dices } from "lucide-react";
import { FACULTIES, facultyOf, type FacultyId } from "@/constants/faculties";
import { PrivacyNote } from "@/components/ui/privacy-note";
import { MAX_NICKNAME_LENGTH, randomNickname } from "@/lib/nickname";
import type { Profile } from "@/types/auth";

export function ProfileCard({
  profile,
  facultyLocked,
  onChange,
}: {
  profile: Profile | undefined;
  facultyLocked: boolean;
  onChange: (profile: Profile) => void;
}) {
  const nicknameMissing = profile !== undefined && !profile.nickname.trim();
  const faculty = profile?.faculty ? facultyOf(profile.faculty) : undefined;

  return (
    <section className="doodle-card w-full p-5 text-left">
      <h2 className="text-lg font-bold">ตัวตนของเธอในห้อง</h2>
      <p className="text-sm text-ink-soft">
        ตั้งนามแฝงเองหรือกดสุ่มก็ได้ อีกฝ่ายจะเห็นแค่ชื่อนี้กับคณะ
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="nickname" className="text-sm font-medium">
            นามแฝง
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="nickname"
              className="doodle-field min-w-0 flex-1"
              value={profile?.nickname ?? ""}
              onChange={(event) =>
                profile && onChange({ ...profile, nickname: event.target.value })
              }
              placeholder="ตั้งชื่อที่อยากให้เพื่อนเห็น"
              maxLength={MAX_NICKNAME_LENGTH}
              disabled={!profile}
              autoComplete="off"
              aria-invalid={profile ? nicknameMissing : undefined}
              aria-describedby={nicknameMissing ? "nickname-hint" : undefined}
            />
            <button
              type="button"
              className="doodle-btn px-3"
              disabled={!profile}
              onClick={() =>
                profile && onChange({ ...profile, nickname: randomNickname() })
              }
              aria-label="สุ่มนามแฝงใหม่"
              title="สุ่มนามแฝงใหม่"
            >
              <Dices className="size-5" aria-hidden />
            </button>
          </div>
          {nicknameMissing && (
            <p id="nickname-hint" className="mt-1 text-sm text-danger">
              ตั้งนามแฝงก่อนนะ หรือกดปุ่มลูกเต๋าให้สุ่มให้
            </p>
          )}
        </div>

        {facultyLocked ? (
          <div>
            <span className="text-sm font-medium">คณะของเธอ</span>
            <output className="doodle-field mt-1 flex w-full items-center gap-2 bg-paper">
              {faculty && <faculty.icon className="size-4 shrink-0" aria-hidden />}
              <span className="truncate">{faculty?.name ?? "…"}</span>
            </output>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-safe">
              <Check className="size-3.5" aria-hidden />
              ยืนยันจากรหัสนักศึกษาแล้ว
            </p>
          </div>
        ) : (
          <label>
            <span className="text-sm font-medium">คณะของเธอ</span>
            <select
              className="doodle-field mt-1 w-full"
              disabled={!profile}
              value={profile?.faculty ?? ""}
              onChange={(event) =>
                profile &&
                onChange({ ...profile, faculty: event.target.value as FacultyId })
              }
            >
              {!profile && <option value="">…</option>}
              {FACULTIES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {facultyLocked && <PrivacyNote className="mt-4" />}
    </section>
  );
}
