"use client";

import { useMemo, useState } from "react";
import { Hero } from "@/components/ui/hero";
import { SiteFooter } from "@/components/ui/site-footer";
import type { FacultyId } from "@/constants/faculties";
import { DEFAULT_TOPIC, type TopicId } from "@/constants/topics";
import type { Profile } from "@/types/auth";
import type { SearchOptions, WaitingSummary } from "@/types/chat";
import { FacultyPreference } from "./faculty-preference";
import { OnlineCount } from "./online-count";
import { ProfileCard } from "./profile-card";
import { TopicPicker } from "./topic-picker";

export function Lobby({
  profile,
  facultyLocked,
  connected,
  online,
  waiting,
  error,
  onProfileChange,
  onFind,
}: {
  profile: Profile | undefined;
  facultyLocked: boolean;
  connected: boolean;
  online: number | null;
  waiting: WaitingSummary | null;
  error: string | null;
  onProfileChange: (profile: Profile) => void;
  onFind: (options: SearchOptions) => void;
}) {
  const [prefers, setPrefers] = useState<FacultyId | null>(null);
  const [topic, setTopic] = useState<TopicId>(DEFAULT_TOPIC);
  const waitingFaculties = useMemo(
    () => new Set<string>(waiting?.faculties),
    [waiting],
  );
  const waitingTopics = useMemo(
    () => new Set<string>(waiting?.topics),
    [waiting],
  );
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
      <TopicPicker value={topic} waiting={waitingTopics} onChange={setTopic} />
      <FacultyPreference
        value={prefers}
        waiting={waitingFaculties}
        onChange={setPrefers}
      />

      {error && (
        <p role="alert" className="font-medium text-danger">
          {error}
        </p>
      )}

      <button
        type="button"
        className="doodle-btn doodle-btn-primary px-10 py-3 text-2xl font-bold"
        disabled={!ready || !connected}
        onClick={() => onFind({ prefers, topic })}
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
