import { FACULTIES, facultyOf } from "@/constants/faculties";
import { AUTH_REQUIRED } from "@/lib/config";
import { pick, randomNickname } from "@/lib/nickname";
import { createStoredValue } from "@/lib/storage";
import type { StoredProfile } from "@/types/auth";

const profileStore = createStoredValue<StoredProfile>(
  "kthok:profile",
  (raw) => {
    const stored = raw as Partial<StoredProfile> | null;
    if (typeof stored?.nickname !== "string") return undefined;
    if (AUTH_REQUIRED) return { nickname: stored.nickname };
    const faculty = facultyOf(String(stored.faculty));
    return faculty ? { nickname: stored.nickname, faculty: faculty.id } : undefined;
  },
  () =>
    AUTH_REQUIRED
      ? { nickname: randomNickname() }
      : { nickname: randomNickname(), faculty: pick(FACULTIES).id },
);

export function saveProfile(profile: StoredProfile) {
  profileStore.set(
    AUTH_REQUIRED ? { nickname: profile.nickname } : profile,
  );
}

export function useProfile(): StoredProfile | undefined {
  return profileStore.use();
}
