"use client";

import { Check, Copy, HeartHandshake, LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { useT } from "@/hooks/use-locale";
import type { KeepState } from "@/types/chat";

export function KeepTalking({
  keep,
  partnerName,
  onOffer,
}: {
  keep: KeepState;
  partnerName: string;
  onOffer: (contact: string) => Promise<string | null>;
}) {
  const t = useT();
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!contact.trim() || busy) return;
    setBusy(true);
    setError(await onOffer(contact.trim()));
    setBusy(false);
  }

  if (keep.partnerContact) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl border-2 border-ink bg-safe-soft p-3"
      >
        <p className="flex items-center gap-1.5 font-bold">
          <HeartHandshake className="size-5" aria-hidden />
          {t.followup.matched}
        </p>
        <p className="text-sm">{t.followup.theirContact(partnerName)}</p>
        <div className="flex w-full items-center gap-2">
          <span className="doodle-field min-w-0 flex-1 truncate select-all font-bold">
            {keep.partnerContact}
          </span>
          <button
            type="button"
            className="doodle-btn grid size-10 shrink-0 place-items-center p-0"
            aria-label={t.followup.copy}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(keep.partnerContact ?? "");
                setCopied(true);
              } catch {}
            }}
          >
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          </button>
        </div>
        <p className="text-xs text-ink-soft">{t.followup.notStored}</p>
      </motion.div>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-2 rounded-2xl border-2 border-dashed border-ink p-3 text-left">
      <p className="flex items-center gap-1.5 font-bold">
        <HeartHandshake className="size-5" aria-hidden />
        {t.followup.question}
      </p>
      {keep.partnerOffered && (
        <p className="rounded-xl bg-accent-soft px-2 py-1 text-sm font-bold">
          {t.followup.partnerOffered(partnerName)}
        </p>
      )}
      {keep.offered ? (
        <p className="flex items-center gap-1.5 text-sm">
          <LoaderCircle className="size-4 animate-spin" aria-hidden />
          {t.followup.waiting(partnerName)}
        </p>
      ) : (
        <>
          <p className="text-xs text-ink-soft">
            {t.followup.hint}
          </p>
          <form className="flex gap-2" onSubmit={submit}>
            <input
              className="doodle-field min-w-0 flex-1 text-sm"
              value={contact}
              maxLength={60}
              placeholder={t.followup.placeholder}
              aria-label={t.followup.contact}
              onChange={(event) => setContact(event.target.value)}
            />
            <button
              type="submit"
              className="doodle-btn doodle-btn-primary shrink-0 px-3 text-sm font-bold"
              disabled={!contact.trim() || busy}
            >
              {t.followup.submit}
            </button>
          </form>
        </>
      )}
      {error && (
        <p className="text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
