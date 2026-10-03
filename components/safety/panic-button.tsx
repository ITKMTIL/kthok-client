"use client";

import { ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { useDismiss } from "@/hooks/use-dismiss";
import { useT } from "@/hooks/use-locale";

export function PanicButton({ onConfirm }: { onConfirm: () => void }) {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className="doodle-btn grid size-9 place-items-center bg-danger text-card"
        aria-label={t.safety.panicLabel}
        aria-expanded={open}
        title={t.safety.panic}
        onClick={() => setOpen((value) => !value)}
      >
        <ShieldAlert className="size-4" aria-hidden />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 520, damping: 30 }}
          style={{ transformOrigin: "100% 0%" }}
          role="alertdialog"
          aria-label={t.safety.panicConfirmLabel}
          className="absolute right-0 top-full z-20 mt-2 flex w-64 flex-col gap-2 rounded-2xl border-2 border-ink bg-card p-3 shadow-[3px_3px_0_var(--color-ink)]"
        >
          <p className="text-sm">
            {t.safety.panicConfirm}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="doodle-btn flex-1 px-2 py-1 text-sm"
              onClick={close}
            >
              {t.common.cancel}
            </button>
            <button
              type="button"
              className="doodle-btn flex-1 bg-danger px-2 py-1 text-sm font-bold text-card"
              autoFocus
              onClick={() => {
                close();
                onConfirm();
              }}
            >
              {t.safety.panicAction}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
