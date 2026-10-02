"use client";

import { Volume2 } from "lucide-react";
import { useYouTubePlayer } from "@/hooks/use-youtube-player";
import type { MusicControls, MusicState } from "@/types/chat";
import { AddTrackForm } from "./add-track-form";
import { MusicMiniBar } from "./music-mini-bar";
import { PlayerControls } from "./player-controls";
import { TrackQueue } from "./track-queue";

export function MusicPlayer({
  music,
  controls,
  disabled,
  collapsed,
  onCollapsedChange,
}: {
  music: MusicState | null;
  controls: MusicControls;
  disabled: boolean;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}) {
  const { hostRef, blocked, muted, notice, toggleMute, resume, clearNotice } =
    useYouTubePlayer(music, controls.skip);
  const current = music?.current ?? null;
  const playing = music?.playing ?? false;
  const togglePlayback = () => (playing ? controls.pause() : controls.play());

  return (
    <aside
      className="doodle-card order-first flex shrink-0 flex-col px-3 py-2 lg:order-last lg:w-80 lg:overflow-y-auto lg:p-3"
      aria-label="เพลงในห้อง"
    >
      <MusicMiniBar
        title={current?.title ?? null}
        playing={playing}
        blocked={blocked}
        collapsed={collapsed}
        queueLength={music?.queue.length ?? 0}
        controlsDisabled={disabled}
        onToggle={togglePlayback}
        onResume={resume}
        onCollapsedChange={onCollapsedChange}
      />
      <div
        id="music-panel"
        className={`flex flex-col gap-3 ${collapsed ? "max-lg:invisible max-lg:h-0 max-lg:overflow-hidden" : "max-lg:mt-2"}`}
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
                className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 bg-ink/85 p-4 text-center font-bold text-paper"
                onClick={resume}
              >
                <Volume2 className="size-7" aria-hidden />
                กดเพื่อฟังด้วย
              </button>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="min-w-0">
              <p className="text-sm text-ink-soft">
                {current ? (playing ? "กำลังเล่น" : "หยุดอยู่") : "เพลงในห้อง"}
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
            <PlayerControls
              playing={playing}
              muted={muted}
              disabled={!current || disabled}
              onToggle={togglePlayback}
              onSkip={() => current && controls.skip(current.id)}
              onToggleMute={toggleMute}
            />
            {notice && (
              <p className="text-sm text-ink-soft" role="status">
                {notice}
              </p>
            )}
          </div>
        </div>

        <AddTrackForm
          disabled={disabled}
          onAdd={(url) => {
            clearNotice();
            return controls.add(url);
          }}
        />
        <TrackQueue queue={music?.queue ?? []} disabled={disabled} onRemove={controls.remove} />
      </div>
    </aside>
  );
}
