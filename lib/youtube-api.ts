import { loadScript } from "./load-script";

export const PlayerState = {
  ENDED: 0,
  PLAYING: 1,
  BUFFERING: 3,
} as const;

export interface VideoRequest {
  videoId: string;
  startSeconds: number;
}

export interface YTPlayer {
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

export interface YTNamespace {
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

export function loadYouTubeApi(): Promise<YTNamespace> {
  return (apiPromise ??= new Promise((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT!);
    };
    loadScript("https://www.youtube.com/iframe_api").catch((error) => {
      apiPromise = null;
      reject(error);
    });
  }));
}
