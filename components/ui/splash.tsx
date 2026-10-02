"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { BRAND } from "@/lib/brand";

const SEEN_KEY = "kthok:splash-seen";
const CURTAINS = ["curtain-paper", "curtain-soft", "curtain-accent"];
const CURTAIN_FULL = "M0 0 L100 0 L100 100 Q50 100 0 100 Z";
const CURTAIN_LIFTING = "M0 0 L100 0 L100 46 Q50 104 0 46 Z";
const CURTAIN_GONE = "M0 0 L100 0 L100 0 Q50 0 0 0 Z";
const LETTERS = ["K", "-", "T", "H", "O", "K"];

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
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (alreadySeen() || reduced) {
        timeline.set(root, { autoAlpha: 0 });
        return;
      }

      timeline
        .fromTo(
          ".splash-bubble",
          { scale: 0, rotation: -18, opacity: 0, transformOrigin: "30% 90%" },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.55, ease: "back.out(1.9)" },
        )
        .fromTo(
          ".splash-eye",
          { scaleY: 0, opacity: 0, transformOrigin: "50% 50%" },
          { scaleY: 1, opacity: 1, duration: 0.18, stagger: 0.07, ease: "power2.out" },
          "-=0.15",
        )
        .fromTo(
          ".splash-smile",
          { strokeDashoffset: 30, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
        )
        .fromTo(
          ".splash-cheek",
          { scale: 0, opacity: 0, transformOrigin: "50% 50%" },
          { scale: 1, opacity: 1, duration: 0.2, stagger: 0.05, ease: "back.out(3)" },
          "-=0.1",
        )
        .fromTo(
          ".splash-letter",
          { y: 26, opacity: 0, rotation: () => gsap.utils.random(-14, 14) },
          { y: 0, opacity: 1, rotation: 0, duration: 0.4, stagger: 0.06, ease: "back.out(2.2)" },
          "-=0.25",
        )
        .to(".splash-mark", { y: -14, duration: 0.2, ease: "power2.out" }, "+=0.05")
        .to(".splash-mark", { y: 0, duration: 0.35, ease: "bounce.out" })
        .to(".splash-eye", { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: 1 }, "-=0.15")
        .fromTo(
          ".splash-tagline",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          "-=0.2",
        )
        .addLabel("leave", "+=0.4")
        .to(
          ".splash-letter",
          {
            y: -70,
            opacity: 0,
            rotation: () => gsap.utils.random(-40, 40),
            duration: 0.32,
            stagger: 0.035,
            ease: "back.in(2.4)",
          },
          "leave",
        )
        .to(".splash-tagline", { opacity: 0, y: 10, duration: 0.2 }, "leave")
        .to(
          ".splash-mark",
          { scaleY: 0.78, scaleX: 1.14, y: 10, duration: 0.16, ease: "power2.in" },
          "leave+=0.05",
        )
        .to(".splash-mark", {
          scaleY: 1.15,
          scaleX: 0.9,
          y: () => -window.innerHeight * 0.75,
          rotation: 28,
          duration: 0.5,
          ease: "power3.in",
        })
        .addLabel("lift", "-=0.34")
        .add(() => {
          gsap.from(document.querySelectorAll("header, main > *"), {
            y: 44,
            opacity: 0,
            scale: 0.95,
            rotation: (index) => (index % 2 ? 1.5 : -1.5),
            duration: 0.6,
            stagger: 0.07,
            delay: 0.18,
            ease: "back.out(1.9)",
            clearProps: "transform,opacity",
          });
        }, "lift");

      CURTAINS.forEach((curtain, index) => {
        const at = `lift+=${index * 0.13}`;
        timeline
          .to(
            `.${curtain}`,
            { attr: { d: CURTAIN_LIFTING }, duration: 0.34, ease: "power2.in" },
            at,
          )
          .to(
            `.${curtain}`,
            { attr: { d: CURTAIN_GONE }, duration: 0.36, ease: "power2.out" },
            `${at}+=0.34`,
          );
      });
    },
    { scope: rootRef },
  );

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="splash fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 overflow-hidden"
      aria-hidden
    >
      <Curtain className="curtain-accent" fill={BRAND.accent} />
      <Curtain className="curtain-soft" fill={BRAND.accentSoft} />
      <Curtain className="curtain-paper" fill={BRAND.paper} />
      <svg
        viewBox="0 0 64 64"
        className="splash-mark relative size-32 overflow-visible"
        fill="none"
        stroke={BRAND.ink}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className="splash-bubble"
          style={{ opacity: 0 }}
          d="M14 7h36c5.500 0 10 4.500 10 10v20c0 5.500-4.500 10-10 10H29L15 59l2-12h-3C8.500 47 4 42.500 4 37V17C4 11.500 8.500 7 14 7z"
          fill={BRAND.accentSoft}
        />
        <path className="splash-eye" style={{ opacity: 0 }} d="M24 20v6" strokeWidth="5" />
        <path className="splash-eye" style={{ opacity: 0 }} d="M40 20v6" strokeWidth="5" />
        <path
          className="splash-smile"
          style={{ opacity: 0 }}
          d="M21 32c6.500 7 15.500 7 22 0"
          strokeDasharray="30"
        />
        <path className="splash-cheek" style={{ opacity: 0 }} d="M13 29h4" stroke={BRAND.accent} strokeWidth="3" />
        <path className="splash-cheek" style={{ opacity: 0 }} d="M47 29h4" stroke={BRAND.accent} strokeWidth="3" />
      </svg>
      <p className="relative flex text-5xl font-bold tracking-wide">
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
      <p className="splash-tagline relative text-ink-soft" style={{ opacity: 0 }}>
        ทอล์คกันมั้ย?
      </p>
    </div>
  );
}

function Curtain({ className, fill }: { className: string; fill: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
    >
      <path className={className} d={CURTAIN_FULL} fill={fill} />
    </svg>
  );
}
