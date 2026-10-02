"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTypingSignal } from "@/hooks/use-typing-signal";

const MAX_MESSAGE_LENGTH = 1000;

export function MessageForm({
  disabled,
  onSend,
  onTyping,
  onFocus,
}: {
  disabled: boolean;
  onSend: (text: string) => Promise<string | null>;
  onTyping: (typing: boolean) => void;
  onFocus: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const typing = useTypingSignal(onTyping);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: hover)").matches) inputRef.current?.focus();
  }, []);

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
          ref={inputRef}
          className="doodle-field min-w-0 flex-1"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            typing.touch();
          }}
          onFocus={onFocus}
          placeholder={disabled ? "ห้องนี้ปิดแล้ว" : "พิมพ์อะไรสักหน่อย…"}
          aria-label="ข้อความ"
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={disabled}
          autoComplete="off"
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
