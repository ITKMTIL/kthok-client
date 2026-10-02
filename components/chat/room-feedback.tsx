"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

export function RoomFeedback({
  onFeedback,
}: {
  onFeedback: (rating: "up" | "down") => void;
}) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return <p className="text-sm text-ink-soft">ขอบคุณที่บอกเรานะ</p>;
  }

  const rate = (rating: "up" | "down") => {
    onFeedback(rating);
    setSent(true);
  };

  return (
    <div className="flex items-center gap-2 text-sm text-ink-soft">
      <span>ห้องนี้เป็นยังไงบ้าง</span>
      <button
        type="button"
        className="doodle-btn grid size-8 place-items-center"
        aria-label="คุยสนุก"
        title="คุยสนุก"
        onClick={() => rate("up")}
      >
        <ThumbsUp className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        className="doodle-btn grid size-8 place-items-center"
        aria-label="ไม่ค่อยโอเค"
        title="ไม่ค่อยโอเค"
        onClick={() => rate("down")}
      >
        <ThumbsDown className="size-4" aria-hidden />
      </button>
    </div>
  );
}
