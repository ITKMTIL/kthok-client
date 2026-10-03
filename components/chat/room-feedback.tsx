"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useT } from "@/hooks/use-locale";

export function RoomFeedback({
  onFeedback,
}: {
  onFeedback: (rating: "up" | "down") => void;
}) {
  const t = useT();
  const [sent, setSent] = useState(false);

  if (sent) {
    return <p className="text-sm text-ink-soft">{t.feedback.thanks}</p>;
  }

  const rate = (rating: "up" | "down") => {
    onFeedback(rating);
    setSent(true);
  };

  return (
    <div className="flex items-center gap-2 text-sm text-ink-soft">
      <span>{t.feedback.question}</span>
      <button
        type="button"
        className="doodle-btn grid size-8 place-items-center"
        aria-label={t.feedback.up}
        title={t.feedback.up}
        onClick={() => rate("up")}
      >
        <ThumbsUp className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        className="doodle-btn grid size-8 place-items-center"
        aria-label={t.feedback.down}
        title={t.feedback.down}
        onClick={() => rate("down")}
      >
        <ThumbsDown className="size-4" aria-hidden />
      </button>
    </div>
  );
}
