"use client";

import {
  Ban,
  EllipsisVertical,
  Eye,
  EyeOff,
  Flag,
  Grid3x3,
  Scissors,
  Share2,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { useDismiss } from "@/hooks/use-dismiss";
import { useT } from "@/hooks/use-locale";
import type { GameType } from "@/types/chat";

export function ChatMenu({
  canShare,
  onShare,
  onStartGame,
  onReport,
  readReceipts,
  onToggleReadReceipts,
  onBlock,
}: {
  canShare: boolean;
  onShare: () => void;
  onStartGame: ((type: GameType) => void) | null;
  onReport: (() => void) | null;
  readReceipts: boolean;
  onToggleReadReceipts: () => void;
  onBlock: (() => void) | null;
}) {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const close = useCallback(() => {
    setOpen(false);
    setConfirming(false);
  }, []);
  useDismiss(rootRef, open, close);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className="doodle-btn grid size-9 place-items-center"
        aria-label={t.menu.more}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <EllipsisVertical className="size-4" aria-hidden />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 520, damping: 30 }}
          style={{ transformOrigin: "100% 0%" }}
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 flex w-60 flex-col gap-1 rounded-2xl border-2 border-ink bg-card p-2 shadow-[3px_3px_0_var(--color-ink)]"
        >
          {confirming && onBlock ? (
            <div className="flex flex-col gap-2 p-1">
              <p className="text-sm">
                {t.menu.blockConfirm}
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
                  onClick={() => {
                    close();
                    onBlock();
                  }}
                >
                  {t.menu.block}
                </button>
              </div>
            </div>
          ) : (
            <>
              <MenuItem
                icon={<Share2 className="size-4" aria-hidden />}
                label={t.menu.share}
                disabled={!canShare}
                onClick={() => {
                  close();
                  onShare();
                }}
              />
              {onStartGame && (
                <>
                  <MenuItem
                    icon={<Grid3x3 className="size-4" aria-hidden />}
                    label={t.menu.playXo}
                    onClick={() => {
                      close();
                      onStartGame("xo");
                    }}
                  />
                  <MenuItem
                    icon={<Scissors className="size-4" aria-hidden />}
                    label={t.menu.playRps}
                    onClick={() => {
                      close();
                      onStartGame("rps");
                    }}
                  />
                </>
              )}
              <MenuItem
                icon={
                  readReceipts ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )
                }
                label={readReceipts ? t.menu.receiptsOff : t.menu.receiptsOn}
                onClick={() => {
                  close();
                  onToggleReadReceipts();
                }}
              />
              {onReport && (
                <MenuItem
                  icon={<Flag className="size-4 text-danger" aria-hidden />}
                  label={t.menu.report}
                  onClick={() => {
                    close();
                    onReport();
                  }}
                />
              )}
              {onBlock && (
                <MenuItem
                  icon={<Ban className="size-4 text-danger" aria-hidden />}
                  label={t.menu.blockUser}
                  onClick={() => setConfirming(true)}
                />
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
