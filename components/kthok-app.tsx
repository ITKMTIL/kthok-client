"use client";

import { useProfile } from "@/lib/profile";
import { useChat } from "@/lib/use-chat";
import { ChatRoom } from "./chat-room";
import { Lobby } from "./lobby";
import { Searching } from "./searching";

export function KThokApp() {
  const profile = useProfile();
  const { state, find, leave, send, setTyping } = useChat();

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <span className="text-2xl font-bold tracking-wide">
          K<span className="text-accent">-</span>THOK
        </span>
        <span className="text-sm text-ink-soft">
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
      {(state.phase === "chatting" || state.phase === "ended") && (
        <ChatRoom
          key={state.roomId}
          state={state}
          onSend={send}
          onTyping={setTyping}
          onNext={() => profile && find(profile, state.prefers)}
          onLeave={leave}
        />
      )}
    </div>
  );
}
