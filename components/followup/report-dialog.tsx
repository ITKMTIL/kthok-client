"use client";

import { Flag, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useT } from "@/hooks/use-locale";
import type { ChatMessage, ReportInput, ReportReason } from "@/types/chat";

const REASONS: ReportReason[] = ["harassment", "sexual", "hate", "spam", "other"];

const MAX_EVIDENCE = 20;

export function ReportDialog({
  messages,
  partnerName,
  onSubmit,
  onClose,
}: {
  messages: ChatMessage[];
  partnerName: string;
  onSubmit: (input: ReportInput) => Promise<string | null>;
  onClose: () => void;
}) {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const candidates = messages.filter(
    (message) =>
      !message.voice && !message.prompt && !message.sticker && !message.unsent,
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function toggle(id: string) {
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_EVIDENCE) next.add(id);
      return next;
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!reason || busy) return;
    setBusy(true);
    const failure = await onSubmit({
      reason,
      note: note.trim(),
      messages: candidates
        .filter((message) => picked.has(message.id))
        .map(({ id, text }) => ({ id, text })),
    });
    setBusy(false);
    setError(failure);
    if (!failure) setDone(true);
  }

  return (
    <dialog
      ref={dialogRef}
      className="doodle-card m-auto flex max-h-[calc(var(--app-height,100dvh)-1.5rem)] w-[min(28rem,calc(100vw-1.5rem))] flex-col gap-3 p-4 backdrop:bg-ink/50"
      aria-labelledby="report-title"
      onClose={onClose}
    >
      <div className="flex items-center gap-2">
        <h2 id="report-title" className="flex flex-1 items-center gap-1.5 text-lg font-bold">
          <Flag className="size-5 text-danger" aria-hidden />
          {t.report.title(partnerName)}
        </h2>
        <button
          type="button"
          className="grid size-8 cursor-pointer place-items-center rounded-full hover:bg-accent-soft"
          aria-label={t.common.close}
          onClick={() => dialogRef.current?.close()}
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      {done ? (
        <div className="flex flex-col gap-3">
          <p>{t.report.done}</p>
          <button
            type="button"
            className="doodle-btn doodle-btn-primary px-4 py-2 font-bold"
            onClick={() => dialogRef.current?.close()}
          >
            {t.common.close}
          </button>
        </div>
      ) : (
        <form className="flex min-h-0 flex-col gap-3" onSubmit={submit}>
          <fieldset className="flex flex-wrap gap-2">
            <legend className="mb-1 text-sm font-bold">{t.report.what}</legend>
            {REASONS.map((item) => (
              <label key={item} className="doodle-chip text-sm">
                <input
                  type="radio"
                  name="report-reason"
                  className="sr-only"
                  checked={reason === item}
                  onChange={() => setReason(item)}
                />
                {t.report.reasons[item]}
              </label>
            ))}
          </fieldset>

          {candidates.length > 0 && (
            <fieldset className="flex min-h-0 flex-col gap-1">
              <legend className="mb-1 text-sm font-bold">
                {t.report.evidence(MAX_EVIDENCE)}
              </legend>
              <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-xl border-2 border-ink p-2">
                {candidates.map((message) => (
                  <label
                    key={message.id}
                    className={`flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1 text-sm ${picked.has(message.id) ? "bg-accent-soft" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 accent-[var(--color-accent)]"
                      checked={picked.has(message.id)}
                      onChange={() => toggle(message.id)}
                    />
                    <span className="min-w-0 break-words">
                      <span className="font-bold">
                        {message.mine ? t.messages.you : partnerName}:
                      </span>{" "}
                      {message.text}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-bold">{t.report.note}</span>
            <textarea
              className="doodle-field min-h-16 resize-none"
              value={note}
              maxLength={300}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>

          <p className="text-xs text-ink-soft">
            {t.report.privacy}
          </p>
          {error && (
            <p className="text-sm font-medium text-danger" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="doodle-btn bg-danger px-4 py-2 font-bold text-card"
            disabled={!reason || busy}
          >
            {t.report.submit}
          </button>
        </form>
      )}
    </dialog>
  );
}
