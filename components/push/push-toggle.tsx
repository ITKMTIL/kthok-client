"use client";

import { BellRing, LoaderCircle } from "lucide-react";
import type { usePush } from "@/hooks/use-push";

const HINTS = {
  off: "เด้งเตือนเมื่อเจอเพื่อนหรือมีข้อความใหม่ตอนสลับไปแอปอื่น",
  on: "เปิดอยู่ เราส่งแค่ว่ามีอะไรเกิดขึ้น ไม่ส่งเนื้อหาข้อความ",
  denied: "เบราว์เซอร์บล็อกการแจ้งเตือนไว้ ต้องไปเปิดในตั้งค่าของเบราว์เซอร์",
  busy: "กำลังตั้งค่า…",
  failed: "เปิดแจ้งเตือนไม่สำเร็จ ลองอีกครั้งนะ",
} as const;

export function PushToggle({ push }: { push: ReturnType<typeof usePush> }) {
  if (!push.available || push.support === "unsupported") return null;

  if (push.support === "needs-install") {
    return (
      <p className="flex items-center gap-2 text-left text-sm text-ink-soft">
        <BellRing className="size-4 shrink-0" aria-hidden />
        อยากได้แจ้งเตือนบน iPhone? กดแชร์แล้วเลือก &ldquo;เพิ่มไปยังหน้าจอโฮม&rdquo; ก่อน แล้วเปิดจากไอคอน
      </p>
    );
  }

  const on = push.status === "on";
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-ink px-4 py-2 text-left">
      <BellRing className="size-5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-bold">แจ้งเตือนตอนปิดจอ</p>
        <p className="text-xs text-ink-soft">{HINTS[push.status]}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="แจ้งเตือนตอนปิดจอ"
        className={`doodle-btn shrink-0 px-3 py-1 text-sm font-bold ${on ? "doodle-btn-primary" : ""}`}
        disabled={push.status === "busy" || push.status === "denied"}
        onClick={() => void (on ? push.disable() : push.enable())}
      >
        {push.status === "busy" ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden />
        ) : on ? (
          "เปิดอยู่"
        ) : (
          "เปิด"
        )}
      </button>
    </div>
  );
}
