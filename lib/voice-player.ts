import { useSyncExternalStore } from "react";
import { setVoiceActive } from "./voice-activity";

export const PLAYBACK_RATES = [1, 1.5, 2] as const;

export interface VoicePlayerState {
  id: string | null;
  playing: boolean;
  position: number;
  rate: number;
}

const IDLE: VoicePlayerState = { id: null, playing: false, position: 0, rate: 1 };

let state = IDLE;
let audio: HTMLAudioElement | null = null;
let frame = 0;
const listeners = new Set<() => void>();

function update(next: Partial<VoicePlayerState>) {
  state = { ...state, ...next };
  setVoiceActive("playback", state.playing);
  listeners.forEach((listener) => listener());
}

function element(): HTMLAudioElement {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = "auto";
  audio.addEventListener("play", () => {
    update({ playing: true });
    tick();
  });
  audio.addEventListener("pause", () => {
    cancelAnimationFrame(frame);
    update({ playing: false, position: audio?.currentTime ?? 0 });
  });
  audio.addEventListener("timeupdate", () => {
    if (audio && !audio.paused) update({ position: audio.currentTime });
  });
  audio.addEventListener("ended", () => {
    cancelAnimationFrame(frame);
    update({ playing: false, position: 0 });
  });
  return audio;
}

function tick() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    if (!audio || audio.paused) return;
    update({ position: audio.currentTime });
    tick();
  });
}

function load(id: string, url: string): HTMLAudioElement {
  const player = element();
  if (state.id !== id) {
    player.pause();
    player.src = url;
    update({ id, position: 0, playing: false });
  }
  player.playbackRate = state.rate;
  return player;
}

export const voicePlayer = {
  toggle(id: string, url: string) {
    const player = load(id, url);
    if (player.paused) void player.play().catch(() => update({ playing: false }));
    else player.pause();
  },
  seek(id: string, url: string, seconds: number) {
    const player = load(id, url);
    player.currentTime = seconds;
    update({ position: seconds });
    if (player.paused) void player.play().catch(() => update({ playing: false }));
  },
  cycleRate() {
    const index = PLAYBACK_RATES.indexOf(state.rate as (typeof PLAYBACK_RATES)[number]);
    const rate = PLAYBACK_RATES[(index + 1) % PLAYBACK_RATES.length];
    if (audio) audio.playbackRate = rate;
    update({ rate });
  },
  stop() {
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    cancelAnimationFrame(frame);
    update({ ...IDLE, rate: state.rate });
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useVoicePlayer(): VoicePlayerState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => IDLE,
  );
}
