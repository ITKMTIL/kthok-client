"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { facultyOf } from "@/lib/faculties";
import type { ChatState, MusicControls } from "@/lib/use-chat";
import { MusicPlayer } from "./music-player";

const TYPING_IDLE_MS = 1500;
const MAX_MESSAGE_LENGTH = 1000;

export function ChatRoom({
  state,
  onSend,
  onTyping,
  music,
  onNext,
  onLeave,
}: {
  state: ChatState;
  onSend: (text: string) => void;
  onTyping: (typing: boolean) => void;
  music: MusicControls;
  onNext: () => void;
  onLeave: () => void;
}) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ended = state.phase === "ended";
  const partner = state.partner;
  const faculty = partner ? facultyOf(partner.faculty) : undefined;
  const preferred = state.prefers ? facultyOf(state.prefers) : undefined;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [state.messages.length, state.partnerTyping, ended]);

  useEffect(
    () => () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    },
    [],
  );

  function stopTyping() {
    if (!typingTimer.current) return;
    clearTimeout(typingTimer.current);
    typingTimer.current = null;
    onTyping(false);
  }

  function handleDraft(value: string) {
    setDraft(value);
    if (!typingTimer.current) onTyping(true);
    else clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(stopTyping, TYPING_IDLE_MS);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || ended) return;
    stopTyping();
    onSend(text);
    setDraft("");
  }

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-3 px-3 pb-3 lg:flex-row">
      <MusicPlayer music={state.music} controls={music} disabled={ended} />
      <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
        <header className="doodle-card flex items-center gap-3 px-4 py-3">
          <span className="text-3xl" aria-hidden>
            {faculty?.emoji ?? "🙂"}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold">{partner?.nickname}</h1>
            <p className="truncate text-sm text-ink-soft">
              คณะ{faculty?.name}
              {preferred &&
                (state.preferenceMet
                  ? " · ตรงคณะที่ขอ ✓"
                  : ` · ไม่มีเด็ก${preferred.short}ว่าง เลยได้ห้องนี้แทน`)}
            </p>
          </div>
          <button type="button" className="doodle-btn px-3 py-1" onClick={onNext}>
            คนถัดไป
          </button>
          <button type="button" className="doodle-btn px-3 py-1" onClick={onLeave}>
            ออก
          </button>
        </header>

        <div
          className="doodle-card flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4"
          role="log"
          aria-label="ข้อความในห้อง"
        >
          <p className="text-center text-sm text-ink-soft">
            จับคู่แล้ว! ทักทายกันได้เลย ข้อความจะหายไปเมื่อออกจากห้อง
          </p>
          {state.messages.map((message) => (
            <p
              key={message.id}
              className={`bubble ${message.mine ? "bubble-mine" : "bubble-theirs"}`}
            >
              {message.text}
            </p>
          ))}
          {state.partnerTyping && (
            <p className="bubble bubble-theirs animate-pulse text-ink-soft">
              กำลังพิมพ์…
            </p>
          )}
          {ended && (
            <div className="mt-2 flex flex-col items-center gap-2 text-center">
              <p className="font-medium">{partner?.nickname} ออกจากห้องไปแล้ว</p>
              <button
                type="button"
                className="doodle-btn doodle-btn-primary px-5 py-1.5 font-bold"
                onClick={onNext}
              >
                หาเพื่อนคนใหม่
              </button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form className="flex gap-2" onSubmit={handleSubmit}>
          <input
            className="doodle-field min-w-0 flex-1"
            value={draft}
            onChange={(event) => handleDraft(event.target.value)}
            placeholder={ended ? "ห้องนี้ปิดแล้ว" : "พิมพ์อะไรสักหน่อย…"}
            aria-label="ข้อความ"
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={ended}
            autoComplete="off"
            autoFocus
          />
          <button
            type="submit"
            className="doodle-btn doodle-btn-primary px-5 font-bold"
            disabled={ended || !draft.trim()}
          >
            ส่ง
          </button>
        </form>
      </section>
    </main>
  );
}
