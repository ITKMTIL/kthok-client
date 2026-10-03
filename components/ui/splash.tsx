"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { BRAND } from "@/lib/brand";

const SEEN_KEY = "kthok:splash-seen";
const LETTERS = ["K", "-", "T", "H", "O", "K"];
const HOLE_MASK =
  "radial-gradient(circle at 50% 42%, transparent var(--hole), #000 calc(var(--hole) + 1px))";

let seenOnLoad: boolean | null = null;

function alreadySeen(): boolean {
  if (seenOnLoad !== null) return seenOnLoad;
  seenOnLoad = false;
  try {
    seenOnLoad = sessionStorage.getItem(SEEN_KEY) !== null;
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {}
  return seenOnLoad;
}

export function Splash() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const timeline = gsap.timeline({ onComplete: () => setDone(true) });
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (alreadySeen() || reduced) {
        timeline.set(root, { autoAlpha: 0 });
        return;
      }

      const offscreen = () => window.innerWidth / 2 + 340;

      timeline
        .fromTo(
          ".splash-track",
          { scaleX: 0, transformOrigin: "0% 50%" },
          { scaleX: 1, duration: 0.5, ease: "power2.out" },
        )
        .fromTo(
          ".splash-train",
          { x: () => -offscreen(), opacity: 1 },
          { x: 0, duration: 0.95, ease: "power3.out" },
          0.1,
        )
        .fromTo(
          ".splash-train-body",
          { y: 0 },
          { y: -1.6, duration: 0.07, yoyo: true, repeat: 9, ease: "none" },
          0.1,
        )
        .fromTo(
          ".splash-smoke",
          { opacity: 0.9, scale: 0.6, x: 0, y: 0, transformOrigin: "50% 50%" },
          {
            opacity: 0,
            scale: 1.8,
            x: -26,
            y: -22,
            duration: 0.7,
            stagger: 0.18,
            ease: "power1.out",
          },
          0.35,
        )
        .fromTo(
          ".splash-mark",
          { scale: 0, y: 46, rotation: -18, opacity: 1, transformOrigin: "50% 100%" },
          { scale: 1, y: 0, rotation: 0, duration: 0.55, ease: "back.out(2.2)" },
          0.9,
        )
        .fromTo(
          ".splash-eye",
          { scaleY: 0, transformOrigin: "50% 50%" },
          { scaleY: 1, duration: 0.16, stagger: 0.06, ease: "power2.out" },
          1.2,
        )
        .fromTo(
          ".splash-smile",
          { strokeDashoffset: 30 },
          { strokeDashoffset: 0, duration: 0.28, ease: "power2.out" },
          1.28,
        )
        .fromTo(
          ".splash-cheek",
          { scale: 0, transformOrigin: "50% 50%" },
          { scale: 1, duration: 0.2, stagger: 0.05, ease: "back.out(3)" },
          1.4,
        )
        .fromTo(
          ".splash-letter",
          { y: -48, opacity: 0, rotation: () => gsap.utils.random(-25, 25) },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "bounce.out",
          },
          1.15,
        )
        .to(".splash-eye", { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: 1 }, 1.85)
        .addLabel("go", 2.1)
        .to(
          ".splash-mark",
          { scaleX: 1.15, scaleY: 0.85, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" },
          "go",
        )
        .to(
          ".splash-letter",
          {
            y: -60,
            opacity: 0,
            rotation: () => gsap.utils.random(-40, 40),
            duration: 0.3,
            stagger: 0.03,
            ease: "back.in(2.4)",
          },
          "go+=0.1",
        )
        .to(
          ".splash-mark",
          { scale: 0, rotation: 25, duration: 0.3, ease: "back.in(2.4)" },
          "go+=0.26",
        )
        .to(
          ".splash-train",
          { x: () => offscreen() + 160, duration: 0.75, ease: "power2.in" },
          "go+=0.15",
        )
        .to(
          ".splash-track",
          { scaleX: 0, transformOrigin: "100% 50%", duration: 0.35, ease: "power2.in" },
          "go+=0.5",
        )
        .addLabel("open", "go+=0.62")
        .fromTo(
          ".splash-layer-paper",
          { "--hole": "0vmax" },
          { "--hole": "120vmax", duration: 0.7, ease: "power2.in" },
          "open",
        )
        .fromTo(
          ".splash-layer-accent",
          { "--hole": "0vmax" },
          { "--hole": "120vmax", duration: 0.7, ease: "power2.in" },
          "open+=0.13",
        )
        .add(() => {
          gsap.from(document.querySelectorAll("header, main > *"), {
            y: 40,
            opacity: 0,
            scale: 0.95,
            rotation: (index) => (index % 2 ? 1.5 : -1.5),
            duration: 0.6,
            stagger: 0.07,
            ease: "back.out(1.9)",
            clearProps: "transform,opacity",
          });
        }, "open+=0.3");
    },
    { scope: rootRef },
  );

  if (done) return null;

  return (
    <div ref={rootRef} className="splash fixed inset-0 z-50" aria-hidden>
      <div
        className="splash-layer-accent absolute inset-0 bg-accent"
        style={{ "--hole": "0vmax", maskImage: HOLE_MASK, WebkitMaskImage: HOLE_MASK } as React.CSSProperties}
      />
      <div
        className="splash-layer-paper absolute inset-0 bg-paper"
        style={{ "--hole": "0vmax", maskImage: HOLE_MASK, WebkitMaskImage: HOLE_MASK } as React.CSSProperties}
      />

      <div className="absolute inset-x-0 top-[42%] flex -translate-y-1/2 flex-col items-center">
        <svg
          viewBox="0 0 64 64"
          className="splash-mark size-28 overflow-visible"
          style={{ opacity: 0 }}
          fill="none"
          stroke={BRAND.ink}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M14 7h36c5.500 0 10 4.500 10 10v20c0 5.500-4.500 10-10 10H29L15 59l2-12h-3C8.500 47 4 42.500 4 37V17C4 11.500 8.500 7 14 7z"
            fill={BRAND.accentSoft}
          />
          <path className="splash-eye" d="M24 20v6" strokeWidth="5" />
          <path className="splash-eye" d="M40 20v6" strokeWidth="5" />
          <path className="splash-smile" d="M21 32c6.500 7 15.500 7 22 0" strokeDasharray="30" />
          <path className="splash-cheek" d="M13 29h4" stroke={BRAND.accent} strokeWidth="3" />
          <path className="splash-cheek" d="M47 29h4" stroke={BRAND.accent} strokeWidth="3" />
        </svg>

        <div className="relative mt-2 h-24 w-full">
          <div
            className="splash-track absolute inset-x-0 bottom-1 h-[3px] bg-ink/60"
            style={{ transform: "scaleX(0)" }}
          />
          <svg
            viewBox="-6 104 150 52"
            className="splash-train absolute bottom-0 left-1/2 -ml-[150px] h-[104px] w-[300px] overflow-visible"
            style={{ opacity: 0 }}
            fill="none"
            stroke={BRAND.ink}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <g stroke={BRAND.inkSoft} strokeWidth="2">
              <circle className="splash-smoke" cx="118" cy="114" r="3.5" />
              <circle className="splash-smoke" cx="118" cy="114" r="3.5" />
              <circle className="splash-smoke" cx="118" cy="114" r="3.5" />
            </g>
            <g className="splash-train-body">
              <rect x="0" y="126" width="40" height="21" rx="5" fill={BRAND.card} />
              <rect x="44" y="126" width="40" height="21" rx="5" fill={BRAND.card} />
              <path d="M88 147v-16c0-3 2-5 5-5h20c9 0 17 8 19 21z" fill={BRAND.accentSoft} />
              <path d="M114 126v-6h8v6" fill={BRAND.card} />
              <path d="M40 140h4M84 140h4" />
              <path d="M3 141h34M47 141h34M91 141h36" stroke={BRAND.accent} />
              <path
                d="M7 131h7v6H7zM18 131h7v6h-7zM29 131h6v6h-6zM51 131h7v6h-7zM62 131h7v6h-7zM73 131h6v6h-6zM95 131h7v6h-7zM107 131h9l4 6h-13z"
                fill={BRAND.paper}
                strokeWidth="1.8"
              />
              <g fill={BRAND.ink}>
                <circle cx="10" cy="150" r="3" />
                <circle cx="30" cy="150" r="3" />
                <circle cx="54" cy="150" r="3" />
                <circle cx="74" cy="150" r="3" />
                <circle cx="98" cy="150" r="3" />
                <circle cx="120" cy="150" r="3" />
              </g>
            </g>
          </svg>
        </div>

        <p className="mt-4 flex text-5xl font-bold tracking-wide">
          {LETTERS.map((letter, index) => (
            <span
              key={index}
              className={`splash-letter inline-block ${letter === "-" ? "text-accent" : ""}`}
              style={{ opacity: 0 }}
            >
              {letter}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
