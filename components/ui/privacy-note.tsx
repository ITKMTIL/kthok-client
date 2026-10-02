export function PrivacyNote({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`flex items-center gap-3 rounded-2xl border-2 border-dashed border-ink bg-safe-soft px-4 py-3 text-left ${className}`}
      aria-label="ความเป็นส่วนตัว"
    >
      <svg
        viewBox="0 0 48 48"
        className="size-11 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path
          d="M24 5c5 4 11 6 17 6 1 14-4 25-17 32C11 36 6 25 7 11c6 0 12-2 17-6z"
          className="fill-card"
        />
        <path d="M16 24l6 6 11-12" className="stroke-safe" strokeWidth="4" />
      </svg>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-snug">
          เราไม่เก็บข้อความและอีเมล
        </p>
        <p className="text-sm leading-snug text-ink-soft">
          <span className="block">ใช้อีเมลแค่ยืนยันว่าเป็นเด็ก สจล.</span>
          <span className="block">
            เก็บเฉพาะรหัสที่เข้ารหัสทางเดียว ไว้กันคนป่วน
          </span>
        </p>
      </div>
    </aside>
  );
}
