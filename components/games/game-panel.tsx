"use client";

import { Circle, Grab, Hand, Scissors, X } from "lucide-react";
import { motion } from "motion/react";
import type {
  GameControls,
  GameResult,
  GameView,
  RpsChoice,
  Side,
} from "@/types/chat";

const RESULT_TEXT: Record<GameResult, string> = {
  win: "เธอชนะ!",
  lose: "อีกฝ่ายชนะ",
  draw: "เสมอ",
};

const RPS: { id: RpsChoice; label: string; icon: typeof Hand }[] = [
  { id: "rock", label: "ค้อน", icon: Grab },
  { id: "paper", label: "กระดาษ", icon: Hand },
  { id: "scissors", label: "กรรไกร", icon: Scissors },
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
  return (
    <motion.section
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className="doodle-card flex flex-col gap-2 p-3"
      aria-label={game.type === "xo" ? "เกม XO" : "เกมเป่ายิ้งฉุบ"}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold">
          {game.type === "xo" ? "XO" : "เป่ายิ้งฉุบ"}
          <span className="ml-2 text-sm font-normal text-ink-soft">
            {game.startedBy === "me" ? "เธอชวนเล่น" : `${partnerName} ชวนเล่น`}
          </span>
        </h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            className="doodle-btn px-3 py-1 text-sm"
            onClick={() => controls.start(game.type)}
          >
            เริ่มใหม่
          </button>
          <button
            type="button"
            className="doodle-btn px-3 py-1 text-sm"
            onClick={controls.end}
          >
            เลิกเล่น
          </button>
        </div>
      </div>
      {game.type === "xo" ? (
        <XoBoard game={game} partnerName={partnerName} onPlay={controls.playXo} />
      ) : (
        <RpsBoard game={game} partnerName={partnerName} onPick={controls.playRps} />
      )}
    </motion.section>
  );
}

function Mark({ side }: { side: Side | null }) {
  if (side === "me") return <X className="size-6 stroke-[3] text-accent" aria-label="X ของเธอ" />;
  if (side === "them") return <Circle className="size-5 stroke-[3]" aria-label="O ของอีกฝ่าย" />;
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
  const status = game.result
    ? RESULT_TEXT[game.result]
    : game.myTurn
      ? "ตาเธอแล้ว"
      : `รอ ${partnerName} เดิน`;

  return (
    <div className="flex items-center gap-4">
      <div className="grid grid-cols-3 gap-1.5" role="grid" aria-label="กระดาน XO">
        {game.board.map((side, cell) => (
          <button
            key={cell}
            type="button"
            className={`grid size-11 place-items-center rounded-lg border-2 border-ink ${game.line?.includes(cell) ? "bg-accent-soft" : "bg-card"} ${!side && game.myTurn ? "cursor-pointer hover:bg-paper" : ""}`}
            disabled={side !== null || !game.myTurn}
            aria-label={`ช่อง ${cell + 1}${side ? "" : " ว่าง"}`}
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
  const labelOf = (choice: RpsChoice) =>
    RPS.find((item) => item.id === choice)?.label ?? choice;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm" aria-live="polite">
        รอบที่ {game.round} · เธอ {game.score.me} - {game.score.them} {partnerName}
        {game.last && (
          <span className="ml-2 font-bold">
            รอบก่อน: {labelOf(game.last.mine)} vs {labelOf(game.last.theirs)} ·{" "}
            {RESULT_TEXT[game.last.result]}
          </span>
        )}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {RPS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`doodle-btn flex items-center gap-1.5 px-3 py-1.5 ${game.myPick === id ? "bg-accent-soft font-bold" : ""}`}
            disabled={game.myPick !== null}
            aria-pressed={game.myPick === id}
            onClick={() => onPick(id)}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
        <span className="text-sm text-ink-soft">
          {game.myPick
            ? game.theyPicked
              ? ""
              : `รอ ${partnerName} เลือก…`
            : game.theyPicked
              ? `${partnerName} เลือกแล้ว`
              : ""}
        </span>
      </div>
    </div>
  );
}
