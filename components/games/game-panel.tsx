"use client";

import { ChevronDown, ChevronUp, Circle, Grab, Hand, RotateCcw, Scissors, X } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useT } from "@/hooks/use-locale";
import type { GameControls, GameView, RpsChoice, Side } from "@/types/chat";
import { TaksaBoard, TarotBoard } from "./fortune-boards";

const RPS: { id: RpsChoice; icon: typeof Hand }[] = [
  { id: "rock", icon: Grab },
  { id: "paper", icon: Hand },
  { id: "scissors", icon: Scissors },
];

export function GamePanel({
  game,
  partnerName,
  controls,
}: {
  game: GameView;
  partnerName: string;
  controls: GameControls;
}) {
  const t = useT();
  const [folded, setFolded] = useState(false);
  const Chevron = folded ? ChevronDown : ChevronUp;
  return (
    <motion.section
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className="doodle-card flex shrink-0 flex-col gap-2 px-3 py-2 sm:p-3"
      aria-label={titleOf(t, game.type)}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-left"
          aria-expanded={!folded}
          onClick={() => setFolded((value) => !value)}
        >
          <span className="shrink-0 font-bold">
            {game.type === "xo" ? "XO" : titleOf(t, game.type)}
          </span>
          <span className="min-w-0 truncate text-sm text-ink-soft">
            {folded
              ? summaryOf(t, game, partnerName)
              : game.startedBy === "me"
                ? t.games.youStarted
                : t.games.partnerStarted(partnerName)}
          </span>
          <Chevron className="size-4 shrink-0" aria-hidden />
          <span className="sr-only">{folded ? t.games.expand : t.games.fold}</span>
        </button>
        <button
          type="button"
          className="doodle-btn grid size-8 shrink-0 place-items-center sm:h-8 sm:w-auto sm:px-3"
          aria-label={t.games.restart}
          title={t.games.restart}
          onClick={() => controls.start(game.type)}
        >
          <RotateCcw className="size-4 sm:hidden" aria-hidden />
          <span className="text-sm max-sm:hidden">{t.games.restart}</span>
        </button>
        <button
          type="button"
          className="doodle-btn grid size-8 shrink-0 place-items-center sm:h-8 sm:w-auto sm:px-3"
          aria-label={t.games.quit}
          title={t.games.quit}
          onClick={controls.end}
        >
          <X className="size-4 sm:hidden" aria-hidden />
          <span className="text-sm max-sm:hidden">{t.games.quit}</span>
        </button>
      </div>
      {!folded && (
        <div className="max-h-[38vh] overflow-y-auto">
      {game.type === "xo" ? (
        <XoBoard game={game} partnerName={partnerName} onPlay={controls.playXo} />
      ) : game.type === "rps" ? (
        <RpsBoard game={game} partnerName={partnerName} onPick={controls.playRps} />
      ) : game.type === "taksa" ? (
        <TaksaBoard game={game} partnerName={partnerName} onPick={controls.pickDay} />
      ) : (
        <TarotBoard game={game} partnerName={partnerName} onDraw={controls.drawCard} />
      )}
        </div>
      )}
    </motion.section>
  );
}

function summaryOf(
  t: ReturnType<typeof useT>,
  game: GameView,
  partnerName: string,
): string {
  if (game.type === "xo") {
    return game.result
      ? t.games.result[game.result]
      : game.myTurn
        ? t.games.yourTurn
        : t.games.waitMove(partnerName);
  }
  if (game.type === "rps") return `${game.score.me} - ${game.score.them}`;
  if (game.type === "taksa") {
    return game.result ? `${t.fortune.score} ${game.result.score}%` : t.fortune.pickDay;
  }
  return game.mine ? t.fortune.cards[game.mine.card].name : t.fortune.draw;
}

function titleOf(t: ReturnType<typeof useT>, type: GameView["type"]): string {
  if (type === "xo") return t.games.xoLabel;
  if (type === "rps") return t.games.rps;
  if (type === "taksa") return t.fortune.taksaTitle;
  return t.fortune.tarotTitle;
}

function Mark({ side }: { side: Side | null }) {
  const t = useT();
  if (side === "me") return <X className="size-6 stroke-[3] text-accent" aria-label={t.games.markMine} />;
  if (side === "them") return <Circle className="size-5 stroke-[3]" aria-label={t.games.markTheirs} />;
  return null;
}

function XoBoard({
  game,
  partnerName,
  onPlay,
}: {
  game: Extract<GameView, { type: "xo" }>;
  partnerName: string;
  onPlay: (cell: number) => void;
}) {
  const t = useT();
  const status = game.result
    ? t.games.result[game.result]
    : game.myTurn
      ? t.games.yourTurn
      : t.games.waitMove(partnerName);

  return (
    <div className="flex items-center gap-4">
      <div className="grid grid-cols-3 gap-1.5" role="grid" aria-label={t.games.board}>
        {game.board.map((side, cell) => (
          <button
            key={cell}
            type="button"
            className={`grid size-9 place-items-center rounded-lg sm:size-11 border-2 border-ink ${game.line?.includes(cell) ? "bg-accent-soft" : "bg-card"} ${!side && game.myTurn ? "cursor-pointer hover:bg-paper" : ""}`}
            disabled={side !== null || !game.myTurn}
            aria-label={side ? t.games.cell(cell + 1) : t.games.emptyCell(cell + 1)}
            onClick={() => onPlay(cell)}
          >
            <Mark side={side} />
          </button>
        ))}
      </div>
      <p className="font-bold" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

function RpsBoard({
  game,
  partnerName,
  onPick,
}: {
  game: Extract<GameView, { type: "rps" }>;
  partnerName: string;
  onPick: (choice: RpsChoice) => void;
}) {
  const t = useT();
  const labelOf = (choice: RpsChoice) => t.games.choices[choice];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm" aria-live="polite">
        {t.games.score(game.round, game.score.me, game.score.them, partnerName)}
        {game.last && (
          <span className="ml-2 font-bold">
            {t.games.lastRound(labelOf(game.last.mine), labelOf(game.last.theirs))} ·{" "}
            {t.games.result[game.last.result]}
          </span>
        )}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {RPS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`doodle-btn flex items-center gap-1.5 px-3 py-1.5 ${game.myPick === id ? "bg-accent-soft font-bold" : ""}`}
            disabled={game.myPick !== null}
            aria-pressed={game.myPick === id}
            onClick={() => onPick(id)}
          >
            <Icon className="size-4" aria-hidden />
            {labelOf(id)}
          </button>
        ))}
        <span className="text-sm text-ink-soft">
          {game.myPick
            ? game.theyPicked
              ? ""
              : t.games.waitPick(partnerName)
            : game.theyPicked
              ? t.games.partnerPicked(partnerName)
              : ""}
        </span>
      </div>
    </div>
  );
}
