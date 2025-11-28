type SubtitleEvent = 'subtitle-updated' | 'subtitle-cleared';

export interface IAdaptiveSubtitleEngine {
  load(lines: string[]): void;
  getCurrent(time: number): string | undefined;
  clear(): void;
  on(event: SubtitleEvent, handler: (lines: string[]) => void): () => void;
}

export class AdaptiveSubtitleEngine implements IAdaptiveSubtitleEngine {
  private lines: string[] = [];
  private subscribers: Map<SubtitleEvent, Set<(lines: string[]) => void>> = new Map();

  constructor() {
    ['subtitle-updated', 'subtitle-cleared'].forEach((evt) => this.subscribers.set(evt as SubtitleEvent, new Set()));
  }

  load(lines: string[]): void {
    this.lines = lines;
    this.emit('subtitle-updated');
  }

  getCurrent(index: number): string | undefined {
    return this.lines[index];
  }

  clear(): void {
    this.lines = [];
    this.emit('subtitle-cleared');
  }

  on(event: SubtitleEvent, handler: (lines: string[]) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit(event: SubtitleEvent) {
    const bucket = this.subscribers.get(event);
    if (!bucket) return;
    const snapshot = [...this.lines];
    bucket.forEach((handler) => handler(snapshot));
  }
}
