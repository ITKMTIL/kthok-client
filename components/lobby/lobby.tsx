"use client";

import { useState } from "react";
import { Hero } from "@/components/ui/hero";
import { SiteFooter } from "@/components/ui/site-footer";
import type { FacultyId } from "@/constants/faculties";
import type { Profile } from "@/types/auth";
import { FacultyPreference } from "./faculty-preference";
import { OnlineCount } from "./online-count";
import { ProfileCard } from "./profile-card";

export function Lobby({
  profile,
  facultyLocked,
  connected,
  online,
  error,
  onProfileChange,
  onFind,
}: {
  profile: Profile | undefined;
  facultyLocked: boolean;
  connected: boolean;
  online: number | null;
  error: string | null;
  onProfileChange: (profile: Profile) => void;
  onFind: (prefers: FacultyId | null) => void;
}) {
  const [prefers, setPrefers] = useState<FacultyId | null>(null);
  const ready =
    profile !== undefined &&
    profile.nickname.trim() !== "" &&
    profile.faculty !== null;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-6 px-4 pb-6 pt-6 text-center">
      <Hero bubble="ทอล์คมั้ย?" />
      <OnlineCount online={online} connected={connected} />
      <ProfileCard
        profile={profile}
        facultyLocked={facultyLocked}
        onChange={onProfileChange}
      />
      <FacultyPreference value={prefers} onChange={setPrefers} />

      {error && (
        <p role="alert" className="font-medium text-danger">
          {error}
        </p>
      )}

      <button
        type="button"
        className="doodle-btn doodle-btn-primary px-10 py-3 text-2xl font-bold"
        disabled={!ready || !connected}
        onClick={() => onFind(prefers)}
      >
        หาเพื่อนคุย
      </button>
      {!connected && (
        <p className="-mt-3 text-sm text-ink-soft">
          ยังต่อเซิร์ฟเวอร์ไม่ได้ กำลังลองใหม่ให้อยู่…
        </p>
      )}
      <SiteFooter />
    </main>
  );
}
