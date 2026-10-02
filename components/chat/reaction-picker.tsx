"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { REACTIONS, type Reaction } from "@/constants/reactions";

export function ReactionPicker({
  selected,
  align,
  onPick,
}: {
  selected: string | null;
  align: "left" | "right";
  onPick: (reaction: Reaction | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest" });
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 520, damping: 26 }}
      style={{ transformOrigin: align === "right" ? "100% 0%" : "0% 0%" }}
      role="group"
      aria-label="ใส่รีแอคชัน"
      className={`absolute top-full z-10 mt-1 flex gap-0.5 rounded-full border-2 border-ink bg-card p-1 shadow-[2px_2px_0_var(--color-ink)] ${align === "right" ? "right-0" : "left-0"}`}
    >
      {REACTIONS.map((reaction) => {
        const active = selected === reaction;
        return (
          <button
            key={reaction}
            type="button"
            className={`grid size-9 cursor-pointer place-items-center rounded-full text-xl transition-transform hover:scale-125 focus-visible:outline-2 focus-visible:outline-accent ${active ? "bg-accent-soft" : ""}`}
            aria-pressed={active}
            aria-label={active ? `เอา ${reaction} ออก` : `ใส่ ${reaction}`}
            onClick={() => onPick(active ? null : reaction)}
          >
            {reaction}
          </button>
        );
      })}
    </motion.div>
  );
}
