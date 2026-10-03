"use client";

import { Lightbulb, LoaderCircle, Mic, Reply, Sticker as StickerIcon, X } from "lucide-react";
import { StickerPicker } from "@/components/stickers/sticker-picker";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { VoiceRecorderBar } from "@/components/voice/voice-recorder-bar";
import { useT } from "@/hooks/use-locale";
import { useTypingSignal } from "@/hooks/use-typing-signal";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { canRecordVoice } from "@/lib/voice";
import type { ChatMessage, Outgoing, RecordedVoice } from "@/types/chat";
import { summarize } from "./message-bubble";

const MAX_MESSAGE_LENGTH = 1000;

export function MessageForm({
  disabled,
  onSend,
  onSendVoice,
  onPrompt,
  onTyping,
  onFocus,
  replyTarget,
  onCancelReply,
}: {
  disabled: boolean;
  onSend: (content: Outgoing) => Promise<string | null>;
  onSendVoice: ((voice: RecordedVoice) => Promise<string | null>) | null;
  onPrompt: () => Promise<string | null>;
  onTyping: (typing: boolean) => void;
  onFocus: () => void;
  replyTarget: ChatMessage | null;
  onCancelReply: () => void;
}) {
  const t = useT();
  const [stickersOpen, setStickersOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sendingVoice, setSendingVoice] = useState(false);
  const typing = useTypingSignal(onTyping);
  const inputRef = useRef<HTMLInputElement>(null);
  const [voiceSupported] = useState(canRecordVoice);

  const handleRecorded = useCallback(
    async (voice: RecordedVoice) => {
      if (!onSendVoice) return;
      setSendingVoice(true);
      setError(await onSendVoice(voice));
      setSendingVoice(false);
    },
    [onSendVoice],
  );
  const recorder = useVoiceRecorder(handleRecorded);
  const { cancel } = recorder;

  useEffect(() => {
    if (window.matchMedia("(hover: hover)").matches) inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (replyTarget) inputRef.current?.focus();
  }, [replyTarget]);

  useEffect(() => {
    if (disabled || !onSendVoice) cancel();
  }, [disabled, onSendVoice, cancel]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || disabled) return;
    typing.stop();
    setDraft("");
    const failure = await onSend({ text });
    setError(failure);
    if (failure) setDraft((current) => current || text);
  }

  async function startRecording() {
    setError(null);
    typing.stop();
    if (!(await recorder.start())) setError(t.errors.micDenied);
  }

  const showMic = Boolean(onSendVoice) && voiceSupported && !draft.trim();

  return (
    <div>
      {error && (
        <p className="mb-1 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
      {recorder.status === "recording" ? (
        <VoiceRecorderBar
          elapsed={recorder.elapsed}
          live={recorder.live}
          onCancel={recorder.cancel}
          onSend={recorder.send}
        />
      ) : (
        <>
        {replyTarget && (
          <div className="mb-1.5 flex items-center gap-2 rounded-xl border-2 border-dashed border-ink px-3 py-1 text-sm">
            <Reply className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 truncate">
              {replyTarget.mine ? t.messages.replyingSelf : t.messages.replyingPartner}: {summarize(t, replyTarget)}
            </span>
            <button
              type="button"
              className="grid size-6 cursor-pointer place-items-center rounded-full hover:bg-accent-soft"
              aria-label={t.messages.cancelReply}
              onClick={onCancelReply}
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        )}
        <form className="relative flex gap-2" onSubmit={handleSubmit}>
          {stickersOpen && (
            <StickerPicker
              onClose={() => setStickersOpen(false)}
              onPick={async (sticker) => {
                setStickersOpen(false);
                setError(await onSend({ sticker }));
              }}
            />
          )}
          <button
            type="button"
            className="doodle-btn grid size-11 shrink-0 place-items-center p-0"
            aria-label={t.messages.prompt}
            title={t.messages.prompt}
            disabled={disabled}
            onClick={async () => setError(await onPrompt())}
          >
            <Lightbulb className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            className="doodle-btn grid size-11 shrink-0 place-items-center p-0"
            aria-label={t.stickers.send}
            aria-expanded={stickersOpen}
            title={t.stickers.title}
            disabled={disabled}
            onClick={() => setStickersOpen((open) => !open)}
          >
            <StickerIcon className="size-5" aria-hidden />
          </button>
          <input
            ref={inputRef}
            className="doodle-field min-w-0 flex-1"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              typing.touch();
            }}
            onFocus={onFocus}
            placeholder={disabled ? t.messages.closed : t.messages.placeholder}
            aria-label={t.messages.input}
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={disabled}
            autoComplete="off"
          />
          {showMic ? (
            <button
              type="button"
              className="doodle-btn doodle-btn-primary grid w-[4.25rem] shrink-0 place-items-center"
              aria-label={sendingVoice ? t.voice.sending : t.voice.record}
              disabled={disabled || sendingVoice || recorder.status !== "idle"}
              onClick={startRecording}
            >
              {sendingVoice || recorder.status === "starting" ? (
                <LoaderCircle className="size-5 animate-spin" aria-hidden />
              ) : (
                <Mic className="size-5" aria-hidden />
              )}
            </button>
          ) : (
            <button
              type="submit"
              className="doodle-btn doodle-btn-primary w-[4.25rem] shrink-0 font-bold"
              disabled={disabled || !draft.trim()}
            >
              {t.messages.send}
            </button>
          )}
        </form>
        </>
      )}
    </div>
  );
}
