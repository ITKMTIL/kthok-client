interface Tone {
  frequency: number;
  at: number;
  duration: number;
}

const VOLUME = 0.07;

const SOUNDS = {
  match: [
    { frequency: 659, at: 0, duration: 0.14 },
    { frequency: 880, at: 0.14, duration: 0.22 },
  ],
  message: [{ frequency: 784, at: 0, duration: 0.1 }],
  leave: [
    { frequency: 440, at: 0, duration: 0.14 },
    { frequency: 330, at: 0.14, duration: 0.2 },
  ],
  ring: [
    { frequency: 587, at: 0, duration: 0.16 },
    { frequency: 740, at: 0.2, duration: 0.16 },
    { frequency: 587, at: 0.4, duration: 0.16 },
  ],
} satisfies Record<string, Tone[]>;

export type SoundName = keyof typeof SOUNDS;

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined" || !window.AudioContext) return null;
  return (context ??= new window.AudioContext());
}

export function unlockAudio() {
  const audio = getContext();
  if (audio?.state === "suspended") void audio.resume();
}

export function playSound(name: SoundName) {
  const audio = getContext();
  if (!audio || audio.state !== "running") return;

  for (const tone of SOUNDS[name]) {
    const start = audio.currentTime + tone.at;
    const end = start + tone.duration;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(tone.frequency, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(VOLUME, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(end);
  }
}
