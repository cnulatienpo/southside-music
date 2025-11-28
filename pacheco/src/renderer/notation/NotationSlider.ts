type SliderEvent = 'changed';

export interface INotationSlider {
  setValue(value: number): void;
  getValue(): number;
  on(event: SliderEvent, handler: (value: number) => void): () => void;
}

export class NotationSlider implements INotationSlider {
  private value = 0;
  private subscribers: Map<SliderEvent, Set<(value: number) => void>> = new Map();

  constructor() {
    this.subscribers.set('changed', new Set());
  }

  setValue(value: number): void {
    const clamped = Math.max(0, Math.min(100, value));
    this.value = clamped;
    this.emit();
  }

  getValue(): number {
    return this.value;
  }

  on(_event: SliderEvent, handler: (value: number) => void): () => void {
    const bucket = this.subscribers.get('changed');
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit() {
    const bucket = this.subscribers.get('changed');
    if (!bucket) return;
    bucket.forEach((handler) => handler(this.value));
  }
}
