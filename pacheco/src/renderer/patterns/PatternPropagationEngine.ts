import { PachecoEvent } from '../types';

type PatternEvent = 'propagated' | 'cleared';

export interface IPatternPropagationEngine {
  ingest(events: PachecoEvent[]): void;
  propagate(): PachecoEvent[];
  clear(): void;
  getQueuedCount(): number;
  on(event: PatternEvent, handler: (events: PachecoEvent[]) => void): () => void;
}

export class PatternPropagationEngine implements IPatternPropagationEngine {
  private queue: PachecoEvent[] = [];
  private subscribers: Map<PatternEvent, Set<(events: PachecoEvent[]) => void>> = new Map();

  constructor() {
    ['propagated', 'cleared'].forEach((evt) => this.subscribers.set(evt as PatternEvent, new Set()));
  }

  ingest(events: PachecoEvent[]): void {
    this.queue.push(...events);
  }

  propagate(): PachecoEvent[] {
    const propagated = [...this.queue];
    this.queue = [];
    this.emit('propagated');
    return propagated;
  }

  clear(): void {
    this.queue = [];
    this.emit('cleared');
  }

  getQueuedCount(): number {
    return this.queue.length;
  }

  on(event: PatternEvent, handler: (events: PachecoEvent[]) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit(event: PatternEvent) {
    const bucket = this.subscribers.get(event);
    if (!bucket) return;
    const snapshot = [...this.queue];
    bucket.forEach((handler) => handler(snapshot));
  }
}
