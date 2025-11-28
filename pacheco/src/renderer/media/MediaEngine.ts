import { PachecoEvent } from '../types';

type MediaEventType = 'loaded' | 'play' | 'pause' | 'seek' | 'loop';

export interface IMediaEngine {
  loadMedia(path: string): Promise<void>;
  play(): void;
  pause(): void;
  seek(time: number): void;
  setLoop(loop: boolean): void;
  getState(): { source?: string; isPlaying: boolean; position: number; loop: boolean };
  on(event: MediaEventType, handler: (state: { position: number }) => void): () => void;
  record(event: PachecoEvent): void;
}

export class MediaEngine implements IMediaEngine {
  private source?: string;
  private isPlaying = false;
  private position = 0;
  private loop = false;
  private subscribers: Map<MediaEventType, Set<(state: { position: number }) => void>> = new Map();

  constructor() {
    ['loaded', 'play', 'pause', 'seek', 'loop'].forEach((evt) => {
      this.subscribers.set(evt as MediaEventType, new Set());
    });
  }

  async loadMedia(path: string): Promise<void> {
    this.source = path;
    this.position = 0;
    this.notify('loaded');
  }

  play(): void {
    this.isPlaying = true;
    this.notify('play');
  }

  pause(): void {
    this.isPlaying = false;
    this.notify('pause');
  }

  seek(time: number): void {
    this.position = time;
    this.notify('seek');
  }

  setLoop(loop: boolean): void {
    this.loop = loop;
    this.notify('loop');
  }

  getState() {
    return {
      source: this.source,
      isPlaying: this.isPlaying,
      position: this.position,
      loop: this.loop,
    };
  }

  on(event: MediaEventType, handler: (state: { position: number }) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) {
      return () => undefined;
    }
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  record(_event: PachecoEvent): void {
    // Media event storage placeholder.
  }

  private notify(event: MediaEventType) {
    const bucket = this.subscribers.get(event);
    if (!bucket) return;
    const snapshot = { position: this.position };
    bucket.forEach((handler) => handler(snapshot));
  }
}
