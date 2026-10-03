import { useSyncExternalStore } from "react";

const active = new Set<string>();
const listeners = new Set<() => void>();

export function setVoiceActive(source: string, on: boolean) {
  const changed = on ? !active.has(source) : active.has(source);
  if (!changed) return;
  if (on) active.add(source);
  else active.delete(source);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useVoiceActive(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => active.size > 0,
    () => false,
  );
}
