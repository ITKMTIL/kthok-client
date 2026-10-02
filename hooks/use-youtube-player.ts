import { useEffect, useRef, useState } from "react";
import { loadYouTubeApi, PlayerState, type YTPlayer } from "@/lib/youtube-api";
import type { MusicState } from "@/types/chat";

const SYNC_INTERVAL_MS = 500;
const MAX_DRIFT_SEC = 2;
const BLOCKED_AFTER_TICKS = 4;

function expectedPosition(music: MusicState): number {
  return music.playing
    ? music.positionSec + (performance.now() - music.receivedAt) / 1000
    : music.positionSec;
}

export function useYouTubePlayer(
  music: MusicState | null,
  onSkip: (trackId: string) => void,
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const loadedTrackRef = useRef<string | null>(null);
  const stalledTicksRef = useRef(0);
  const musicRef = useRef(music);
  const onSkipRef = useRef(onSkip);

  const [blocked, setBlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    musicRef.current = music;
    onSkipRef.current = onSkip;
  }, [music, onSkip]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let player: YTPlayer | null = null;

    const skipCurrent = () => {
      const track = musicRef.current?.current;
      if (track) onSkipRef.current(track.id);
    };

    const sync = () => {
      const ready = playerRef.current;
      if (!ready) return;
      const state = musicRef.current;
      const track = state?.current ?? null;

      if (!state || !track) {
        if (loadedTrackRef.current) {
          ready.stopVideo();
          loadedTrackRef.current = null;
        }
        stalledTicksRef.current = 0;
        setBlocked(false);
        return;
      }

      const request = {
        videoId: track.videoId,
        startSeconds: expectedPosition(state),
      };

      if (loadedTrackRef.current !== track.id) {
        loadedTrackRef.current = track.id;
        stalledTicksRef.current = 0;
        if (state.playing) ready.loadVideoById(request);
        else ready.cueVideoById(request);
        return;
      }

      const playerState = ready.getPlayerState();
      const active =
        playerState === PlayerState.PLAYING ||
        playerState === PlayerState.BUFFERING;

      if (!state.playing) {
        if (active) ready.pauseVideo();
        stalledTicksRef.current = 0;
        setBlocked(false);
        return;
      }
      if (playerState === PlayerState.ENDED) {
        skipCurrent();
        return;
      }
      if (active) {
        stalledTicksRef.current = 0;
        setBlocked(false);
        const drift = ready.getCurrentTime() - request.startSeconds;
        if (
          playerState === PlayerState.PLAYING &&
          Math.abs(drift) > MAX_DRIFT_SEC
        ) {
          ready.seekTo(request.startSeconds, true);
        }
        return;
      }

      ready.playVideo();
      stalledTicksRef.current += 1;
      if (stalledTicksRef.current >= BLOCKED_AFTER_TICKS) setBlocked(true);
    };

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return;
        const mount = document.createElement("div");
        host.append(mount);
        player = new YT.Player(mount, {
          width: "100%",
          height: "100%",
          playerVars: {
            controls: 0,
            disablekb: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (!cancelled) playerRef.current = player;
            },
            onStateChange: (event) => {
              if (event.data === PlayerState.ENDED) skipCurrent();
            },
            onError: () => {
              const track = musicRef.current?.current;
              if (!track) return;
              setNotice(`เล่น "${track.title}" ไม่ได้ เลยข้ามให้แล้ว`);
              skipCurrent();
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setNotice("โหลดตัวเล่น YouTube ไม่สำเร็จ ลองรีเฟรชหน้านี้นะ");
      });

    const timer = setInterval(sync, SYNC_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
      playerRef.current = null;
      loadedTrackRef.current = null;
      player?.destroy();
      host.replaceChildren();
    };
  }, []);

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;
    if (muted) player.unMute();
    else player.mute();
    setMuted(!muted);
  };

  const resume = () => playerRef.current?.playVideo();
  const clearNotice = () => setNotice(null);

  return { hostRef, blocked, muted, notice, toggleMute, resume, clearNotice };
}
