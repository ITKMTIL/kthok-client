"use client";

import { useState, type FormEvent } from "react";
import { useTypingSignal } from "@/hooks/use-typing-signal";

const MAX_MESSAGE_LENGTH = 1000;

export function MessageForm({
  disabled,
  onSend,
  onTyping,
}: {
  disabled: boolean;
  onSend: (text: string) => Promise<string | null>;
  onTyping: (typing: boolean) => void;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const typing = useTypingSignal(onTyping);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || disabled) return;
    typing.stop();
    setDraft("");
    const failure = await onSend(text);
    setError(failure);
    if (failure) setDraft((current) => current || text);
  }

  return (
    <div>
      {error && (
        <p className="mb-1 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          className="doodle-field min-w-0 flex-1"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            typing.touch();
          }}
          placeholder={disabled ? "ห้องนี้ปิดแล้ว" : "พิมพ์อะไรสักหน่อย…"}
          aria-label="ข้อความ"
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={disabled}
          autoComplete="off"
          autoFocus
        />
        <button
          type="submit"
          className="doodle-btn doodle-btn-primary px-5 font-bold"
          disabled={disabled || !draft.trim()}
        >
          ส่ง
        </button>
      </form>
    </div>
  );
}
