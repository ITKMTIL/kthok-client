"use client";

import { useState } from "react";
import { FACULTIES, type FacultyId } from "@/lib/faculties";
import { randomNickname, saveProfile, type Profile } from "@/lib/profile";
import { Mascot } from "./mascot";

const MAX_NICKNAME_LENGTH = 24;

export function Lobby({
  profile,
  connected,
  online,
  error,
  onFind,
}: {
  profile: Profile | null;
  connected: boolean;
  online: number | null;
  error: string | null;
  onFind: (profile: Profile, prefers: FacultyId | null) => void;
}) {
  const [prefers, setPrefers] = useState<FacultyId | null>(null);
  const nickname = profile?.nickname.trim() ?? "";

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-6 px-4 pb-12 pt-6 text-center">
      <div>
        <h1 className="text-3xl font-bold leading-snug sm:text-4xl">
          คุยกับเพื่อนใหม่ในรั้ว <span className="text-accent">สจล.</span>
        </h1>
        <p className="mt-1 text-lg text-ink-soft">
          ไม่ต้องปัด ไม่ต้องแมตช์ กดแล้วจับคู่ให้เลย แบบไม่มีใครรู้ว่าใครเป็นใคร
        </p>
      </div>

      <Mascot bubble="ทอล์คมั้ย?" className="w-60 max-w-full" />

      <p className="text-xl" aria-live="polite">
        {online === null ? (
          <span className="text-ink-soft">
            {connected ? "กำลังนับคน…" : "กำลังเชื่อมต่อเซิร์ฟเวอร์…"}
          </span>
        ) : (
          <>
            <span className="font-bold text-accent">{online}</span> คนกำลังออนไลน์
          </>
        )}
      </p>

      <section className="doodle-card w-full p-5 text-left">
        <h2 className="text-lg font-bold">ตัวตนของเธอในห้อง</h2>
        <p className="text-sm text-ink-soft">
          ยังไม่มีระบบล็อกอิน ตั้งนามแฝงเองหรือกดสุ่มก็ได้ อีกฝ่ายจะเห็นชื่อนี้
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
                  profile &&
                  saveProfile({ ...profile, nickname: event.target.value })
                }
                placeholder="ตั้งชื่อที่อยากให้เพื่อนเห็น"
                maxLength={MAX_NICKNAME_LENGTH}
                disabled={!profile}
                autoComplete="off"
                aria-invalid={profile ? !nickname : undefined}
                aria-describedby={profile && !nickname ? "nickname-hint" : undefined}
              />
              <button
                type="button"
                className="doodle-btn px-3"
                disabled={!profile}
                onClick={() =>
                  profile &&
                  saveProfile({ ...profile, nickname: randomNickname() })
                }
                aria-label="สุ่มนามแฝงใหม่"
                title="สุ่มนามแฝงใหม่"
              >
                🎲
              </button>
            </div>
            {profile && !nickname && (
              <p id="nickname-hint" className="mt-1 text-sm text-danger">
                ตั้งนามแฝงก่อนนะ หรือกด 🎲 ให้สุ่มให้
              </p>
            )}
          </div>
          <label>
            <span className="text-sm font-medium">คณะของเธอ</span>
            <select
              className="doodle-field mt-1 w-full"
              disabled={!profile}
              value={profile?.faculty ?? ""}
              onChange={(event) =>
                profile &&
                saveProfile({
                  ...profile,
                  faculty: event.target.value as FacultyId,
                })
              }
            >
              {!profile && <option value="">…</option>}
              {FACULTIES.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.emoji} {faculty.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <fieldset className="doodle-card w-full p-5 text-left">
        <legend className="sr-only">อยากคุยกับคณะไหน</legend>
        <h2 className="text-lg font-bold">อยากคุยกับคณะไหน?</h2>
        <p className="text-sm text-ink-soft">
          ถ้าไม่มีคนคณะนั้นรออยู่ เดี๋ยวพาไปห้องที่ว่างแทน
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <PreferChip
            label="🎲 ใครก็ได้"
            checked={prefers === null}
            onSelect={() => setPrefers(null)}
          />
          {FACULTIES.map((faculty) => (
            <PreferChip
              key={faculty.id}
              label={`${faculty.emoji} ${faculty.short}`}
              title={faculty.name}
              checked={prefers === faculty.id}
              onSelect={() => setPrefers(faculty.id)}
            />
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="font-medium text-danger">
          {error}
        </p>
      )}

      <button
        type="button"
        className="doodle-btn doodle-btn-primary px-10 py-3 text-2xl font-bold"
        disabled={!profile || !nickname || !connected}
        onClick={() => profile && onFind({ ...profile, nickname }, prefers)}
      >
        หาเพื่อนคุย
      </button>
      {!connected && (
        <p className="-mt-3 text-sm text-ink-soft">
          ยังต่อเซิร์ฟเวอร์ไม่ได้ กำลังลองใหม่ให้อยู่…
        </p>
      )}
    </main>
  );
}

function PreferChip({
  label,
  title,
  checked,
  onSelect,
}: {
  label: string;
  title?: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="doodle-chip" title={title}>
      <input
        type="radio"
        name="prefer-faculty"
        className="sr-only"
        checked={checked}
        onChange={onSelect}
      />
      {label}
    </label>
  );
}
