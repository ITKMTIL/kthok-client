"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export function Mascot({
  bubble,
  className,
}: {
  bubble: string;
  className?: string;
}) {
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
      viewBox="0 0 330 190"
      role="img"
      aria-label={`มาสคอต K-Thok สองคนคุยกัน คนหนึ่งพูดว่า ${bubble}`}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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

      <path d="M14 174c80-4 220-4 302 0" />
    </svg>
  );
}
