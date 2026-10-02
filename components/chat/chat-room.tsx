"use client";

import { MusicPlayer } from "@/components/music/music-player";
import type { Reaction } from "@/constants/reactions";
import { useMusicCollapsed } from "@/hooks/use-music-collapsed";
import type { ChatState, MusicControls } from "@/types/chat";
import { ChatHeader } from "./chat-header";
import { ConnectionNotice } from "./connection-notice";
import { MatchNotice } from "./match-notice";
import { MessageForm } from "./message-form";
import { MessageList } from "./message-list";

export function ChatRoom({
  state,
  music,
  onSend,
  onReact,
  onTyping,
  onNext,
  onLeave,
}: {
  state: ChatState;
  music: MusicControls;
  onSend: (text: string) => Promise<string | null>;
  onReact: (messageId: string, reaction: Reaction | null) => void;
  onTyping: (typing: boolean) => void;
  onNext: () => void;
  onLeave: () => void;
}) {
  const ended = state.phase === "ended";
  const [musicCollapsed, setMusicCollapsed] = useMusicCollapsed();

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-2 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:gap-3 sm:px-3 sm:pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:flex-row">
      <MusicPlayer
        music={state.music}
        controls={music}
        disabled={ended}
        collapsed={musicCollapsed}
        onCollapsedChange={setMusicCollapsed}
      />
      <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 sm:gap-3">
        <ChatHeader
          partner={state.partner}
          onNext={onNext}
          onLeave={onLeave}
        />
        <MatchNotice
          prefers={state.prefers}
          preferenceMet={state.preferenceMet}
        />
        {!ended && (
          <ConnectionNotice
            connected={state.connected}
            partnerAway={state.partnerAway}
            partnerName={state.partner?.nickname ?? "อีกฝ่าย"}
          />
        )}
        <MessageList
          messages={state.messages}
          partnerName={state.partner?.nickname ?? ""}
          partnerTyping={state.partnerTyping}
          ended={ended}
          onReact={onReact}
          onNext={onNext}
        />
        <MessageForm
          disabled={ended}
          onSend={onSend}
          onTyping={onTyping}
          onFocus={() => setMusicCollapsed(true)}
        />
      </section>
    </main>
  );
}
