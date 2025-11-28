import { LineState, NotationRenderSettings } from '../types';

type StateEvent = 'state-changed';

export interface IStateManager {
  setLineState(state: LineState): void;
  setRenderSettings(settings: NotationRenderSettings): void;
  getLineState(): LineState | undefined;
  getRenderSettings(): NotationRenderSettings | undefined;
  on(event: StateEvent, handler: (state: { line?: LineState; render?: NotationRenderSettings }) => void): () => void;
}

export class StateManager implements IStateManager {
  private lineState?: LineState;
  private renderSettings?: NotationRenderSettings;
  private subscribers: Map<StateEvent, Set<(state: { line?: LineState; render?: NotationRenderSettings }) => void>> = new Map();

  constructor() {
    this.subscribers.set('state-changed', new Set());
  }

  setLineState(state: LineState): void {
    this.lineState = state;
    this.emit();
  }

  setRenderSettings(settings: NotationRenderSettings): void {
    this.renderSettings = settings;
    this.emit();
  }

  getLineState(): LineState | undefined {
    return this.lineState ? { ...this.lineState, lanes: [...this.lineState.lanes] } : undefined;
  }

  getRenderSettings(): NotationRenderSettings | undefined {
    return this.renderSettings ? { ...this.renderSettings } : undefined;
  }

  on(event: StateEvent, handler: (state: { line?: LineState; render?: NotationRenderSettings }) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit() {
    const bucket = this.subscribers.get('state-changed');
    if (!bucket) return;
    const snapshot = { line: this.getLineState(), render: this.getRenderSettings() };
    bucket.forEach((handler) => handler(snapshot));
  }
}
