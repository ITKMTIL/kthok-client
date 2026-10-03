import { Mic, User } from "lucide-react";
import type { Ref } from "react";
import { Waveform } from "@/components/voice/waveform";
import { facultyOf, type FacultyId } from "@/constants/faculties";
import { formatClock } from "@/lib/voice";
import type { ChatMessage } from "@/types/chat";

export interface ShareParty {
  name: string;
  faculty: FacultyId | null;
}

export function ShareCard({
  ref,
  messages,
  self,
  partner,
}: {
  ref: Ref<HTMLDivElement>;
  messages: ChatMessage[];
  self: ShareParty;
  partner: ShareParty;
}) {
  return (
    <div
      ref={ref}
      className="flex w-[360px] flex-col gap-3 bg-paper p-5 font-sans text-ink"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-2xl font-bold tracking-wide">
          K<span className="text-accent">-</span>THOK
        </span>
        <span className="text-xs text-ink-soft">แชตนิรนามชาว สจล.</span>
      </div>

      <div className="flex items-center justify-between gap-2 text-sm">
        <PartyBadge party={partner} />
        <PartyBadge party={self} reverse />
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border-2 border-ink bg-card p-3">
        {messages.map((message) => (
          <CardMessage key={message.id} message={message} />
        ))}
      </div>

      <p className="text-center text-xs text-ink-soft">
        คุยกับเพื่อนใหม่ในรั้ว สจล. ที่ <span className="font-bold text-ink">k-thok</span>
      </p>
    </div>
  );
}

function PartyBadge({ party, reverse }: { party: ShareParty; reverse?: boolean }) {
  const Icon = (party.faculty && facultyOf(party.faculty)?.icon) || User;
  return (
    <span
      className={`flex min-w-0 items-center gap-1.5 ${reverse ? "flex-row-reverse" : ""}`}
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-accent-soft">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="truncate font-bold">{party.name}</span>
    </span>
  );
}

function CardMessage({ message }: { message: ChatMessage }) {
  const reactions = [message.reactions.theirs, message.reactions.mine].filter(
    (reaction): reaction is string => reaction !== null,
  );
  return (
    <div
      className={`flex max-w-[85%] flex-col ${message.mine ? "items-end self-end" : "items-start self-start"}`}
    >
      {message.voice ? (
        <p className={`bubble flex w-56 max-w-full items-center gap-2 ${message.mine ? "bubble-mine" : "bubble-theirs"}`}>
          <Mic className="size-4 shrink-0" aria-hidden />
          <Waveform peaks={message.voice.peaks} className="h-6 min-w-0 flex-1" />
          <span className="shrink-0 text-xs tabular-nums">
            {formatClock(message.voice.duration)}
          </span>
        </p>
      ) : (
        <p className={`bubble max-w-full ${message.mine ? "bubble-mine" : "bubble-theirs"}`}>
          {message.text}
        </p>
      )}
      {reactions.length > 0 && (
        <span className="-mt-1.5 flex gap-1 px-2">
          {reactions.map((reaction, index) => (
            <span
              key={index}
              className="rounded-full border-2 border-ink bg-card px-1.5 text-sm leading-6"
            >
              {reaction}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
