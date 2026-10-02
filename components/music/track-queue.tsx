import { X } from "lucide-react";
import type { Track } from "@/types/chat";

export function TrackQueue({
  queue,
  disabled,
  onRemove,
}: {
  queue: Track[];
  disabled: boolean;
  onRemove: (trackId: string) => void;
}) {
  return (
    <details className="min-h-0" open>
      <summary className="cursor-pointer text-sm font-bold">
        คิวถัดไป ({queue.length})
      </summary>
      {queue.length === 0 ? (
        <p className="mt-1 text-sm text-ink-soft">ยังไม่มีเพลงในคิว</p>
      ) : (
        <ol className="mt-1 flex max-h-32 flex-col gap-1 overflow-y-auto lg:max-h-none">
          {queue.map((track, index) => (
            <li key={track.id} className="flex items-center gap-2 text-sm">
              <span className="w-5 shrink-0 text-right text-ink-soft">
                {index + 1}.
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate" title={track.title}>
                  {track.title}
                </span>
                <span className="block truncate text-xs text-ink-soft">
                  {track.addedBy}
                </span>
              </span>
              <button
                type="button"
                className="doodle-btn shrink-0 p-1"
                disabled={disabled}
                onClick={() => onRemove(track.id)}
                aria-label={`ลบ ${track.title} ออกจากคิว`}
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ol>
      )}
    </details>
  );
}
