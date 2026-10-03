"use client";

import { Check, CheckCheck, Reply, SmilePlus, Undo2 } from "lucide-react";
import { Sticker } from "@/components/stickers/sticker";
import { stickerLabel } from "@/constants/stickers";
import { motion } from "motion/react";
import { useCallback, useRef } from "react";
import type { Reaction } from "@/constants/reactions";
import { VoiceBubble } from "@/components/voice/voice-bubble";
import { useDismiss } from "@/hooks/use-dismiss";
import type { ChatMessage } from "@/types/chat";
import { ReactionPicker } from "./reaction-picker";

export function MessageBubble({
  message,
  pickerOpen,
  disabled,
  selection,
  onTogglePicker,
  onReact,
  quoted,
  read,
  onReply,
  onUnsend,
}: {
  message: ChatMessage;
  pickerOpen: boolean;
  disabled: boolean;
  selection: { selected: boolean; onToggle: () => void } | null;
  onTogglePicker: (open: boolean) => void;
  onReact: (reaction: Reaction | null) => void;
  quoted: ChatMessage | null;
  read: boolean;
  onReply: (() => void) | null;
  onUnsend: (() => void) | null;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onTogglePicker(false), [onTogglePicker]);
  useDismiss(rootRef, pickerOpen, close);

  const { mine, theirs } = message.reactions;
  const same = mine !== null && mine === theirs;

  const handleBubbleClick = () => {
    if (selection) return selection.onToggle();
    if (disabled || !window.matchMedia("(hover: none)").matches) return;
    onTogglePicker(!pickerOpen);
  };

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 32 }}
      style={{ transformOrigin: message.mine ? "100% 100%" : "0% 100%" }}
      id={`msg-${message.id}`}
      className={`group relative flex max-w-[80%] scroll-mt-4 flex-col ${message.mine ? "items-end self-end" : "items-start self-start"} ${pickerOpen ? "mb-12" : ""}`}
    >
      <div className={`flex items-center gap-1 ${message.mine ? "flex-row-reverse" : ""}`}>
        <div
          className={`max-w-full ${message.sticker ? "rounded-2xl" : `bubble ${message.mine ? "bubble-mine" : "bubble-theirs"}`} ${message.voice ? "py-1.5" : ""} ${message.unsent ? "italic text-ink-soft" : ""} ${selection ? "cursor-pointer" : ""} ${selection?.selected ? "outline-3 outline-offset-2 outline-accent" : ""}`}
          onClick={handleBubbleClick}
        >
          {quoted && !message.unsent && <Quote message={quoted} />}
          {message.unsent ? (
            message.mine ? "เธอยกเลิกข้อความนี้" : "ข้อความนี้ถูกยกเลิก"
          ) : message.sticker ? (
            <span role="img" aria-label={`สติกเกอร์ ${stickerLabel(message.sticker)}`}>
              <Sticker id={message.sticker} />
            </span>
          ) : message.voice ? (
            <VoiceBubble id={message.id} voice={message.voice} mine={message.mine} />
          ) : (
            message.text
          )}
        </div>
        {selection && (
          <button
            type="button"
            role="checkbox"
            aria-checked={selection.selected}
            aria-label={`เลือกข้อความ: ${summarize(message)}`}
            className={`grid size-6 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-ink focus-visible:outline-2 focus-visible:outline-accent ${selection.selected ? "bg-accent text-card" : "bg-card"}`}
            onClick={selection.onToggle}
          >
            {selection.selected && <Check className="size-4" aria-hidden />}
          </button>
        )}
        {!disabled && !selection && !message.unsent && (
          <span className="flex [@media(hover:none)]:hidden">
          {onReply && (
            <ActionButton label="ตอบกลับ" visible={pickerOpen} onClick={onReply}>
              <Reply className="size-4" aria-hidden />
            </ActionButton>
          )}
          {onUnsend && (
            <ActionButton label="ยกเลิกส่ง" visible={pickerOpen} onClick={onUnsend}>
              <Undo2 className="size-4" aria-hidden />
            </ActionButton>
          )}
          <button
            type="button"
            className={`grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-ink-soft transition-opacity hover:bg-accent-soft hover:text-ink focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-accent [@media(hover:none)]:hidden ${pickerOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            aria-label="ใส่รีแอคชัน"
            aria-expanded={pickerOpen}
            onClick={() => onTogglePicker(!pickerOpen)}
          >
            <SmilePlus className="size-4" aria-hidden />
          </button>
          </span>
        )}
      </div>

      {(mine || theirs) && (
        <div className="-mt-1.5 flex gap-1 px-2">
          {same ? (
            <ReactionChip reaction={mine} count={2} mine disabled={disabled} onRemove={() => onReact(null)} />
          ) : (
            <>
              {theirs && <ReactionChip reaction={theirs} count={1} mine={false} disabled />}
              {mine && <ReactionChip reaction={mine} count={1} mine disabled={disabled} onRemove={() => onReact(null)} />}
            </>
          )}
        </div>
      )}

      {read && (
        <span className="flex items-center gap-0.5 px-1 text-xs text-ink-soft">
          <CheckCheck className="size-3.5" aria-hidden />
          อ่านแล้ว
        </span>
      )}

      {pickerOpen && (
        <ReactionPicker
          selected={mine}
          align={message.mine ? "right" : "left"}
          onPick={(reaction) => {
            onReact(reaction);
            close();
          }}
          onReply={
            onReply &&
            (() => {
              close();
              onReply();
            })
          }
          onUnsend={
            onUnsend &&
            (() => {
              close();
              onUnsend();
            })
          }
        />
      )}
    </motion.div>
  );
}

function ReactionChip({
  reaction,
  count,
  mine,
  disabled,
  onRemove,
}: {
  reaction: string;
  count: number;
  mine: boolean;
  disabled: boolean;
  onRemove?: () => void;
}) {
  const className = `flex items-center gap-0.5 rounded-full border-2 border-ink px-1.5 text-sm leading-6 ${mine ? "bg-accent-soft" : "bg-card"}`;
  const pop = {
    initial: { scale: 0, rotate: -20 },
    animate: { scale: 1, rotate: 0 },
    transition: { type: "spring", stiffness: 600, damping: 18 },
  } as const;
  const content = (
    <>
      <span aria-hidden>{reaction}</span>
      {count > 1 && <span className="text-xs font-bold">{count}</span>}
    </>
  );

  if (!mine || disabled || !onRemove) {
    return (
      <motion.span
        key={reaction}
        {...pop}
        className={className}
        aria-label={`รีแอคชัน ${reaction}`}
      >
        {content}
      </motion.span>
    );
  }
  return (
    <motion.button
      key={reaction}
      {...pop}
      type="button"
      className={`${className} cursor-pointer`}
      aria-label={`เอารีแอคชัน ${reaction} ของเธอออก`}
      onClick={onRemove}
    >
      {content}
    </motion.button>
  );
}

export function summarize(message: ChatMessage): string {
  if (message.unsent) return "ข้อความที่ถูกยกเลิก";
  if (message.sticker) return `สติกเกอร์ ${stickerLabel(message.sticker)}`;
  if (message.voice) return "ข้อความเสียง";
  return message.text.slice(0, 60);
}

function Quote({ message }: { message: ChatMessage }) {
  return (
    <a
      href={`#msg-${message.id}`}
      className="mb-1 block rounded-lg border-l-4 border-ink bg-ink/5 px-2 py-0.5 text-xs not-italic text-ink-soft"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        document
          .getElementById(`msg-${message.id}`)
          ?.scrollIntoView({ block: "center", behavior: "smooth" });
      }}
    >
      <span className="font-bold">{message.mine ? "เธอ" : "อีกฝ่าย"}</span>{" "}
      <span className="line-clamp-1">{summarize(message)}</span>
    </a>
  );
}

function ActionButton({
  label,
  visible,
  onClick,
  children,
}: {
  label: string;
  visible: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-ink-soft transition-opacity hover:bg-accent-soft hover:text-ink focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-accent ${visible ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
