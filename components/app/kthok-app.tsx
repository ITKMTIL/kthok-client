"use client";

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
import type { FacultyId } from "@/constants/faculties";
import { useChat } from "@/hooks/use-chat";
import { useNotifications } from "@/hooks/use-notifications";
import { useSoundMuted } from "@/hooks/use-sound-muted";
import { useVisualViewportHeight } from "@/hooks/use-visual-viewport";
import { saveProfile, useProfile } from "@/hooks/use-profile";
import { clearSession, useSessionToken } from "@/hooks/use-session";
import { AUTH_REQUIRED } from "@/lib/config";
import { unlockAudio } from "@/lib/sounds";
import type { Profile } from "@/types/auth";
import { AppHeader } from "./app-header";

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
    send,
    react,
    block,
    sendFeedback,
    setTyping,
    music,
  } = useChat({
    token: token ?? null,
    enabled: !AUTH_REQUIRED || Boolean(token),
    onAuthError: handleAuthError,
    onBanned: handleBanned,
  });

  const [soundMuted, setSoundMuted] = useSoundMuted();
  useNotifications(state, soundMuted);

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

  const startSearch = (prefers: FacultyId | null) => {
    unlockAudio();
    if (profile && nickname) find({ ...profile, nickname }, prefers);
  };

  const signOut = () => {
    setLoginNotice(null);
    clearSession();
  };

  return (
    <div className="app-shell flex flex-col">
      <AppHeader
        connected={state.connected}
        selfName={inRoom && nickname ? nickname : null}
        soundMuted={soundMuted}
        onToggleSound={() => {
          unlockAudio();
          setSoundMuted(!soundMuted);
        }}
        onSignOut={token && state.phase === "idle" ? signOut : null}
      />

      {needsLogin ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <LoginScreen notice={loginNotice} />
        </div>
      ) : (
        <>
          {state.phase === "idle" && (
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <Lobby
                profile={profile}
                facultyLocked={AUTH_REQUIRED}
                connected={state.connected}
                online={state.online}
                error={state.error ?? (AUTH_REQUIRED ? null : loginNotice)}
                onProfileChange={(next) =>
                  saveProfile({
                    nickname: next.nickname,
                    faculty: next.faculty ?? undefined,
                  })
                }
                onFind={startSearch}
              />
            </div>
          )}
          {state.phase === "searching" && (
            <Searching
              prefers={state.prefers}
              fellBack={state.fellBack}
              connected={state.connected}
              onCancel={leave}
            />
          )}
          {inRoom && (
            <ChatRoom
              key={state.roomId}
              state={state}
              socket={socket}
              soundMuted={soundMuted}
              self={{ name: nickname, faculty: profile?.faculty ?? null }}
              music={music}
              onSend={send}
              onReact={react}
              onBlock={state.blockEnabled ? block : null}
              onFeedback={sendFeedback}
              onTyping={setTyping}
              onNext={() => startSearch(state.prefers)}
              onLeave={leave}
            />
          )}
        </>
      )}
    </div>
  );
}
