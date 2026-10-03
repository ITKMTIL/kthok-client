import type { ReactNode } from "react";
import type { StickerId } from "@/constants/stickers";

const INK = "var(--color-ink)";
const CARD = "var(--color-card)";
const ACCENT = "var(--color-accent)";
const SOFT = "var(--color-accent-soft)";

function Face({
  eyes = "dots",
  mouth = "smile",
  tan = false,
  cheeks = true,
}: {
  eyes?: "dots" | "closed" | "happy" | "sad";
  mouth?: "smile" | "open" | "frown" | "flat" | "o";
  tan?: boolean;
  cheeks?: boolean;
}) {
  return (
    <g>
      <circle cx="50" cy="46" r="26" fill={tan ? "var(--color-tan)" : CARD} />
      {eyes === "dots" && (
        <>
          <path d="M41 41v5M59 41v5" strokeWidth="4" />
        </>
      )}
      {eyes === "closed" && <path d="M37 44q4-4 8 0M55 44q4-4 8 0" />}
      {eyes === "happy" && <path d="M37 45q4 4 8 0M55 45q4 4 8 0" />}
      {eyes === "sad" && <path d="M37 41l8 3M63 41l-8 3" />}
      {mouth === "smile" && <path d="M42 54q8 7 16 0" />}
      {mouth === "open" && (
        <path d="M40 52q10 14 20 0z" fill={ACCENT} />
      )}
      {mouth === "frown" && <path d="M43 58q7-6 14 0" />}
      {mouth === "flat" && <path d="M44 56h12" />}
      {mouth === "o" && <circle cx="50" cy="56" r="3.5" fill={INK} />}
      {cheeks && <path d="M31 51h5M64 51h5" stroke={ACCENT} strokeWidth="3" />}
    </g>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <text
      x="50"
      y="94"
      textAnchor="middle"
      fontSize="15"
      fontWeight="700"
      fill={INK}
      stroke={CARD}
      strokeWidth="4"
      paintOrder="stroke"
    >
      {children}
    </text>
  );
}

const ART: Record<StickerId, ReactNode> = {
  hello: (
    <>
      <Face />
      <path d="M78 34l6-10M82 40l9-6M84 48l9-1" stroke={ACCENT} />
      <path d="M72 50q8-14 4-24" />
      <Caption>หวัดดี</Caption>
    </>
  ),
  train: (
    <>
      <path d="M8 66h84" />
      <rect x="14" y="30" width="34" height="28" rx="6" fill={CARD} />
      <path d="M52 58V36q0-6 6-6h14q14 0 18 28z" fill={SOFT} />
      <path d="M20 37h8v8h-8zM34 37h8v8h-8zM58 37h10l4 8H58z" fill="var(--color-paper)" strokeWidth="2.5" />
      <path d="M16 51h30M54 51h34" stroke={ACCENT} />
      <circle cx="24" cy="62" r="4" fill={INK} />
      <circle cx="40" cy="62" r="4" fill={INK} />
      <circle cx="62" cy="62" r="4" fill={INK} />
      <circle cx="80" cy="62" r="4" fill={INK} />
      <Caption>ปู๊น ๆ</Caption>
    </>
  ),
  laugh: (
    <>
      <Face eyes="happy" mouth="open" />
      <path d="M26 38q-4 6 0 10M74 38q4 6 0 10" stroke="var(--color-online)" />
      <Caption>555555</Caption>
    </>
  ),
  cry: (
    <>
      <Face eyes="sad" mouth="frown" cheeks={false} />
      <path d="M39 49q-3 8 0 12M61 49q3 8 0 12" stroke="var(--color-ink-soft)" strokeWidth="4" />
      <Caption>ฮือออ</Caption>
    </>
  ),
  love: (
    <>
      <Face eyes="happy" />
      <path d="M78 18c-4-6-12-2-8 4l8 8 8-8c4-6-4-10-8-4z" fill={ACCENT} strokeWidth="2.5" />
      <path d="M20 22c-3-4-9-1-6 3l6 6 6-6c3-4-3-7-6-3z" fill={ACCENT} strokeWidth="2.5" />
      <Caption>ปลื้มมม</Caption>
    </>
  ),
  sleepy: (
    <>
      <Face eyes="closed" mouth="o" tan />
      <path d="M70 18h10l-10 10h10M82 8h7l-7 7h7" strokeWidth="2.5" />
      <Caption>ง่วงแล้ว</Caption>
    </>
  ),
  hungry: (
    <>
      <Face mouth="o" />
      <path d="M62 66h30q-2 12-15 12t-15-12z" fill={SOFT} />
      <path d="M70 60q2-6 0-10M78 60q2-6 0-10" strokeWidth="2.5" />
      <Caption>หิวว</Caption>
    </>
  ),
  study: (
    <>
      <Face eyes="sad" mouth="flat" tan />
      <path d="M22 64l28 6 28-6v14l-28 6-28-6z" fill={CARD} />
      <path d="M50 70v14" />
      <Caption>อ่านไม่ทัน</Caption>
    </>
  ),
  thanks: (
    <>
      <Face eyes="happy" />
      <path d="M16 20l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM84 16l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="var(--color-online)" strokeWidth="2" />
      <Caption>ขอบคุณน้า</Caption>
    </>
  ),
  bye: (
    <>
      <Face eyes="happy" tan />
      <path d="M24 50q-8-14-4-24M28 34l-6-10M24 40l-9-6" />
      <Caption>ไปละ บาย</Caption>
    </>
  ),
};

export function Sticker({
  id,
  className = "size-28",
}: {
  id: StickerId;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`overflow-visible ${className}`}
      fill="none"
      stroke={INK}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ART[id]}
    </svg>
  );
}
