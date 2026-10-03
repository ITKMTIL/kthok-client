"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useT } from "@/hooks/use-locale";

export function Mascot({
  bubble,
  className,
}: {
  bubble: string;
  className?: string;
}) {
  const t = useT();
  const rootRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".mascot-bubble", {
          y: -4,
          rotation: 1.5,
          svgOrigin: "150 80",
          duration: 1.6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to(".mascot-body", {
          y: 1.5,
          duration: 1.9,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to(".friend-body", {
          y: 1.5,
          duration: 1.7,
          delay: 0.6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.fromTo(
          ".friend-sway",
          { rotation: -1.5, svgOrigin: "267 174" },
          {
            rotation: 1.5,
            svgOrigin: "267 174",
            duration: 2.4,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          },
        );

        gsap.fromTo(
          ".scene-train",
          { x: -190 },
          {
            x: 400,
            duration: 9,
            ease: "none",
            repeat: -1,
            repeatDelay: 3.5,
            delay: 1.2,
          },
        );
        gsap.to(".scene-train-body", {
          y: -1.2,
          duration: 0.18,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to(".scene-smoke", {
          y: -12,
          x: -8,
          opacity: 0,
          scale: 1.6,
          transformOrigin: "50% 50%",
          duration: 1.1,
          stagger: { each: 0.35, repeat: -1 },
          ease: "power1.out",
        });
        gsap.fromTo(
          ".scene-tree-left",
          { rotation: -2.2, svgOrigin: "-18 174" },
          {
            rotation: 2.2,
            svgOrigin: "-18 174",
            duration: 2.6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          },
        );
        gsap.fromTo(
          ".scene-tree-right",
          { rotation: 2, svgOrigin: "352 174" },
          {
            rotation: -2,
            svgOrigin: "352 174",
            duration: 3.1,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          },
        );

        gsap
          .timeline({ repeat: -1, repeatDelay: 2.2, delay: 0.8 })
          .to(".mascot-arm", {
            rotation: -16,
            svgOrigin: "118 132",
            duration: 0.22,
            yoyo: true,
            repeat: 5,
            ease: "sine.inOut",
          })
          .to(".friend", { y: -9, duration: 0.18, ease: "power2.out" }, "+=0.15")
          .to(".friend", { y: 0, duration: 0.34, ease: "bounce.out" })
          .to(
            ".friend-arm",
            {
              rotation: 18,
              svgOrigin: "238 136",
              duration: 0.2,
              yoyo: true,
              repeat: 5,
              ease: "sine.inOut",
            },
            "-=0.3",
          );

        gsap
          .timeline({ repeat: -1, repeatDelay: 3.1, delay: 1.6 })
          .to(".mascot-eyes", {
            scaleY: 0.1,
            transformOrigin: "50% 50%",
            duration: 0.08,
            yoyo: true,
            repeat: 1,
          });
        gsap
          .timeline({ repeat: -1, repeatDelay: 2.7, delay: 2.5 })
          .to(".friend-eyes", {
            scaleY: 0.1,
            transformOrigin: "50% 50%",
            duration: 0.08,
            yoyo: true,
            repeat: 1,
          });
      });
    },
    { scope: rootRef },
  );

  return (
    <svg
      ref={rootRef}
      viewBox="-45 0 420 190"
      role="img"
      aria-label={t.hero.mascot(bubble)}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M-45 152h420" className="stroke-ink-soft" strokeWidth="2" />
      <g className="scene-train">
        <g className="scene-smoke stroke-ink-soft" strokeWidth="2">
          <circle cx="118" cy="114" r="3" />
          <circle cx="118" cy="114" r="3" />
          <circle cx="118" cy="114" r="3" />
        </g>
        <g className="scene-train-body" strokeWidth="2.5">
          <rect x="0" y="126" width="40" height="21" rx="5" className="fill-card" />
          <rect x="44" y="126" width="40" height="21" rx="5" className="fill-card" />
          <path
            d="M88 147v-16c0-3 2-5 5-5h20c9 0 17 8 19 21z"
            className="fill-accent-soft"
          />
          <path d="M114 126v-6h8v6" className="fill-card" />
          <path d="M40 140h4M84 140h4" />
          <path d="M3 141h34M47 141h34M91 141h36" className="stroke-accent" />
          <path
            d="M7 131h7v6H7zM18 131h7v6h-7zM29 131h6v6h-6zM51 131h7v6h-7zM62 131h7v6h-7zM73 131h6v6h-6zM95 131h7v6h-7zM107 131h9l4 6h-13z"
            className="fill-paper"
            strokeWidth="1.8"
          />
          <g className="fill-ink">
            <circle cx="10" cy="150" r="3" />
            <circle cx="30" cy="150" r="3" />
            <circle cx="54" cy="150" r="3" />
            <circle cx="74" cy="150" r="3" />
            <circle cx="98" cy="150" r="3" />
            <circle cx="120" cy="150" r="3" />
          </g>
        </g>
      </g>

      <g className="scene-tree-left">
        <path d="M-18 174v-44" />
        <path d="M-18 150l-9-9M-18 142l8-8" strokeWidth="2.5" />
        <path
          d="M-18 134c-14 2-24-7-22-19 1-7 6-11 11-12 0-11 9-18 19-16 8 1 13 7 14 14 7 2 11 8 10 16-1 11-12 19-32 17z"
          className="fill-leaf"
        />
      </g>
      <g className="scene-tree-right">
        <path d="M352 174v-36" />
        <path d="M352 156l8-8" strokeWidth="2.5" />
        <path
          d="M352 142c-13 1-21-7-19-17 1-6 5-10 10-11 1-9 8-14 17-13 7 1 12 6 12 13 6 2 9 8 8 14-2 9-11 15-28 14z"
          className="fill-leaf"
        />
      </g>
      <path d="M318 174c2-9 9-13 15-8M-2 174c-1-7 5-11 10-7" strokeWidth="2.5" />

      <g className="mascot-bubble">
        <path
          d="M128 14c28-7 78-5 92 9 12 13 9 40-6 50-14 9-44 9-66 6l-17 17 3-21c-17-8-25-23-21-38 2-11 8-20 15-23z"
          className="fill-accent-soft"
        />
        <text
          x="170"
          y="54"
          textAnchor="middle"
          stroke="none"
          className="fill-ink text-[20px] font-bold"
        >
          {bubble}
        </text>
      </g>

      <g className="mascot-body">
        <path d="M52 172c-3-30 6-52 32-54 27-2 38 22 36 54" className="fill-paper" />
        <g className="mascot-arm">
          <path d="M118 132c12-4 21-14 24-27" />
          <path d="M136 100l6 5 7-4" />
        </g>
        <path
          d="M85 52c24-2 41 15 40 37-1 21-18 35-41 34-22-1-37-17-36-37 1-19 15-32 37-34z"
          className="fill-paper"
        />
        <path d="M78 53c2-10 9-16 16-15M88 52c5-8 12-10 18-7" />
        <path className="mascot-eyes" d="M70 84v6M100 82v6" strokeWidth="4.5" />
        <path d="M74 101c8 8 20 8 27-1" />
        <path d="M58 95c3 1 6 1 8 0M106 93c3 1 6 1 8 0" className="stroke-accent" />
      </g>

      <g className="friend">
        <g className="friend-sway">
        <g className="friend-body">
          <path d="M232 172c-2-29 8-50 34-51 26-1 38 22 36 51" className="fill-tan" />
          <g className="friend-arm">
            <path d="M238 136c-11-3-19-11-22-23" />
            <path d="M210 114l6 3 3-7" />
          </g>
          <g className="friend-head">
            <path
              d="M267 54c23-1 39 15 39 36 0 21-17 37-40 37-22 0-37-16-37-36 0-20 16-36 38-37z"
              className="fill-tan"
            />
            <path
              d="M229 90c-2-24 14-41 38-41 23 0 40 15 39 39-6-8-13-13-21-16-2 4-6 8-11 10 1-5 0-10-3-14-14 3-27 10-42 22z"
              className="fill-ink"
            />
            <path className="friend-eyes" d="M253 94v6M283 95v6" strokeWidth="4.5" />
            <path d="M257 110c7 7 18 8 25 1" />
            <path
              d="M240 104c3 1 6 1 8 0M289 105c3 1 6 1 8 0"
              className="stroke-accent"
            />
          </g>
        </g>
        </g>
      </g>

      <path d="M-38 174c110-4 300-4 408 0" />
    </svg>
  );
}
