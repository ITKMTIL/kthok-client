"use client";

import { Lightbulb } from "lucide-react";
import { motion } from "motion/react";
import type { ChatMessage } from "@/types/chat";

export function PromptCard({ message }: { message: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className="mx-auto my-1 flex max-w-[90%] flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-ink bg-accent-soft px-4 py-2 text-center"
      role="note"
    >
      <span className="flex items-center gap-1 text-xs font-bold text-ink-soft">
        <Lightbulb className="size-3.5" aria-hidden />
        {message.mine ? "เธอสุ่มคำถาม" : "อีกฝ่ายสุ่มคำถาม"}
      </span>
      <span className="font-bold">{message.text}</span>
    </motion.div>
  );
}
