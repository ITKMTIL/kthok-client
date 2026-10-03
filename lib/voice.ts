export const MAX_VOICE_SECONDS = 60;
export const VOICE_PEAKS = 48;
export const VOICE_BITRATE = 32_000;
export const VOICE_LIVE_BARS = 28;

const PREFERRED_TYPES = [
  "audio/mp4",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
];

export function canRecordVoice(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  );
}

export function pickRecorderType(): string | undefined {
  return PREFERRED_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

export function toPeaks(levels: number[], count = VOICE_PEAKS): number[] {
  if (levels.length === 0) return Array.from({ length: count }, () => 0);
  const loudest = Math.max(...levels, 0.05);
  return Array.from({ length: count }, (_, index) => {
    const start = Math.floor((index * levels.length) / count);
    const end = Math.max(start + 1, Math.floor(((index + 1) * levels.length) / count));
    const slice = levels.slice(start, end);
    const peak = Math.max(...slice) / loudest;
    return Math.round(Math.min(1, peak) * 100) / 100;
  });
}

export function formatClock(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
