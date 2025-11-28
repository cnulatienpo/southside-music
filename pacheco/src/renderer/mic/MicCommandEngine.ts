type MicEvent = 'listening' | 'stopped' | 'command';

export interface IMicCommandEngine {
  start(): void;
  stop(): void;
  getBuffer(): string[];
  on(event: MicEvent, handler: (data: string[]) => void): () => void;
}

export class MicCommandEngine implements IMicCommandEngine {
  private buffer: string[] = [];
  private listening = false;
  private subscribers: Map<MicEvent, Set<(data: string[]) => void>> = new Map();

  constructor() {
    ['listening', 'stopped', 'command'].forEach((evt) => this.subscribers.set(evt as MicEvent, new Set()));
  }

  start(): void {
    this.listening = true;
    this.emit('listening');
  }

  stop(): void {
    this.listening = false;
    this.emit('stopped');
  }

  getBuffer(): string[] {
    return [...this.buffer];
  }

  simulateCommand(text: string): void {
    this.buffer.push(text);
    this.emit('command');
  }

  on(event: MicEvent, handler: (data: string[]) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit(event: MicEvent) {
    const bucket = this.subscribers.get(event);
    if (!bucket) return;
    const snapshot = this.getBuffer();
    bucket.forEach((handler) => handler(snapshot));
  }
}
