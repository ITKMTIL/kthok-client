import { MusicPlayer } from "@/components/music/music-player";
import type { ChatState, MusicControls } from "@/types/chat";
import { ChatHeader } from "./chat-header";
import { MatchNotice } from "./match-notice";
import { MessageForm } from "./message-form";
import { MessageList } from "./message-list";

export function ChatRoom({
  state,
  music,
  onSend,
  onTyping,
  onNext,
  onLeave,
}: {
  state: ChatState;
  music: MusicControls;
  onSend: (text: string) => Promise<string | null>;
  onTyping: (typing: boolean) => void;
  onNext: () => void;
  onLeave: () => void;
}) {
  const ended = state.phase === "ended";

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-3 px-3 pb-3 lg:flex-row">
      <MusicPlayer music={state.music} controls={music} disabled={ended} />
      <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
        <ChatHeader
          partner={state.partner}
          onNext={onNext}
          onLeave={onLeave}
        />
        <MatchNotice
          prefers={state.prefers}
          preferenceMet={state.preferenceMet}
        />
        <MessageList
          messages={state.messages}
          partnerName={state.partner?.nickname ?? ""}
          partnerTyping={state.partnerTyping}
          ended={ended}
          onNext={onNext}
        />
        <MessageForm disabled={ended} onSend={onSend} onTyping={onTyping} />
      </section>
    </main>
  );
}
