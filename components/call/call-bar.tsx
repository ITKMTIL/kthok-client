import { Mic, MicOff, Phone, PhoneIncoming, PhoneOff, X } from "lucide-react";
import { SlideIn } from "@/components/ui/slide-in";
import type { CallState } from "@/hooks/use-voice-call";
import { CallTimer } from "./call-timer";

export function CallBar({
  call,
  partnerName,
  onAccept,
  onDecline,
  onHangUp,
  onToggleMute,
  onDismissNotice,
}: {
  call: CallState;
  partnerName: string;
  onAccept: () => void;
  onDecline: () => void;
  onHangUp: () => void;
  onToggleMute: () => void;
  onDismissNotice: () => void;
}) {
  if (call.status === "idle") {
    if (!call.notice) return null;
    return (
      <SlideIn>
      <div
        className="flex items-center gap-2.5 rounded-2xl border-2 border-dashed border-ink bg-card px-3 py-1.5 text-sm font-medium sm:px-4"
        role="status"
      >
        <PhoneOff className="size-5 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1">{call.notice}</span>
        <button
          type="button"
          className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent"
          aria-label="ปิดข้อความนี้"
          onClick={onDismissNotice}
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      </SlideIn>
    );
  }

  const incoming = call.status === "incoming";
  const active = call.status === "active";
  const Icon = incoming ? PhoneIncoming : Phone;

  return (
    <SlideIn>
    <div
      className="flex items-center gap-2.5 rounded-2xl border-2 border-ink bg-safe-soft px-3 py-1.5 sm:px-4 sm:py-2"
      role="status"
    >
      <Icon
        className={`size-5 shrink-0 text-safe ${active ? "" : "animate-pulse"}`}
        aria-hidden
      />
      <p className="min-w-0 flex-1 text-sm font-bold sm:text-base">
        {incoming && <>{partnerName} ชวนคุยเสียง</>}
        {call.status === "outgoing" && <>กำลังโทรหา {partnerName}…</>}
        {call.status === "connecting" && <>กำลังต่อสาย…</>}
        {active && call.startedAt !== null && (
          <>
            กำลังคุยเสียง <CallTimer startedAt={call.startedAt} />
          </>
        )}
      </p>

      {incoming ? (
        <>
          <button
            type="button"
            className="doodle-btn doodle-btn-primary flex items-center gap-1.5 px-3 py-1 font-bold"
            onClick={onAccept}
          >
            <Phone className="size-4" aria-hidden />
            รับ
          </button>
          <button
            type="button"
            className="doodle-btn px-3 py-1"
            onClick={onDecline}
          >
            ไม่รับ
          </button>
        </>
      ) : (
        <>
          {active && (
            <button
              type="button"
              className="doodle-btn grid size-9 place-items-center"
              aria-pressed={call.muted}
              aria-label={call.muted ? "เปิดไมค์" : "ปิดไมค์"}
              title={call.muted ? "เปิดไมค์" : "ปิดไมค์"}
              onClick={onToggleMute}
            >
              {call.muted ? (
                <MicOff className="size-4" aria-hidden />
              ) : (
                <Mic className="size-4" aria-hidden />
              )}
            </button>
          )}
          <button
            type="button"
            className="doodle-btn flex items-center gap-1.5 px-3 py-1"
            onClick={onHangUp}
          >
            <PhoneOff className="size-4" aria-hidden />
            {call.status === "outgoing" ? "ยกเลิก" : "วางสาย"}
          </button>
        </>
      )}
    </div>
    </SlideIn>
  );
}
