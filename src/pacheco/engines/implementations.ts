import { nanoid } from "nanoid";
import {
  DiaryEntry,
  EventId,
  Fingerprint,
  Lane,
  LaneId,
  LineState,
  NotationRenderSettings,
  PachecoEvent,
  PachecoLevel,
  PachecoSymbol,
  SubtitleRenderData,
  SymbolId,
  Timestamp,
  unsubscribeFn,
} from "../types";
import {
  AdaptiveSubtitleEngine,
  DiaryEngine as DiaryEngineContract,
  EventCaptureEngine,
  LaneEngine,
  LineEvolutionEngine,
  MediaEngine,
  MicCommandEngine,
  PatternPropagationEngine,
  PitchContourEngine,
  RhythmCaptureEngine,
  StateManager,
  SymbolEngine,
} from "./contracts";
import { TypedEventEmitter } from "../eventEmitter";
import { Stroke } from "../types";

export class MediaEngineStub implements MediaEngine {
  private currentTime = 0;

  private readonly emitter = new TypedEventEmitter<{ timeUpdate: (time: number) => void }>();

  private audioData: Float32Array = new Float32Array(0);

  async loadFile(file: File): Promise<void> {
    const length = file.size || 1;
    this.audioData = new Float32Array(Math.max(1, Math.min(length, 1024)));
  }

  play(): void {}

  pause(): void {}

  seek(time: number): void {
    this.currentTime = time;
    this.emitter.emit("timeUpdate", time);
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  onTimeUpdate(cb: (time: number) => void): unsubscribeFn {
    return this.emitter.subscribe("timeUpdate", cb);
  }

  getAudioData(): Float32Array {
    return this.audioData;
  }
}

export class LaneEngineStub implements LaneEngine {
  private lanes: Lane[] = [
    { id: "lane-high", z: 2, visible: true },
    { id: "lane-mid", z: 1, visible: true },
    { id: "lane-low", z: 0, visible: true },
  ];

  private readonly emitter = new TypedEventEmitter<{ change: (lanes: Lane[]) => void }>();

  getLanes(): Lane[] {
    return [...this.lanes];
  }

  addLaneAbove(): LaneId {
    const id = `lane-${nanoid(6)}`;
    const topZ = Math.max(...this.lanes.map((l) => l.z), 0) + 1;
    this.lanes = [{ id, z: topZ, visible: true }, ...this.lanes];
    this.emitter.emit("change", this.getLanes());
    return id;
  }

  addLaneBelow(): LaneId {
    const id = `lane-${nanoid(6)}`;
    const bottomZ = Math.min(...this.lanes.map((l) => l.z), 0) - 1;
    this.lanes = [...this.lanes, { id, z: bottomZ, visible: true }];
    this.emitter.emit("change", this.getLanes());
    return id;
  }

  assignEventToLane(_eventId: EventId, laneId: LaneId): void {
    if (!this.lanes.find((l) => l.id === laneId)) return;
  }

  getLaneForFrequency(_freq: number): LaneId | null {
    return this.lanes[0]?.id ?? null;
  }

  onLaneChange(cb: (lanes: Lane[]) => void): unsubscribeFn {
    return this.emitter.subscribe("change", cb);
  }
}

export class LineEvolutionEngineStub implements LineEvolutionEngine {
  private lineState: LineState = { lineCount: 0, active: false };

  private readonly emitter = new TypedEventEmitter<{ change: (state: LineState) => void }>();

  getLineState(): LineState {
    return { ...this.lineState };
  }

  requestLineIncrease(_reason: string): void {
    const next = Math.min(this.lineState.lineCount + 1, 5);
    this.setLineState({ lineCount: next, active: next > 0 });
  }

  requestLineDecrease(_reason: string): void {
    const next = Math.max(this.lineState.lineCount - 1, 0);
    this.setLineState({ lineCount: next, active: next > 0 });
  }

  onLineState(cb: (s: LineState) => void): unsubscribeFn {
    return this.emitter.subscribe("change", cb);
  }

  private setLineState(state: LineState) {
    this.lineState = state;
    this.emitter.emit("change", this.getLineState());
  }
}

export class EventCaptureEngineStub implements EventCaptureEngine {
  private events: PachecoEvent[] = [];

  private readonly emitter = new TypedEventEmitter<{
    created: (event: PachecoEvent) => void;
    updated: (event: PachecoEvent) => void;
  }>();

  constructor(private readonly laneEngine?: LaneEngine) {}

  markEvent(time: number): EventId {
    const laneId = this.laneEngine?.getLanes()[0]?.id ?? "lane-0";
    const event: PachecoEvent = { id: nanoid(), timestamp: time, laneId };
    this.events = [...this.events, event];
    this.emitter.emit("created", { ...event });
    return event.id;
  }

  updateEventLane(eventId: EventId, laneId: LaneId): void {
    this.updateEvent(eventId, { laneId });
  }

  updateEventRhythm(eventId: EventId, rhythm: number[]): void {
    this.updateEvent(eventId, { rhythmProfile: rhythm });
  }

