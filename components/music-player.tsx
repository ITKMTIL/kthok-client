"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { MusicControls, MusicState } from "@/lib/use-chat";

const SYNC_INTERVAL_MS = 500;
const MAX_DRIFT_SEC = 2;
const BLOCKED_AFTER_TICKS = 4;

const ENDED = 0;
const PLAYING = 1;
const BUFFERING = 3;

interface VideoRequest {
  videoId: string;
  startSeconds: number;
}

interface YTPlayer {
  loadVideoById(request: VideoRequest): void;
  cueVideoById(request: VideoRequest): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getPlayerState(): number;
  mute(): void;
  unMute(): void;
  destroy(): void;
}

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      width: string;
      height: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: () => void;
        onStateChange: (event: { data: number }) => void;
        onError: () => void;
      };
    },
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  return (apiPromise ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT!);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.append(script);
  }));
}

function expectedPosition(music: MusicState): number {
  return music.playing
    ? music.positionSec + (performance.now() - music.receivedAt) / 1000
    : music.positionSec;
}

export function MusicPlayer({
  music,
  controls,
  disabled,
}: {
  music: MusicState | null;
  controls: MusicControls;
  disabled: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const loadedTrackRef = useRef<string | null>(null);
  const stalledTicksRef = useRef(0);
  const musicRef = useRef(music);
  const controlsRef = useRef(controls);

  const [blocked, setBlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const current = music?.current ?? null;
  const queue = music?.queue ?? [];

  useEffect(() => {
    musicRef.current = music;
    controlsRef.current = controls;
  }, [music, controls]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let player: YTPlayer | null = null;

    const skipCurrent = () => {
      const track = musicRef.current?.current;
      if (track) controlsRef.current.skip(track.id);
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
      const active = playerState === PLAYING || playerState === BUFFERING;

      if (!state.playing) {
        if (active) ready.pauseVideo();
        stalledTicksRef.current = 0;
        setBlocked(false);
        return;
      }
      if (playerState === ENDED) {
        skipCurrent();
        return;
      }
      if (active) {
        stalledTicksRef.current = 0;
        setBlocked(false);
        const drift = ready.getCurrentTime() - request.startSeconds;
        if (playerState === PLAYING && Math.abs(drift) > MAX_DRIFT_SEC) {
          ready.seekTo(request.startSeconds, true);
        }
        return;
      }

      ready.playVideo();
      stalledTicksRef.current += 1;
      if (stalledTicksRef.current >= BLOCKED_AFTER_TICKS) setBlocked(true);
    };

    loadYouTubeApi().then((YT) => {
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
            if (event.data === ENDED) skipCurrent();
          },
          onError: () => {
            const track = musicRef.current?.current;
            if (!track) return;
            setNotice(`เล่น "${track.title}" ไม่ได้ เลยข้ามให้แล้ว`);
            skipCurrent();
          },
        },
      });
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

  function toggleMute() {
    const player = playerRef.current;
    if (!player) return;
    if (muted) player.unMute();
    else player.mute();
    setMuted(!muted);
  }

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    const value = url.trim();
    if (!value || adding) return;
    setAdding(true);
    setAddError(null);
    setNotice(null);
    const error = await controls.add(value);
    setAdding(false);
    setAddError(error);
    if (!error) setUrl("");
  }

  return (
    <aside
      className="doodle-card order-first flex shrink-0 flex-col gap-3 p-3 lg:order-last lg:w-80 lg:overflow-y-auto"
      aria-label="เพลงในห้อง"
    >
      <div className="flex gap-3 lg:flex-col">
        <div className="relative size-[200px] shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-ink lg:h-[200px] lg:w-full">
          <div
            ref={hostRef}
            className={`size-full [&>iframe]:size-full ${current ? "" : "invisible"}`}
          />
          {!current && (
            <p className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-paper">
              ยังไม่มีเพลง วางลิงก์ YouTube เพื่อเปิดฟังด้วยกัน
            </p>
          )}
          {current && blocked && (
            <button
              type="button"
              className="absolute inset-0 grid cursor-pointer place-items-center bg-ink/85 p-4 text-center font-bold text-paper"
              onClick={() => playerRef.current?.playVideo()}
            >
              🔊 กดเพื่อฟังด้วย
            </button>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="min-w-0">
            <p className="text-sm text-ink-soft">
              {current ? (music?.playing ? "กำลังเล่น" : "หยุดอยู่") : "เพลงในห้อง"}
            </p>
            <p className="line-clamp-2 font-bold" title={current?.title}>
              {current?.title ?? "—"}
            </p>
            {current && (
              <p className="truncate text-sm text-ink-soft">
                เพิ่มโดย {current.addedBy}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="doodle-btn doodle-btn-primary px-3 py-1 font-bold"
              disabled={!current || disabled}
              onClick={() => (music?.playing ? controls.pause() : controls.play())}
            >
              {music?.playing ? "⏸ หยุด" : "▶ เล่น"}
            </button>
            <button
              type="button"
              className="doodle-btn px-3 py-1"
              disabled={!current || disabled}
              onClick={() => current && controls.skip(current.id)}
            >
              ⏭ ข้าม
            </button>
            <button
              type="button"
              className="doodle-btn px-3 py-1"
              onClick={toggleMute}
              aria-pressed={muted}
              aria-label={muted ? "เปิดเสียงฝั่งเรา" : "ปิดเสียงฝั่งเรา"}
              title={muted ? "เปิดเสียงฝั่งเรา" : "ปิดเสียงฝั่งเรา"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
          {notice && (
            <p className="text-sm text-ink-soft" role="status">
              {notice}
            </p>
          )}
        </div>
      </div>

      <form className="flex gap-2" onSubmit={handleAdd}>
        <input
          className="doodle-field min-w-0 flex-1 py-1.5 text-sm"
          type="url"
          inputMode="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="วางลิงก์ YouTube"
          aria-label="ลิงก์ YouTube"
          maxLength={200}
          disabled={disabled}
          autoComplete="off"
        />
        <button
          type="submit"
          className="doodle-btn px-3 text-sm font-bold"
          disabled={disabled || adding || !url.trim()}
        >
          {adding ? "…" : "เพิ่มคิว"}
        </button>
      </form>
      {addError && (
        <p className="-mt-1 text-sm font-medium text-danger" role="alert">
          {addError}
        </p>
      )}

      <details className="min-h-0" open>
        <summary className="cursor-pointer text-sm font-bold">
          คิวถัดไป ({queue.length})
        </summary>
        {queue.length === 0 ? (
          <p className="mt-1 text-sm text-ink-soft">ยังไม่มีเพลงในคิว</p>
        ) : (
          <ol className="mt-1 flex max-h-32 flex-col gap-1 overflow-y-auto lg:max-h-none">
            {queue.map((track, index) => (
              <li key={track.id} className="flex items-center gap-2 text-sm">
                <span className="w-5 shrink-0 text-right text-ink-soft">
                  {index + 1}.
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate" title={track.title}>
                    {track.title}
                  </span>
                  <span className="block truncate text-xs text-ink-soft">
                    {track.addedBy}
                  </span>
                </span>
                <button
                  type="button"
                  className="doodle-btn shrink-0 px-2 text-xs"
                  disabled={disabled}
                  onClick={() => controls.remove(track.id)}
                  aria-label={`ลบ ${track.title} ออกจากคิว`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
        )}
      </details>
    </aside>
  );
}
