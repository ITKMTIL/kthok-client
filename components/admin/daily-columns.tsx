"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { formatDay, formatNumber, total, type DayPoint } from "@/lib/admin-stats";

export function DailyColumns({
  title,
  unit,
  points,
}: {
  title: string;
  unit: string;
  points: DayPoint[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...points.map((point) => point.value));
  const focused = active === null ? null : points[active];
  const labelEvery = Math.max(1, Math.ceil(points.length / 5));

  return (
    <figure className="doodle-card flex flex-col gap-3 p-4">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="font-bold">{title}</span>
        <span className="text-sm text-ink-soft tabular-nums">
          {focused
            ? `${formatDay(focused.day)} · ${formatNumber(focused.value)} ${unit}`
            : `รวม ${formatNumber(total(points))} ${unit}`}
        </span>
      </figcaption>

      <div className="flex items-end gap-2">
        <span className="w-8 shrink-0 self-start text-right text-xs text-ink-soft tabular-nums">
          {formatNumber(max)}
        </span>
        <div
          className="flex h-32 flex-1 items-end gap-[2px] border-b-2 border-ink/25"
          onPointerLeave={() => setActive(null)}
        >
          {points.map((point, index) => (
            <div
              key={point.day}
              role="img"
              tabIndex={0}
              aria-label={`${formatDay(point.day)}: ${formatNumber(point.value)} ${unit}`}
              className="group flex h-full flex-1 cursor-default items-end justify-center outline-none"
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
            >
              <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.02,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`w-full max-w-6 origin-bottom rounded-t bg-accent transition-opacity group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ink ${active !== null && active !== index ? "opacity-40" : ""}`}
                style={{
                  height:
                    point.value === 0
                      ? "0"
                      : `max(3px, ${(point.value / max) * 100}%)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="ml-10 flex gap-[2px] text-[11px] text-ink-soft">
        {points.map((point, index) => (
          <span key={point.day} className="flex-1 overflow-visible text-center whitespace-nowrap">
            {index === points.length - 1 ||
            (index % labelEvery === 0 &&
              points.length - 1 - index >= labelEvery / 2)
              ? formatDay(point.day)
              : ""}
          </span>
        ))}
      </div>
    </figure>
  );
}
