type RhythmEvent = 'pulse' | 'clear';

export interface IRhythmCaptureEngine {
  tap(timestamp: number): void;
  clear(): void;
  getPattern(): number[];
  on(event: RhythmEvent, handler: (pattern: number[]) => void): () => void;
}

export class RhythmCaptureEngine implements IRhythmCaptureEngine {
  private taps: number[] = [];
  private subscribers: Map<RhythmEvent, Set<(pattern: number[]) => void>> = new Map();

  constructor() {
    ['pulse', 'clear'].forEach((evt) => this.subscribers.set(evt as RhythmEvent, new Set()));
  }

  tap(timestamp: number): void {
    this.taps.push(timestamp);
    this.emit('pulse');
  }

  clear(): void {
    this.taps = [];
    this.emit('clear');
  }

  getPattern(): number[] {
    return [...this.taps];
  }

  on(event: RhythmEvent, handler: (pattern: number[]) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit(event: RhythmEvent) {
    const bucket = this.subscribers.get(event);
    if (!bucket) return;
    const snapshot = this.getPattern();
    bucket.forEach((handler) => handler(snapshot));
  }
}
