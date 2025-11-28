type PitchEvent = 'contour-updated' | 'reset';

export interface IPitchContourEngine {
  recordPoint(time: number, value: number): void;
  reset(): void;
  getContour(): Array<{ time: number; value: number }>;
  on(event: PitchEvent, handler: (contour: Array<{ time: number; value: number }>) => void): () => void;
}

export class PitchContourEngine implements IPitchContourEngine {
  private contour: Array<{ time: number; value: number }> = [];
  private subscribers: Map<PitchEvent, Set<(contour: Array<{ time: number; value: number }>) => void>> = new Map();

  constructor() {
    ['contour-updated', 'reset'].forEach((evt) => this.subscribers.set(evt as PitchEvent, new Set()));
  }

  recordPoint(time: number, value: number): void {
    this.contour.push({ time, value });
    this.emit('contour-updated');
  }

  reset(): void {
    this.contour = [];
    this.emit('reset');
  }

  getContour(): Array<{ time: number; value: number }> {
    return [...this.contour];
  }

  on(event: PitchEvent, handler: (contour: Array<{ time: number; value: number }>) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit(event: PitchEvent) {
    const bucket = this.subscribers.get(event);
    if (!bucket) return;
    const snapshot = this.getContour();
    bucket.forEach((handler) => handler(snapshot));
  }
}
