export function Mascot({
  bubble,
  className,
}: {
  bubble: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 190"
      role="img"
      aria-label={`มาสคอต K-Thok พูดว่า ${bubble}`}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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

      <path d="M52 172c-3-30 6-52 32-54 27-2 38 22 36 54" className="fill-paper" />
      <path
        d="M85 52c24-2 41 15 40 37-1 21-18 35-41 34-22-1-37-17-36-37 1-19 15-32 37-34z"
        className="fill-paper"
      />
      <path d="M78 53c2-10 9-16 16-15M88 52c5-8 12-10 18-7" />
      <path d="M70 84v6M100 82v6" strokeWidth="4.5" />
      <path d="M74 101c8 8 20 8 27-1" />
      <path d="M58 95c3 1 6 1 8 0M106 93c3 1 6 1 8 0" className="stroke-accent" />
      <path d="M118 132c12-4 21-14 24-27" />
      <path d="M136 100l6 5 7-4" />
      <path d="M14 174c60-4 150-4 212 0" />
    </svg>
  );
}
