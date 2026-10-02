"use client";

import { motion } from "motion/react";
import type { ReactNode, Ref } from "react";

export function Screen({
  ref,
  children,
  className,
}: {
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, width: "100%" }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
