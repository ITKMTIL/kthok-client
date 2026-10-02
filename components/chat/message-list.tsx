"use client";

import { useEffect, useRef, useState } from "react";
import type { Reaction } from "@/constants/reactions";
import type { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./message-bubble";

export function MessageList({
  messages,
  partnerName,
  partnerTyping,
  ended,
  selected,
  onToggleSelected,
  onReact,
  onNext,
}: {
  messages: ChatMessage[];
  partnerName: string;
  partnerTyping: boolean;
  ended: boolean;
  selected: ReadonlySet<string> | null;
  onToggleSelected: (messageId: string) => void;
  onReact: (messageId: string, reaction: Reaction | null) => void;
  onNext: () => void;
}) {
  const logRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, partnerTyping, ended]);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const observer = new ResizeObserver(() =>
      bottomRef.current?.scrollIntoView({ block: "end" }),
    );
    observer.observe(log);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={logRef}
      className="doodle-card flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain p-3 sm:p-4"
      role="log"
      aria-label="ข้อความในห้อง"
    >
      <p className="text-center text-sm text-ink-soft">
        จับคู่แล้ว! ทักทายกันได้เลย เราไม่เก็บข้อความไว้ ออกจากห้องแล้วหายเลย
      </p>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          pickerOpen={!selected && openPickerId === message.id}
          disabled={ended}
          selection={
            selected && {
              selected: selected.has(message.id),
              onToggle: () => onToggleSelected(message.id),
            }
          }
          onTogglePicker={(open) => setOpenPickerId(open ? message.id : null)}
          onReact={(reaction) => onReact(message.id, reaction)}
        />
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