  updateEventPitch(eventId: EventId, profile: string): void {
    this.updateEvent(eventId, { pitchProfile: profile });
  }

  updateEventTexture(eventId: EventId, texture: string): void {
    this.updateEvent(eventId, { textureProfile: texture });
  }

  assignSymbol(eventId: EventId, symbolId: SymbolId): void {
    this.updateEvent(eventId, { symbolId });
  }

  getEvent(eventId: EventId): PachecoEvent | null {
    return this.events.find((evt) => evt.id === eventId) ?? null;
  }

  getAllEvents(): PachecoEvent[] {
    return [...this.events];
  }

  onEventCreated(cb: (event: PachecoEvent) => void): unsubscribeFn {
    return this.emitter.subscribe("created", cb);
  }

  onEventUpdated(cb: (event: PachecoEvent) => void): unsubscribeFn {
    return this.emitter.subscribe("updated", cb);
  }

  private updateEvent(eventId: EventId, updates: Partial<PachecoEvent>) {
    this.events = this.events.map((evt) =>
      evt.id === eventId
        ? { ...evt, ...updates }
        : evt,
    );
    const updated = this.getEvent(eventId);
    if (updated) {
      this.emitter.emit("updated", { ...updated });
    }
  }
}

export class RhythmCaptureEngineStub implements RhythmCaptureEngine {
  private taps: Timestamp[] = [];

  private startTime: Timestamp | null = null;

  private lastProfile: number[] | null = null;

  private readonly emitter = new TypedEventEmitter<{ profile: (profile: number[]) => void }>();

  startCapture(startTime?: number): void {
    this.taps = [];
    this.startTime = typeof startTime === "number" ? startTime : null;
  }

  tap(): void {
    const time = Date.now();
    this.taps.push(time);
  }

  stopCapture(): number[] {
    if (this.taps.length < 2) {
      this.lastProfile = [];
      return this.lastProfile;
    }
    const base = this.startTime ?? this.taps[0];
    const intervals: number[] = [];
    for (let i = 1; i < this.taps.length; i += 1) {
      intervals.push(this.taps[i] - this.taps[i - 1]);
    }
    this.lastProfile = intervals.map((interval) => interval - base + base);
    this.emitter.emit("profile", [...this.lastProfile]);
    return this.lastProfile;
  }

  getLastProfile(): number[] | null {
    return this.lastProfile ? [...this.lastProfile] : null;
  }

  onProfile(cb: (profile: number[]) => void): unsubscribeFn {
    return this.emitter.subscribe("profile", cb);
  }
}

export class PitchContourEngineStub implements PitchContourEngine {
  private points: { x: number; y: number }[] = [];

  startDrawing(): void {
    this.points = [];
  }

  addPoint(x: number, y: number): void {
    this.points.push({ x, y });
  }

  endDrawing(): string {
    const profile = this.normalizeProfile(this.points);
    this.points = [];
    return profile;
  }

  normalizeProfile(points: { x: number; y: number }[]): string {
    if (points.length === 0) return "flat";
    const deltas = points.map((p, idx) => {
      if (idx === 0) return 0;
      return p.y - points[idx - 1].y;
    });
    const direction = deltas.every((d) => d === 0)
      ? "flat"
      : deltas.every((d) => d >= 0)
        ? "up"
        : deltas.every((d) => d <= 0)
          ? "down"
          : "mixed";
    return `${direction}:${points.length}`;
  }
}

export class SymbolEngineStub implements SymbolEngine {
  private symbols: Map<SymbolId, PachecoSymbol> = new Map();

  private readonly emitter = new TypedEventEmitter<{
    created: (symbol: PachecoSymbol) => void;
    updated: (symbol: PachecoSymbol) => void;
  }>();

  createSymbol(strokes: Stroke[]): SymbolId {
    const id = nanoid();
    const symbol: PachecoSymbol = { id, strokes };
    this.symbols.set(id, symbol);
    this.emitter.emit("created", { ...symbol });
    return id;
  }

  updateSymbol(id: SymbolId, updates: Partial<PachecoSymbol>): void {
    const existing = this.symbols.get(id);
    if (!existing) return;
    const updated = { ...existing, ...updates };
    this.symbols.set(id, updated);
    this.emitter.emit("updated", { ...updated });
  }

  getSymbol(id: SymbolId): PachecoSymbol | null {
    return this.symbols.get(id) ?? null;
  }

  getAllSymbols(): PachecoSymbol[] {
    return Array.from(this.symbols.values()).map((s) => ({ ...s }));
  }

  findMatchingSymbol(profile: Fingerprint): SymbolId | null {
    const match = Array.from(this.symbols.values()).find((s) => s.fingerprint === profile);
    return match?.id ?? null;
  }

  onSymbolCreated(cb: (symbol: PachecoSymbol) => void): unsubscribeFn {
    return this.emitter.subscribe("created", cb);
  }

  onSymbolUpdated(cb: (symbol: PachecoSymbol) => void): unsubscribeFn {
    return this.emitter.subscribe("updated", cb);
  }
}

export class PatternPropagationEngineStub implements PatternPropagationEngine {
  private readonly emitter = new TypedEventEmitter<{ propagation: (events: PachecoEvent[]) => void }>();

