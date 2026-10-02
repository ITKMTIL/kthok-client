import { useEffect, useRef } from "react";
import { playSound, type SoundName } from "@/lib/sounds";
import type { ChatState } from "@/types/chat";

const BASE_TITLE = "K-Thok — คุยกับเพื่อนใหม่ในรั้ว สจล.";

function isAway(): boolean {
  return document.hidden || !document.hasFocus();
}

export function useNotifications(state: ChatState, muted: boolean) {
  const previous = useRef({ phase: state.phase, count: state.messages.length });
  const unread = useRef(0);

  useEffect(() => {
    const before = previous.current;
    const count = state.messages.length;
    previous.current = { phase: state.phase, count };

    const notify = (sound: SoundName, title: string | null) => {
      if (!muted) playSound(sound);
      if (title && isAway()) document.title = title;
    };

    if (before.phase === "searching" && state.phase === "chatting") {
      notify("match", "จับคู่ได้แล้ว! · K-Thok");
      return;
    }
    if (before.phase === "chatting" && state.phase === "ended") {
      if (isAway()) notify("leave", "อีกฝ่ายออกจากห้องแล้ว · K-Thok");
      return;
    }
    if (state.phase !== "chatting" || count <= before.count) return;

    const incoming = state.messages
      .slice(before.count)
      .filter((message) => !message.mine).length;
    if (incoming > 0 && isAway()) {
      unread.current += incoming;
      notify("message", `(${unread.current}) ข้อความใหม่ · K-Thok`);
    }
  }, [state.phase, state.messages, muted]);

  useEffect(() => {
    const reset = () => {
      if (isAway()) return;
      unread.current = 0;
      document.title = BASE_TITLE;
    };
    document.addEventListener("visibilitychange", reset);
    window.addEventListener("focus", reset);
    return () => {
      document.removeEventListener("visibilitychange", reset);
      window.removeEventListener("focus", reset);
    };
  }, []);
}
