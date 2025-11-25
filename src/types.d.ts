/// <reference types="web-speech-api" />

// Custom type declarations for external modules that lack typings in this project.
declare module "wavesurfer.js" {
  export interface WaveSurferOptions {
    container: string | HTMLElement;
    waveColor?: string;
    progressColor?: string;
    height?: number;
    responsive?: boolean;
    normalize?: boolean;
    backend?: string;
    media?: HTMLMediaElement;
  }

  export interface WaveSurferInstance {
    load(url: string): Promise<void>;
    setOptions(options: Partial<WaveSurferOptions>): void;
    destroy(): void;
    backend?: {
      analyser?: AnalyserNode;
      ac?: AudioContext;
      gainNode?: GainNode;
    };
  }

  const WaveSurfer: {
    create(options: WaveSurferOptions): WaveSurferInstance;
  };

  export default WaveSurfer;
}
