import { DiaryEntry } from '../types';

type DiaryEvent = 'entry-added' | 'cleared';

export interface IDiaryEngine {
  addEntry(message: string): DiaryEntry;
  clear(): void;
  getEntries(): DiaryEntry[];
  on(event: DiaryEvent, handler: (entries: DiaryEntry[]) => void): () => void;
}

export class DiaryEngine implements IDiaryEngine {
  private entries: DiaryEntry[] = [];
  private subscribers: Map<DiaryEvent, Set<(entries: DiaryEntry[]) => void>> = new Map();

  constructor() {
    ['entry-added', 'cleared'].forEach((evt) => this.subscribers.set(evt as DiaryEvent, new Set()));
  }

  addEntry(message: string): DiaryEntry {
    const entry: DiaryEntry = { id: `entry-${Date.now()}`, createdAt: Date.now(), message };
    this.entries.push(entry);
    this.emit('entry-added');
    return entry;
  }

  clear(): void {
    this.entries = [];
    this.emit('cleared');
  }

  getEntries(): DiaryEntry[] {
    return [...this.entries].sort((a, b) => a.createdAt - b.createdAt);
  }

  on(event: DiaryEvent, handler: (entries: DiaryEntry[]) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit(event: DiaryEvent) {
    const bucket = this.subscribers.get(event);
    if (!bucket) return;
    const snapshot = this.getEntries();
    bucket.forEach((handler) => handler(snapshot));
  }
}
