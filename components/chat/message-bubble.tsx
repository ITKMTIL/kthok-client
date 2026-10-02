"use client";

import { Check, SmilePlus } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef } from "react";
import type { Reaction } from "@/constants/reactions";
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
}: {
  message: ChatMessage;
  pickerOpen: boolean;
  disabled: boolean;
  selection: { selected: boolean; onToggle: () => void } | null;
  onTogglePicker: (open: boolean) => void;
  onReact: (reaction: Reaction | null) => void;
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
      className={`group relative flex max-w-[80%] flex-col ${message.mine ? "items-end self-end" : "items-start self-start"} ${pickerOpen ? "mb-12" : ""}`}
    >
      <div className={`flex items-center gap-1 ${message.mine ? "flex-row-reverse" : ""}`}>
        <p
          className={`bubble max-w-full ${message.mine ? "bubble-mine" : "bubble-theirs"} ${selection ? "cursor-pointer" : ""} ${selection?.selected ? "outline-3 outline-offset-2 outline-accent" : ""}`}
          onClick={handleBubbleClick}
        >
          {message.text}
        </p>
        {selection && (
          <button
            type="button"
            role="checkbox"
            aria-checked={selection.selected}
            aria-label={`เลือกข้อความ: ${message.text.slice(0, 40)}`}
            className={`grid size-6 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-ink focus-visible:outline-2 focus-visible:outline-accent ${selection.selected ? "bg-accent text-card" : "bg-card"}`}
            onClick={selection.onToggle}
          >
            {selection.selected && <Check className="size-4" aria-hidden />}
          </button>
        )}
        {!disabled && !selection && (
          <button
            type="button"
            className={`grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-ink-soft transition-opacity hover:bg-accent-soft hover:text-ink focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-accent [@media(hover:none)]:hidden ${pickerOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            aria-label="ใส่รีแอคชัน"
            aria-expanded={pickerOpen}
            onClick={() => onTogglePicker(!pickerOpen)}
          >
            <SmilePlus className="size-4" aria-hidden />
          </button>
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

      {pickerOpen && (
        <ReactionPicker
          selected={mine}
          align={message.mine ? "right" : "left"}
          onPick={(reaction) => {
            onReact(reaction);
            close();
          }}
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
