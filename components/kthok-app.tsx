"use client";

import { useProfile } from "@/lib/profile";
import { useChat } from "@/lib/use-chat";
import { ChatRoom } from "./chat-room";
import { Lobby } from "./lobby";
import { Searching } from "./searching";

export function KThokApp() {
  const profile = useProfile();
  const { state, find, leave, send, setTyping, music } = useChat();

  const inRoom = state.phase === "chatting" || state.phase === "ended";
  const selfName = profile?.nickname.trim();

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <span className="shrink-0 text-2xl font-bold tracking-wide">
          K<span className="text-accent">-</span>THOK
        </span>
        {inRoom && selfName && (
          <span className="min-w-0 flex-1 truncate px-3 text-center text-sm">
            <span className="text-ink-soft">เธอคือ </span>
            <span className="font-bold">{selfName}</span>
          </span>
        )}
        <span className="shrink-0 text-sm text-ink-soft">
          <span
            className={`mr-1.5 inline-block size-2.5 rounded-full border-2 border-ink ${state.connected ? "bg-online" : "bg-paper"}`}
            aria-hidden
          />
          {state.connected ? "ออนไลน์" : "ออฟไลน์"}
        </span>
      </header>

      {state.phase === "idle" && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Lobby
            profile={profile}
            connected={state.connected}
            online={state.online}
            error={state.error}
            onFind={find}
          />
        </div>
      )}
      {state.phase === "searching" && (
        <Searching
          prefers={state.prefers}
          fellBack={state.fellBack}
          onCancel={leave}
        />
      )}
      {inRoom && (
        <ChatRoom
          key={state.roomId}
          state={state}
          onSend={send}
          onTyping={setTyping}
          music={music}
          onNext={() =>
            profile &&
            selfName &&
            find({ ...profile, nickname: selfName }, state.prefers)
          }
          onLeave={leave}
        />
      )}
    </div>
  );
}
