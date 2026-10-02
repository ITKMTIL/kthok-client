"use client";

import { motion } from "motion/react";

export function OnlineCount({
  online,
  connected,
}: {
  online: number | null;
  connected: boolean;
}) {
  return (
    <p className="text-xl" aria-live="polite">
      {online === null ? (
        <span className="text-ink-soft">
          {connected ? "กำลังนับคน…" : "กำลังเชื่อมต่อเซิร์ฟเวอร์…"}
        </span>
      ) : (
        <>
          <motion.span
            key={online}
            initial={{ scale: 1.5, y: -3 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="inline-block font-bold text-accent"
          >
            {online}
          </motion.span> คนกำลังออนไลน์
        </>
      )}
    </p>
  );
}
