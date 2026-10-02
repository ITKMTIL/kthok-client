import { ImageDown } from "lucide-react";
import { MAX_SHARED_MESSAGES } from "@/hooks/use-message-selection";

export function ShareToolbar({
  count,
  onCancel,
  onCreate,
}: {
  count: number;
  onCancel: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <p className="min-w-0 flex-1 text-sm" aria-live="polite">
        <span className="font-bold">เลือกแล้ว {count} ข้อความ</span>
        <span className="block truncate text-xs text-ink-soft">
          แตะข้อความที่อยากแชร์ สูงสุด {MAX_SHARED_MESSAGES}
        </span>
      </p>
      <button type="button" className="doodle-btn px-3 py-2" onClick={onCancel}>
        ยกเลิก
      </button>
      <button
        type="button"
        className="doodle-btn doodle-btn-primary flex items-center gap-1.5 px-3 py-2 font-bold"
        disabled={count === 0}
        onClick={onCreate}
      >
        <ImageDown className="size-4" aria-hidden />
        สร้างรูป
      </button>
    </div>
  );
}
