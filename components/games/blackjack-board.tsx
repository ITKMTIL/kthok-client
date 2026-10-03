"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useT } from "@/hooks/use-locale";
import type { GameView } from "@/types/chat";

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS = ["♠", "♥", "♦", "♣"];

export function BlackjackBoard({
  game,
  partnerName,
  onAction,
}: {
  game: Extract<GameView, { type: "blackjack" }>;
  partnerName: string;
  onAction: (action: "hit" | "stand") => void;
}) {
  const t = useT();
  const b = t.blackjack;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (game.finished) return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [game.finished]);

  const seconds = Math.max(0, Math.ceil((game.deadline - now) / 1000));
  const status = game.finished
    ? null
    : !game.mine.done
      ? b.timer(seconds)
      : !game.theirs.done
        ? b.waiting(partnerName)
        : b.dealerTurn;

  return (
    <div className="flex flex-col gap-2 text-sm">
      <p className="flex flex-wrap items-center justify-between gap-x-3 text-xs text-ink-soft">
        <span>
          {game.mode === "dealer" ? b.dealerMode : b.duelMode} · {b.round(game.round)}
        </span>
        <span className="font-bold text-ink">
          {b.wins(game.wins.me, game.wins.them, partnerName)}
        </span>
      </p>

      {game.dealer && (
        <HandRow label={b.dealer} cards={game.dealer.cards} total={game.dealer.total} />
      )}
      <HandRow
        label={b.you}
        cards={game.mine.cards}
        total={game.mine.total}
        outcome={game.outcome ? b.outcome[game.outcome] : null}
        highlight
      />
      <HandRow
        label={partnerName}
        cards={game.theirs.cards}
        total={game.theirs.total}
        outcome={game.theirOutcome ? b.outcome[game.theirOutcome] : null}
      />

      {!game.finished && !game.mine.done && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="doodle-btn doodle-btn-primary px-5 py-1.5 font-bold"
            onClick={() => onAction("hit")}
          >
            {b.hit}
          </button>
          <button
            type="button"
            className="doodle-btn px-5 py-1.5 font-bold"
            onClick={() => onAction("stand")}
          >
            {b.stand}
          </button>
        </div>
      )}
      {status && (
        <p className="text-xs text-ink-soft" aria-live="polite">
          {status}
        </p>
      )}
      <p className="text-[11px] text-ink-soft">{b.fun}</p>
    </div>
  );
}

function HandRow({
  label,
  cards,
  total,
  outcome = null,
  highlight = false,
}: {
  label: string;
  cards: (number | null)[];
  total: number | null;
  outcome?: string | null;
  highlight?: boolean;
}) {
  const t = useT();
  const bust = total !== null && total > 21;
  return (
    <div className="flex items-center gap-2">
      <span className={`w-16 shrink-0 truncate text-xs ${highlight ? "font-bold" : "text-ink-soft"}`}>
        {label}
      </span>
      <span className="flex min-w-0 flex-1 gap-1 overflow-x-auto py-0.5">
        <AnimatePresence initial={false}>
          {cards.map((card, index) => (
            <PlayingCard key={`${index}-${card ?? "x"}`} card={card} />
          ))}
        </AnimatePresence>
      </span>
      <span className="w-14 shrink-0 text-right text-xs">
        {total !== null && (
          <span className={`block font-bold ${bust ? "text-danger" : ""}`}>
            {bust ? t.blackjack.bust : total}
          </span>
        )}
        {outcome && <span className="block font-bold text-accent">{outcome}</span>}
      </span>
    </div>
  );
}

function PlayingCard({ card }: { card: number | null }) {
  const t = useT();
  if (card === null) {
    return (
      <motion.span
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid h-12 w-8 shrink-0 place-items-center rounded-md border-2 border-ink bg-accent text-card sm:h-14 sm:w-10"
        role="img"
        aria-label={t.blackjack.hidden}
      >
        ?
      </motion.span>
    );
  }
  const rank = RANKS[card % 13];
  const suit = SUITS[Math.floor(card / 13)];
  const red = suit === "♥" || suit === "♦";
  return (
    <motion.span
      initial={{ y: -12, rotateY: 90, opacity: 0 }}
      animate={{ y: 0, rotateY: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={`flex h-12 w-8 shrink-0 flex-col items-center justify-center rounded-md border-2 border-ink bg-card text-xs font-bold leading-none sm:h-14 sm:w-10 sm:text-sm ${red ? "text-danger" : "text-ink"}`}
      role="img"
      aria-label={`${rank}${suit}`}
    >
      <span>{rank}</span>
      <span>{suit}</span>
    </motion.span>
  );
}

