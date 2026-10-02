export const BRAND = {
  paper: "#f4f2ec",
  card: "#fffdf8",
  ink: "#1b1a17",
  inkSoft: "#5d5a52",
  accent: "#e35205",
  accentSoft: "#ffd8bd",
} as const;

export function BrandMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke={BRAND.ink}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M14 7h36c5.5 0 10 4.5 10 10v20c0 5.5-4.5 10-10 10H29L15 59l2-12h-3C8.5 47 4 42.500 4 37V17C4 11.500 8.500 7 14 7z"
        fill={BRAND.accentSoft}
      />
      <path d="M24 20v6M40 20v6" strokeWidth="5" />
      <path d="M21 32c6.500 7 15.500 7 22 0" />
      <path d="M13 29h4M47 29h4" stroke={BRAND.accent} strokeWidth="3" />
    </svg>
  );
}