  constructor(private readonly eventSource: () => PachecoEvent[], private readonly capture?: EventCaptureEngine) {}

  generateFingerprint(event: PachecoEvent): Fingerprint {
    const rhythm = event.rhythmProfile?.join("-") ?? "r0";
    const pitch = event.pitchProfile ?? "p0";
    const lane = event.laneId;
    return [lane, rhythm, pitch].join(":");
  }

  scanTrack(): void {
    const events = this.eventSource();
    const propagated: PachecoEvent[] = events.map((evt) => ({ ...evt, fingerprint: this.generateFingerprint(evt) }));
    this.emitter.emit("propagation", propagated);
  }

  propagate(eventId: EventId): EventId[] {
    const source = this.eventSource().find((evt) => evt.id === eventId);
    if (!source || !this.capture) return [];
    const clone: PachecoEvent = {
      ...source,
      id: nanoid(),
      timestamp: source.timestamp + 1000,
      fingerprint: this.generateFingerprint(source),
    };
    this.capture.markEvent(clone.timestamp);
    this.emitter.emit("propagation", [clone]);
    return [clone.id];
  }

  onPropagation(cb: (events: PachecoEvent[]) => void): unsubscribeFn {
    return this.emitter.subscribe("propagation", cb);
  }
}

export class AdaptiveSubtitleEngineStub implements AdaptiveSubtitleEngine {
  private settings: NotationRenderSettings = {
    slider: 0,
    showLines: true,
    showStaff: false,
    showNoteheads: false,
    snapPitch: false,
    snapRhythm: false,
  };

  private readonly emitter = new TypedEventEmitter<{ settings: (settings: NotationRenderSettings) => void }>();

  constructor(private readonly laneSource: () => Lane[], private readonly eventsSource: () => PachecoEvent[]) {}

  setRenderSettings(settings: Partial<NotationRenderSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.emitter.emit("settings", this.getRenderSettings());
  }

  getRenderSettings(): NotationRenderSettings {
    return { ...this.settings };
  }

  renderFrame(time: number): SubtitleRenderData {
    const lanes = this.laneSource();
    const events = this.eventsSource();
    return {
      lanes: lanes
        .sort((a, b) => b.z - a.z)
        .map((lane) => ({
          laneId: lane.id,
          events: events
            .filter((evt) => evt.laneId === lane.id && evt.timestamp <= time)
            .map((evt) => ({
              eventId: evt.id,
              x: evt.timestamp,
              y: lane.z,
              symbolId: evt.symbolId ?? null,
              pitchPath: evt.pitchProfile ? [{ x: evt.timestamp, y: lane.z }] : undefined,
            })),
        })),
    };
  }

  onRenderSettings(cb: (s: NotationRenderSettings) => void): unsubscribeFn {
    return this.emitter.subscribe("settings", cb);
  }
}

export class MicCommandEngineStub implements MicCommandEngine {
  private readonly emitter = new TypedEventEmitter<{
    transient: (time: number) => void;
    command: (cmd: string) => void;
    voice: (active: boolean) => void;
  }>();

  start(): void {}

  stop(): void {}

  onTransient(cb: (time: number) => void): unsubscribeFn {
    return this.emitter.subscribe("transient", cb);
  }

  onCommand(cb: (cmd: string) => void): unsubscribeFn {
    return this.emitter.subscribe("command", cb);
  }

  onVoiceActivity(cb: (active: boolean) => void): unsubscribeFn {
    return this.emitter.subscribe("voice", cb);
  }
}

export class DiaryEngineStub implements DiaryEngineContract {
  private entries: DiaryEntry[] = [];

  private readonly emitter = new TypedEventEmitter<{ entry: (entry: DiaryEntry) => void }>();

  log(entry: DiaryEntry): void {
    this.entries = [...this.entries, entry];
    this.emitter.emit("entry", { ...entry });
  }

  getLog(): DiaryEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }

  onEntry(cb: (entry: DiaryEntry) => void): unsubscribeFn {
    return this.emitter.subscribe("entry", cb);
  }
}

export class StateManagerStub implements StateManager {
  private level: PachecoLevel = 0;

  private settings: Map<string, any> = new Map(); // eslint-disable-line @typescript-eslint/no-explicit-any

  private readonly emitter = new TypedEventEmitter<{ level: (lvl: PachecoLevel) => void }>();

  getLevel(): PachecoLevel {
    return this.level;
  }

  requestLevelIncrease(_reason: string): void {
    this.level = Math.min(10, this.level + 1);
    this.emitter.emit("level", this.level);
  }

  setSetting(key: string, value: any): void { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.settings.set(key, value);
  }

  getSetting<T>(key: string): T | null {
    return (this.settings.get(key) as T) ?? null;
  }

  onLevelChange(cb: (lvl: PachecoLevel) => void): unsubscribeFn {
    return this.emitter.subscribe("level", cb);
  }
}
