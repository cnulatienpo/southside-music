export type AudioEventType = "note" | "beat" | "chord" | "sample" | "effect";

export interface AudioEvent {
  id: string;
  type: AudioEventType;
  pitch?: number;
  velocity?: number;
  duration?: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * AudioMusicModel represents the arrangement as a list of time-ordered audio events.
 * Events are minimal and data-driven to allow rendering via different audio engines
 * (Web Audio, native host, or exported MIDI). All methods operate immutably to
 * simplify time-travel debugging and state synchronization.
 */
export class AudioMusicModel {
  private events: AudioEvent[] = [];

  addEvent(event: AudioEvent): void {
    this.events.push(structuredClone(event));
    this.events.sort((a, b) => a.timestamp - b.timestamp);
  }

  updateEvent(id: string, edits: Partial<AudioEvent>): void {
    this.events = this.events.map((event) =>
      event.id === id ? { ...event, ...structuredClone(edits) } : event
    );
    this.events.sort((a, b) => a.timestamp - b.timestamp);
  }

  getEvents(): AudioEvent[] {
    return structuredClone(this.events);
  }

  clear(): void {
    this.events = [];
  }
}
