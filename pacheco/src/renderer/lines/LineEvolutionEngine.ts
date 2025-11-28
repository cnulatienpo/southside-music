import { LineState } from '../types';

type LineEvent = 'line-updated' | 'render-requested';

export interface ILineEvolutionEngine {
  getState(): LineState;
  applyChange(change: Partial<LineState>): void;
  requestRender(): void;
  on(event: LineEvent, handler: (state: LineState) => void): () => void;
}

export class LineEvolutionEngine implements ILineEvolutionEngine {
  private state: LineState = { id: 'line-0', lanes: [], revision: 0 };
  private subscribers: Map<LineEvent, Set<(state: LineState) => void>> = new Map();

  constructor() {
    ['line-updated', 'render-requested'].forEach((evt) => {
      this.subscribers.set(evt as LineEvent, new Set());
    });
  }

  getState(): LineState {
    return { ...this.state, lanes: [...this.state.lanes] };
  }

  applyChange(change: Partial<LineState>): void {
    this.state = { ...this.state, ...change, revision: this.state.revision + 1 };
    this.emit('line-updated');
  }

  requestRender(): void {
    this.emit('render-requested');
  }

  on(event: LineEvent, handler: (state: LineState) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit(event: LineEvent) {
    const bucket = this.subscribers.get(event);
    if (!bucket) return;
    const snapshot = this.getState();
    bucket.forEach((handler) => handler(snapshot));
  }
}
