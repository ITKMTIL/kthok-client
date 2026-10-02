import { useCallback, useEffect, useRef } from "react";

const TYPING_IDLE_MS = 1500;

export function useTypingSignal(onTyping: (typing: boolean) => void) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    onTyping(false);
  }, [onTyping]);

  const touch = useCallback(() => {
    if (!timer.current) onTyping(true);
    else clearTimeout(timer.current);
    timer.current = setTimeout(stop, TYPING_IDLE_MS);
  }, [onTyping, stop]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { touch, stop };
}
