"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import { STICKERS, type StickerId } from "@/constants/stickers";
import { useDismiss } from "@/hooks/use-dismiss";
import { Sticker } from "./sticker";

export function StickerPicker({
  onPick,
  onClose,
}: {
  onPick: (id: StickerId) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, true, onClose);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 480, damping: 30 }}
      role="group"
      aria-label="เลือกสติกเกอร์"
      className="absolute bottom-full left-0 z-20 mb-2 grid w-[min(22rem,calc(100vw-1.5rem))] grid-cols-5 gap-1 rounded-2xl border-2 border-ink bg-card p-2 shadow-[3px_3px_0_var(--color-ink)]"
    >
      {STICKERS.map((sticker) => (
        <button
          key={sticker.id}
          type="button"
          className="grid aspect-square cursor-pointer place-items-center rounded-xl hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent"
          aria-label={`ส่งสติกเกอร์ ${sticker.label}`}
          onClick={() => onPick(sticker.id)}
        >
          <Sticker id={sticker.id} className="size-14" />
        </button>
      ))}
    </motion.div>
  );
}
