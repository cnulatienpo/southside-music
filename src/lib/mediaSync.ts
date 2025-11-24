import YouTubePlayer from "youtube-player";
import type { VisualizerEngine } from "../visual/visualizerEngine";
import audioEngine from "../audio/audioEngine";

export type MediaSourceType = "youtube" | "html5";

export interface MediaSyncOptions {
  visualizer?: VisualizerEngine | null;
  tickIntervalMs?: number;
}

export interface MediaStateSnapshot {
  sourceType: MediaSourceType | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number | null;
}

export type MediaEventHandler = (state: MediaStateSnapshot) => void;

const DEFAULT_SNAPSHOT: MediaStateSnapshot = {
  sourceType: null,
  isPlaying: false,
  currentTime: 0,
  duration: null,
};

/**
 * MediaSync manages a single media source (YouTube iframe or HTML5 media element),
 * provides playback controls, and emits periodic state snapshots to listeners.
 * Visualizer can use AudioEngine's analyser node to sync visuals.
 */
export class MediaSync {
  private visualizer?: VisualizerEngine | null;
  private tickIntervalMs: number;
  private currentSourceType: MediaSourceType | null = null;
  private ytPlayer: ReturnType<typeof YouTubePlayer> | null = null;
  private htmlMediaElement: HTMLMediaElement | null = null;
  private tickTimer: number | null = null;
  private listeners: Set<MediaEventHandler>;
  private htmlMediaHandlers: {
    play?: () => void;
    pause?: () => void;
    ended?: () => void;
  } = {};

  constructor(options?: MediaSyncOptions) {
    this.visualizer = options?.visualizer;
    this.tickIntervalMs = options?.tickIntervalMs ?? 100;
    this.listeners = new Set();
  }

  public onUpdate(handler: MediaEventHandler): void {
    this.listeners.add(handler);
  }

  public offUpdate(handler: MediaEventHandler): void {
    this.listeners.delete(handler);
  }

  public async attachYouTube(videoId: string, containerId: string): Promise<void> {
    this.clearCurrentSource();
    try {
      const player = YouTubePlayer(containerId, {
        videoId,
        playerVars: {
          modestbranding: 1,
          rel: 0,
        },
      });

      this.ytPlayer = player;
      this.currentSourceType = "youtube";

      await new Promise<void>((resolve) => {
        player.on("ready", () => resolve());
      });
    } catch (error) {
      console.error("Failed to attach YouTube player", error);
    }
  }

  public attachHtmlMediaElement(element: HTMLMediaElement): void {
    this.clearCurrentSource();
    this.htmlMediaElement = element;
    this.currentSourceType = "html5";

    try {
      audioEngine.connectExternalMediaElement(element);
    } catch (error) {
      console.error("Failed to connect HTML media element to audio engine", error);
    }

    const emitSnapshot = () => {
      void this.emitSnapshot();
    };

    this.htmlMediaHandlers = {
      play: emitSnapshot,
      pause: emitSnapshot,
      ended: emitSnapshot,
    };

    element.addEventListener("play", emitSnapshot);
    element.addEventListener("pause", emitSnapshot);
    element.addEventListener("ended", emitSnapshot);
  }

  public async play(): Promise<void> {
    try {
      if (this.currentSourceType === "youtube" && this.ytPlayer) {
        await this.ytPlayer.playVideo();
      } else if (this.currentSourceType === "html5" && this.htmlMediaElement) {
        await this.htmlMediaElement.play();
      }
    } catch (error) {
      console.error("Failed to play media", error);
    }
  }

  public async pause(): Promise<void> {
    try {
      if (this.currentSourceType === "youtube" && this.ytPlayer) {
        await this.ytPlayer.pauseVideo();
      } else if (this.currentSourceType === "html5" && this.htmlMediaElement) {
        this.htmlMediaElement.pause();
      }
    } catch (error) {
      console.error("Failed to pause media", error);
    }
  }

  public async seekTo(seconds: number): Promise<void> {
    const safeSeconds = Math.max(0, seconds);
    try {
      if (this.currentSourceType === "youtube" && this.ytPlayer) {
        await this.ytPlayer.seekTo(safeSeconds, true);
      } else if (this.currentSourceType === "html5" && this.htmlMediaElement) {
        this.htmlMediaElement.currentTime = safeSeconds;
      }
    } catch (error) {
      console.error("Failed to seek media", error);
    }
  }

  public async getStateSnapshot(): Promise<MediaStateSnapshot> {
    if (!this.currentSourceType) {
      return { ...DEFAULT_SNAPSHOT };
    }

    try {
      if (this.currentSourceType === "youtube" && this.ytPlayer) {
        const [currentTime, duration, playerState] = await Promise.all([
          this.ytPlayer.getCurrentTime(),
          this.ytPlayer.getDuration(),
          this.ytPlayer.getPlayerState(),
        ]);

        const isPlaying = playerState === 1; // 1 => PLAYING

        return {
          sourceType: "youtube",
          isPlaying,
          currentTime,
          duration,
        };
      }

      if (this.currentSourceType === "html5" && this.htmlMediaElement) {
        const element = this.htmlMediaElement;
        const isPlaying = !element.paused && !element.ended;
        const duration = Number.isFinite(element.duration) ? element.duration : null;

        return {
          sourceType: "html5",
          isPlaying,
          currentTime: element.currentTime,
          duration,
        };
      }
    } catch (error) {
      console.error("Failed to get media state snapshot", error);
    }

    return { ...DEFAULT_SNAPSHOT };
  }

  public startTicker(): void {
    if (this.tickTimer !== null) {
      return;
    }

    this.tickTimer = window.setInterval(() => {
      void this.emitSnapshot();
    }, this.tickIntervalMs);
  }

  public stopTicker(): void {
    if (this.tickTimer !== null) {
      window.clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
  }

  public destroy(): void {
    this.clearCurrentSource();
    this.listeners.clear();
  }

  private clearCurrentSource(): void {
    this.stopTicker();

    if (this.ytPlayer) {
      try {
        this.ytPlayer.destroy();
      } catch (error) {
        console.error("Failed to destroy YouTube player", error);
      }
      this.ytPlayer = null;
    }

    if (this.htmlMediaElement) {
      const { play, pause, ended } = this.htmlMediaHandlers;
      if (play) this.htmlMediaElement.removeEventListener("play", play);
      if (pause) this.htmlMediaElement.removeEventListener("pause", pause);
      if (ended) this.htmlMediaElement.removeEventListener("ended", ended);
      this.htmlMediaHandlers = {};
      this.htmlMediaElement = null;
    }

    this.currentSourceType = null;
  }

  private async emitSnapshot(): Promise<void> {
    const snapshot = await this.getStateSnapshot();
    this.listeners.forEach((handler) => handler(snapshot));
  }
}

/*
Example usage:

import { MediaSync } from "./lib/mediaSync";
import visualizer from "../visual/visualizerEngine"; // assuming a singleton elsewhere

const mediaSync = new MediaSync({ visualizer });
await mediaSync.attachYouTube("dQw4w9WgXcQ", "youtube-container");
mediaSync.onUpdate((state) => {
  console.log("Media state:", state);
});
mediaSync.startTicker();

const audioEl = document.getElementById("my-audio") as HTMLAudioElement;
mediaSync.attachHtmlMediaElement(audioEl);
mediaSync.startTicker();
*/
