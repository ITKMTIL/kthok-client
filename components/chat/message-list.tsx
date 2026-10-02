"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/chat";

export function MessageList({
  messages,
  partnerName,
  partnerTyping,
  ended,
  onNext,
}: {
  messages: ChatMessage[];
  partnerName: string;
  partnerTyping: boolean;
  ended: boolean;
  onNext: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, partnerTyping, ended]);

  return (
    <div
      className="doodle-card flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4"
      role="log"
      aria-label="ข้อความในห้อง"
    >
      <p className="text-center text-sm text-ink-soft">
        จับคู่แล้ว! ทักทายกันได้เลย ข้อความจะหายไปเมื่อออกจากห้อง
      </p>
      {messages.map((message) => (
        <p
          key={message.id}
          className={`bubble ${message.mine ? "bubble-mine" : "bubble-theirs"}`}
        >
          {message.text}
        </p>
      ))}
      {partnerTyping && (
        <p className="bubble bubble-theirs animate-pulse text-ink-soft">
          กำลังพิมพ์…
        </p>
      )}
      {ended && (
        <div className="mt-2 flex flex-col items-center gap-2 text-center">
          <p className="font-medium">{partnerName} ออกจากห้องไปแล้ว</p>
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
  );
}
