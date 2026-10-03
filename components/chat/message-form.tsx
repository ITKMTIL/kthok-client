"use client";

import { Lightbulb, LoaderCircle, Mic } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { VoiceRecorderBar } from "@/components/voice/voice-recorder-bar";
import { MIC_DENIED_MESSAGE } from "@/constants/messages";
import { useTypingSignal } from "@/hooks/use-typing-signal";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { canRecordVoice } from "@/lib/voice";
import type { RecordedVoice } from "@/types/chat";

const MAX_MESSAGE_LENGTH = 1000;

export function MessageForm({
  disabled,
  onSend,
  onSendVoice,
  onPrompt,
  onTyping,
  onFocus,
}: {
  disabled: boolean;
  onSend: (text: string) => Promise<string | null>;
  onSendVoice: ((voice: RecordedVoice) => Promise<string | null>) | null;
  onPrompt: () => Promise<string | null>;
  onTyping: (typing: boolean) => void;
  onFocus: () => void;
}) {
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
    if (disabled || !onSendVoice) cancel();
  }, [disabled, onSendVoice, cancel]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || disabled) return;
    typing.stop();
    setDraft("");
    const failure = await onSend(text);
    setError(failure);
    if (failure) setDraft((current) => current || text);
  }

  async function startRecording() {
    setError(null);
    typing.stop();
    if (!(await recorder.start())) setError(MIC_DENIED_MESSAGE);
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
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <button
            type="button"
            className="doodle-btn grid size-11 shrink-0 place-items-center p-0"
            aria-label="สุ่มคำถามชวนคุย"
            title="สุ่มคำถามชวนคุย"
            disabled={disabled}
            onClick={async () => setError(await onPrompt())}
          >
            <Lightbulb className="size-5" aria-hidden />
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
            placeholder={disabled ? "ห้องนี้ปิดแล้ว" : "พิมพ์อะไรสักหน่อย…"}
            aria-label="ข้อความ"
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={disabled}
            autoComplete="off"
          />
          {showMic ? (
            <button
              type="button"
              className="doodle-btn doodle-btn-primary grid w-[4.25rem] shrink-0 place-items-center"
              aria-label={sendingVoice ? "กำลังส่งข้อความเสียง" : "อัดข้อความเสียง"}
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
              ส่ง
            </button>
          )}
        </form>
      )}
    </div>
  );
}
