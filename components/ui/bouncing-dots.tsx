"use client";

import { motion } from "motion/react";

export function BouncingDots({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-end gap-1 ${className}`} aria-hidden>
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="inline-block size-1.5 rounded-full bg-current"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: index * 0.14,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}
