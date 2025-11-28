import { Lane, PachecoEvent } from '../types';

type LaneEvent = 'lane-added' | 'lane-removed' | 'lane-updated';

export interface ILaneEngine {
  addLane(label: string): Lane;
  removeLane(id: string): void;
  updateLane(id: string, events: PachecoEvent[]): void;
  getLanes(): Lane[];
  on(event: LaneEvent, handler: (lanes: Lane[]) => void): () => void;
}

export class LaneEngine implements ILaneEngine {
  private lanes: Lane[] = [];
  private subscribers: Map<LaneEvent, Set<(lanes: Lane[]) => void>> = new Map();

  constructor() {
    ['lane-added', 'lane-removed', 'lane-updated'].forEach((evt) => {
      this.subscribers.set(evt as LaneEvent, new Set());
    });
  }

  addLane(label: string): Lane {
    const lane: Lane = { id: `lane-${Date.now()}`, label, events: [] };
    this.lanes.push(lane);
    this.emit('lane-added');
    return lane;
  }

  removeLane(id: string): void {
    this.lanes = this.lanes.filter((lane) => lane.id !== id);
    this.emit('lane-removed');
  }

  updateLane(id: string, events: PachecoEvent[]): void {
    const lane = this.lanes.find((l) => l.id === id);
    if (lane) {
      lane.events = events;
      this.emit('lane-updated');
    }
  }

  getLanes(): Lane[] {
    return [...this.lanes];
  }

  on(event: LaneEvent, handler: (lanes: Lane[]) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit(event: LaneEvent) {
    const bucket = this.subscribers.get(event);
    if (!bucket) return;
    const snapshot = this.getLanes();
    bucket.forEach((handler) => handler(snapshot));
  }
}
