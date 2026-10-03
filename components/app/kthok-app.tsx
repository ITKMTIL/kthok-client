"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useCallback, useState } from "react";
import { LoginScreen } from "@/components/auth/login-screen";
import { ChatRoom } from "@/components/chat/chat-room";
import { Searching } from "@/components/chat/searching";
import { Lobby } from "@/components/lobby/lobby";
import {
  BANNED_MESSAGE,
  LOGIN_NOT_CONFIGURED_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
} from "@/constants/messages";
import type { SearchOptions } from "@/types/chat";
import { useChat } from "@/hooks/use-chat";
import { useNotifications } from "@/hooks/use-notifications";
import { usePush } from "@/hooks/use-push";
import { useRulesAccepted } from "@/hooks/use-rules-accepted";
import { RulesDialog } from "@/components/safety/rules-dialog";
import { useSoundMuted } from "@/hooks/use-sound-muted";
import { useVisualViewportHeight } from "@/hooks/use-visual-viewport";
import { saveProfile, useProfile } from "@/hooks/use-profile";
import { clearSession, useSessionToken } from "@/hooks/use-session";
import { AUTH_REQUIRED } from "@/lib/config";
import { unlockAudio } from "@/lib/sounds";
import type { Profile } from "@/types/auth";
import { Screen } from "@/components/ui/screen";
import { Splash } from "@/components/ui/splash";
import { AppHeader } from "./app-header";

const FIXED_SCREEN = "flex min-h-0 flex-1 flex-col";
const SCROLL_SCREEN = `${FIXED_SCREEN} overflow-y-auto`;

export function KThokApp() {
  useVisualViewportHeight();
  const stored = useProfile();
  const token = useSessionToken();
  const [loginNotice, setLoginNotice] = useState<string | null>(null);

  const handleAuthError = useCallback(() => {
    setLoginNotice(
      AUTH_REQUIRED ? SESSION_EXPIRED_MESSAGE : LOGIN_NOT_CONFIGURED_MESSAGE,
    );
    clearSession();
  }, []);

  const handleBanned = useCallback(() => {
    setLoginNotice(BANNED_MESSAGE);
    clearSession();
  }, []);

  const {
    state,
    socket,
    find,
    leave,
    exit,
    panic,
    send,
    unsend,
    markRead,
    sendVoice,
    askPrompt,
    keepTalking,
    report,
    react,
    block,
    sendFeedback,
    setTyping,
    music,
    games,
  } = useChat({
    token: token ?? null,
    enabled: !AUTH_REQUIRED || Boolean(token),
    onAuthError: handleAuthError,
    onBanned: handleBanned,
  });

  const [soundMuted, setSoundMuted] = useSoundMuted();
  useNotifications(state, soundMuted);
  const push = usePush(socket, state.pushKey);

  const profile: Profile | undefined =
    stored && (!AUTH_REQUIRED || token)
      ? {
          nickname: stored.nickname,
          faculty: AUTH_REQUIRED ? state.selfFaculty : (stored.faculty ?? null),
        }
      : undefined;
  const nickname = profile?.nickname.trim() ?? "";
  const inRoom = state.phase === "chatting" || state.phase === "ended";
  const needsLogin = AUTH_REQUIRED && token === null;
  const sessionLoading = AUTH_REQUIRED && token === undefined;

  const [rulesAccepted, acceptRules] = useRulesAccepted();
  const [pendingSearch, setPendingSearch] = useState<SearchOptions | null>(
    null,
  );

  const startSearch = (options: SearchOptions) => {
    unlockAudio();
    if (!rulesAccepted) return setPendingSearch(options);
    if (profile && nickname) find({ ...profile, nickname }, options);
  };

  const signOut = () => {
    if (push.status === "on") void push.disable();
    setLoginNotice(null);
    clearSession();
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="app-shell relative flex flex-col overflow-hidden">
      <Splash />
      {pendingSearch && (
        <RulesDialog
          onAccept={() => {
            acceptRules();
            if (profile && nickname) find({ ...profile, nickname }, pendingSearch);
            setPendingSearch(null);
          }}
          onClose={() => setPendingSearch(null)}
        />
      )}
      <AppHeader
        connected={state.connected}
        selfName={inRoom && nickname ? nickname : null}
        soundMuted={soundMuted}
        showAdminLink={state.isAdmin && state.phase === "idle"}
        onToggleSound={() => {
          unlockAudio();
          setSoundMuted(!soundMuted);
        }}
        onSignOut={token && state.phase === "idle" ? signOut : null}
      />

      <AnimatePresence mode="popLayout" initial={false}>
        {sessionLoading ? (
          <Screen key="loading" className={FIXED_SCREEN}>
            {null}
          </Screen>
        ) : needsLogin ? (
          <Screen key="login" className={SCROLL_SCREEN}>
            <LoginScreen notice={loginNotice} />
          </Screen>
        ) : state.phase === "idle" ? (
          <Screen key="lobby" className={SCROLL_SCREEN}>
            <Lobby
              profile={profile}
              facultyLocked={AUTH_REQUIRED}
              connected={state.connected}
              online={state.online}
              waiting={state.waiting}
              push={push}
              error={state.error ?? (AUTH_REQUIRED ? null : loginNotice)}
              onProfileChange={(next) =>
                saveProfile({
                  nickname: next.nickname,
                  faculty: next.faculty ?? undefined,
                })
              }
              onFind={startSearch}
            />
          </Screen>
        ) : state.phase === "searching" ? (
          <Screen key="searching" className={FIXED_SCREEN}>
            <Searching
              prefers={state.prefers}
              topic={state.topic}
              fellBack={state.fellBack}
              connected={state.connected}
              onCancel={leave}
            />
          </Screen>
        ) : (
          <Screen key={`room-${state.roomId}`} className={FIXED_SCREEN}>
            <ChatRoom
              state={state}
              socket={socket}
              soundMuted={soundMuted}
              self={{ name: nickname, faculty: profile?.faculty ?? null }}
              music={music}
              games={games}
              onSend={send}
              onUnsend={unsend}
              onMarkRead={markRead}
              onSendVoice={sendVoice}
              onPrompt={askPrompt}
              onKeep={keepTalking}
              onReport={report}
              onReact={react}
              onBlock={state.blockEnabled ? block : null}
              onFeedback={sendFeedback}
              onTyping={setTyping}
              onNext={() =>
                startSearch({ prefers: state.prefers, topic: state.topic })
              }
              onLeave={state.phase === "ended" ? () => exit() : leave}
              onPanic={panic}
            />
          </Screen>
        )}
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}
