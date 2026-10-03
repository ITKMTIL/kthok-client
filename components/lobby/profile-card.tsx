import { Check, Dices } from "lucide-react";
import { FACULTIES, facultyOf, type FacultyId } from "@/constants/faculties";
import { useT } from "@/hooks/use-locale";
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
  const t = useT();
  const nicknameMissing = profile !== undefined && !profile.nickname.trim();
  const faculty = profile?.faculty ? facultyOf(profile.faculty) : undefined;

  return (
    <section className="doodle-card w-full p-5 text-left">
      <h2 className="text-lg font-bold">{t.lobby.profileTitle}</h2>
      <p className="text-sm text-ink-soft">
        {t.lobby.profileHint}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="nickname" className="text-sm font-medium">
            {t.lobby.nickname}
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="nickname"
              className="doodle-field min-w-0 flex-1"
              value={profile?.nickname ?? ""}
              onChange={(event) =>
                profile && onChange({ ...profile, nickname: event.target.value })
              }
              placeholder={t.lobby.nicknamePlaceholder}
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
                profile && onChange({ ...profile, nickname: randomNickname(t) })
              }
              aria-label={t.lobby.randomNickname}
              title={t.lobby.randomNickname}
            >
              <Dices className="size-5" aria-hidden />
            </button>
          </div>
          {nicknameMissing && (
            <p id="nickname-hint" className="mt-1 text-sm text-danger">
              {t.lobby.nicknameMissing}
            </p>
          )}
        </div>

        {facultyLocked ? (
          <div>
            <span className="text-sm font-medium">{t.lobby.yourFaculty}</span>
            <output className="doodle-field mt-1 flex w-full items-center gap-2 bg-paper">
              {faculty && <faculty.icon className="size-4 shrink-0" aria-hidden />}
              <span className="truncate">{faculty ? t.faculties[faculty.id].name : "…"}</span>
            </output>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-safe">
              <Check className="size-3.5" aria-hidden />
              {t.lobby.verified}
            </p>
          </div>
        ) : (
          <label>
            <span className="text-sm font-medium">{t.lobby.yourFaculty}</span>
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
                  {t.faculties[option.id].name}
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
