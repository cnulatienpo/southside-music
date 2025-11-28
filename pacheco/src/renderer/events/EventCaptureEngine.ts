import { PachecoEvent } from '../types';

type EventCaptureEvent = 'captured' | 'flushed';

export interface IEventCaptureEngine {
  capture(event: PachecoEvent): void;
  flush(): PachecoEvent[];
  getEvents(): PachecoEvent[];
  on(event: EventCaptureEvent, handler: (events: PachecoEvent[]) => void): () => void;
}

export class EventCaptureEngine implements IEventCaptureEngine {
  private events: PachecoEvent[] = [];
  private subscribers: Map<EventCaptureEvent, Set<(events: PachecoEvent[]) => void>> = new Map();

  constructor() {
    ['captured', 'flushed'].forEach((evt) => {
      this.subscribers.set(evt as EventCaptureEvent, new Set());
    });
  }

  capture(event: PachecoEvent): void {
    this.events.push(event);
    this.emit('captured');
  }

  flush(): PachecoEvent[] {
    const copy = [...this.events];
    this.events = [];
    this.emit('flushed');
    return copy;
  }

  getEvents(): PachecoEvent[] {
    return [...this.events];
  }

  on(event: EventCaptureEvent, handler: (events: PachecoEvent[]) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit(event: EventCaptureEvent) {
    const bucket = this.subscribers.get(event);
    if (!bucket) return;
    const snapshot = this.getEvents();
    bucket.forEach((handler) => handler(snapshot));
  }
}
