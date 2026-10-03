"use client";

import { CallBar } from "@/components/call/call-bar";
import { ReportDialog } from "@/components/followup/report-dialog";
import { GamePanel } from "@/components/games/game-panel";
import { MusicPlayer } from "@/components/music/music-player";
import type { ShareParty } from "@/components/share/share-card";
import { ShareDialog } from "@/components/share/share-dialog";
import { ShareToolbar } from "@/components/share/share-toolbar";
import type { Reaction } from "@/constants/reactions";
import { useMessageSelection } from "@/hooks/use-message-selection";
import { useMusicCollapsed } from "@/hooks/use-music-collapsed";
import { useVoiceCall } from "@/hooks/use-voice-call";
import type {
  ChatMessage,
  ChatState,
  Outgoing,
  GameControls,
  MusicControls,
  RecordedVoice,
  ReportInput,
} from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/hooks/use-locale";
import { useReadReceipts } from "@/hooks/use-read-receipts";
import type { Socket } from "socket.io-client";
import { ChatHeader } from "./chat-header";
import { ConnectionNotice } from "./connection-notice";
import { MatchNotice } from "./match-notice";
import { MessageForm } from "./message-form";
import { MessageList } from "./message-list";

export function ChatRoom({
  state,
  socket,
  soundMuted,
  self,
  music,
  games,
  onSend,
  onUnsend,
  onMarkRead,
  onSendVoice,
  onPrompt,
  onKeep,
  onReport,
  onReact,
  onBlock,
  onFeedback,
  onTyping,
  onNext,
  onLeave,
  onPanic,
}: {
  state: ChatState;
  socket: Socket | null;
  soundMuted: boolean;
  self: ShareParty;
  music: MusicControls;
  games: GameControls;
  onSend: (content: Outgoing, replyTo?: string) => Promise<string | null>;
  onUnsend: (messageId: string) => Promise<string | null>;
  onMarkRead: (messageId: string) => void;
  onSendVoice: (voice: RecordedVoice) => Promise<string | null>;
  onPrompt: () => Promise<string | null>;
  onKeep: (contact: string) => Promise<string | null>;
  onReport: (input: ReportInput) => Promise<string | null>;
  onReact: (messageId: string, reaction: Reaction | null) => void;
  onBlock: (() => void) | null;
  onFeedback: (rating: "up" | "down") => void;
  onTyping: (typing: boolean) => void;
  onNext: () => void;
  onLeave: () => void;
  onPanic: () => void;
}) {
  const t = useT();
  const ended = state.phase === "ended";
  const [musicCollapsed, setMusicCollapsed] = useMusicCollapsed();
  const selection = useMessageSelection();
  const voice = useVoiceCall(socket, { enabled: !ended, soundMuted });
  const partnerName = state.partner?.nickname ?? t.common.partner;
  const [sharing, setSharing] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null);
  const [receipts, setReceipts] = useReadReceipts();
  const lastReadRef = useRef<string | null>(null);
  const latestTheirs = [...state.messages]
    .reverse()
    .find((message) => !message.mine && !message.prompt)?.id;

  useEffect(() => {
    if (!receipts || ended || !latestTheirs) return;
    const mark = () => {
      if (document.hidden || lastReadRef.current === latestTheirs) return;
      lastReadRef.current = latestTheirs;
      onMarkRead(latestTheirs);
    };
    mark();
    document.addEventListener("visibilitychange", mark);
    return () => document.removeEventListener("visibilitychange", mark);
  }, [receipts, ended, latestTheirs, onMarkRead]);
  const openReport = state.reportEnabled ? () => setReporting(true) : null;
  const sharedMessages = state.messages.filter(
    (message) => !message.unsent && selection.selected?.has(message.id),
  );

  return (
    <main className="relative mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-2 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:gap-3 sm:px-3 sm:pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:flex-row">
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
          canShare={state.messages.length > 0 && !selection.selecting}
          onShare={selection.start}
          onStartGame={ended ? null : games.start}
          onReport={openReport}
          readReceipts={receipts}
          onToggleReadReceipts={() => setReceipts(!receipts)}
          onBlock={ended ? null : onBlock}
          canCall={
            !ended &&
            state.connected &&
            !state.partnerAway &&
            voice.call.status === "idle"
          }
          onCall={state.callEnabled ? voice.invite : null}
          onNext={onNext}
          onLeave={onLeave}
          onPanic={ended ? null : onPanic}
          music={{
            open: !musicCollapsed,
            playing: state.music?.playing ?? false,
            onToggle: () => setMusicCollapsed(!musicCollapsed),
          }}
        />
        <CallBar
          call={voice.call}
          partnerName={partnerName}
          onAccept={voice.accept}
          onDecline={voice.decline}
          onHangUp={voice.hangUp}
          onToggleMute={voice.toggleMute}
          onDismissNotice={voice.dismissNotice}
        />
        <MatchNotice
          prefers={state.prefers}
          preferenceMet={state.preferenceMet}
        />
        {!ended && (
          <ConnectionNotice
            connected={state.connected}
            partnerAway={state.partnerAway}
            partnerName={partnerName}
          />
        )}
        {state.game && !ended && (
          <GamePanel game={state.game} partnerName={partnerName} controls={games} />
        )}
        <MessageList
          messages={state.messages}
          partnerName={state.partner?.nickname ?? ""}
          partnerTyping={state.partnerTyping}
          ended={ended}
          endedBy={state.endedBy}
          selected={selection.selected}
          onToggleSelected={selection.toggle}
          onReact={onReact}
          onFeedback={onFeedback}
          keep={state.keep}
          onKeep={onKeep}
          onReport={openReport}
          readUpTo={receipts ? state.readUpTo : null}
          onReply={setReplyTarget}
          onUnsend={(messageId) => void onUnsend(messageId)}
          onNext={onNext}
        />
        {selection.selecting ? (
          <ShareToolbar
            count={sharedMessages.length}
            onCancel={selection.cancel}
            onCreate={() => setSharing(true)}
          />
        ) : (
          <MessageForm
            disabled={ended}
            onSend={async (content) => {
              const failure = await onSend(content, replyTarget?.id);
              if (!failure) setReplyTarget(null);
              return failure;
            }}
            replyTarget={ended ? null : replyTarget}
            onCancelReply={() => setReplyTarget(null)}
            onSendVoice={
              state.voiceEnabled && voice.call.status === "idle"
                ? onSendVoice
                : null
            }
            onPrompt={onPrompt}
            onTyping={onTyping}
            onFocus={() => setMusicCollapsed(true)}
          />
        )}
      </section>
      {reporting && (
        <ReportDialog
          messages={state.messages}
          partnerName={partnerName}
          onSubmit={onReport}
          onClose={() => setReporting(false)}
        />
      )}
      {sharing && state.partner && (
        <ShareDialog
          messages={sharedMessages}
          self={self}
          partner={{
            name: state.partner.nickname,
            faculty: state.partner.faculty,
          }}
          onClose={() => {
            setSharing(false);
            selection.cancel();
          }}
        />
      )}
    </main>
  );
}
