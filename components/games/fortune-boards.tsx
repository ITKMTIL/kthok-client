"use client";

import { Eye, EyeOff, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { BIRTH_DAYS, type BirthDay } from "@/constants/fortune";
import { useT } from "@/hooks/use-locale";
import type { GameView, TarotDraw } from "@/types/chat";

export function TaksaBoard({
  game,
  partnerName,
  onPick,
}: {
  game: Extract<GameView, { type: "taksa" }>;
  partnerName: string;
  onPick: (day: BirthDay, reveal: boolean) => void;
}) {
  const t = useT();
  const f = t.fortune;
  const [reveal, setReveal] = useState(false);

  if (game.result) {
    const { theyAreMy, iAmTheir, score, partnerDay } = game.result;
    return (
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col gap-2 text-sm"
      >
        <p className="flex items-center gap-2">
          <span className="text-3xl font-bold text-accent">{score}%</span>
          <span className="font-bold">{f.score}</span>
        </p>
        <p className="text-ink-soft">
          {partnerDay
            ? f.partnerBorn(partnerName, f.days[partnerDay])
            : f.partnerHidden(partnerName)}
        </p>
        <PositionLine
          title={f.theyAreMy(partnerName, f.positions[theyAreMy].name)}
          line={f.positions[theyAreMy].line}
        />
        <PositionLine
          title={f.iAmTheir(partnerName, f.positions[iAmTheir].name)}
          line={f.positions[iAmTheir].line}
        />
        <Footnote source={f.taksaSource} disclaimer={f.disclaimer} />
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-2 text-sm">
      <p className="font-bold">{f.pickDay}</p>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8" role="group" aria-label={f.pickDay}>
        {BIRTH_DAYS.map(({ id, color }) => (
          <button
            key={id}
            type="button"
            className={`flex flex-col items-center gap-1 rounded-xl border-2 border-ink px-1 py-1.5 text-xs ${game.myPick?.day === id ? "bg-accent-soft font-bold" : "bg-card"} ${game.myPick ? "" : "cursor-pointer hover:bg-paper"}`}
            disabled={game.myPick !== null}
            aria-pressed={game.myPick?.day === id}
            onClick={() => onPick(id, reveal)}
          >
            <span
              className="size-4 rounded-full border-2 border-ink"
              style={{ background: color }}
              aria-hidden
            />
            {f.days[id]}
          </button>
        ))}
      </div>
      {game.myPick ? (
        <p className="text-ink-soft" aria-live="polite">
          {f.picked} · {game.theyPicked ? f.partnerPicked(partnerName) : f.waitPick(partnerName)}
        </p>
      ) : (
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="accent-[var(--color-accent)]"
            checked={reveal}
            onChange={(event) => setReveal(event.target.checked)}
          />
          {reveal ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}
          <span>
            {f.reveal}
            <span className="block text-xs text-ink-soft">{f.revealHint}</span>
          </span>
        </label>
      )}
      {!game.myPick && game.theyPicked && (
        <p className="text-ink-soft">{f.partnerPicked(partnerName)}</p>
      )}
    </div>
  );
}

export function TarotBoard({
  game,
  partnerName,
  onDraw,
}: {
  game: Extract<GameView, { type: "tarot" }>;
  partnerName: string;
  onDraw: () => void;
}) {
  const t = useT();
  const f = t.fortune;
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        <TarotSlot title={f.yourCard} draw={game.mine} />
        <TarotSlot title={f.theirCard(partnerName)} draw={game.theirs} />
      </div>
      {!game.mine && (
        <button
          type="button"
          className="doodle-btn doodle-btn-primary flex w-fit items-center gap-1.5 px-4 py-1.5 font-bold"
          onClick={onDraw}
        >
          <Sparkles className="size-4" aria-hidden />
          {f.draw}
        </button>
      )}
      <Footnote source={f.tarotSource} disclaimer={f.disclaimer} />
    </div>
  );
}

function TarotSlot({ title, draw }: { title: string; draw: TarotDraw | null }) {
  const f = useT().fortune;
  const card = draw ? f.cards[draw.card] : null;
  return (
    <div className="flex gap-3 rounded-xl border-2 border-ink p-2">
      <motion.span
        key={draw ? `${draw.card}-${draw.reversed}` : "back"}
        initial={draw ? { rotateY: 90 } : false}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.35 }}
        className={`grid h-16 w-11 shrink-0 place-items-center rounded-lg border-2 border-ink text-xs font-bold ${draw ? "bg-accent-soft" : "bg-ink/10"}`}
        aria-hidden
      >
        {draw ? (
          <span className="flex flex-col items-center leading-none">
            {romanOf(draw.card)}
            {draw.reversed && <span className="mt-1 text-[10px]">↓</span>}
          </span>
        ) : (
          "?"
        )}
      </motion.span>
      <span className="min-w-0">
        <span className="block text-xs text-ink-soft">{title}</span>
        {card && draw ? (
          <>
            <span className="block font-bold">
              {card.name}{" "}
              <span className="font-normal text-ink-soft">
                ({draw.reversed ? f.reversed : f.upright})
              </span>
            </span>
            <span className="block">{draw.reversed ? card.down : card.up}</span>
          </>
        ) : (
          <span className="block text-ink-soft">{f.notDrawn}</span>
        )}
      </span>
    </div>
  );
}

function PositionLine({ title, line }: { title: string; line: string }) {
  return (
    <p className="rounded-xl border-2 border-dashed border-ink px-3 py-1.5">
      <span className="block font-bold">{title}</span>
      {line}
    </p>
  );
}

function Footnote({ source, disclaimer }: { source: string; disclaimer: string }) {
  return (
    <p className="text-xs text-ink-soft">
      {disclaimer}
      <span className="block">{source}</span>
    </p>
  );
}

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];

function romanOf(card: number): string {
  return ROMAN[card] ?? String(card);
}
