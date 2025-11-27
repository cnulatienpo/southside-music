import { DiaryEntry, EventId, Fingerprint, Lane, LaneId, LineState, NotationRenderSettings, PachecoEvent, PachecoLevel, SubtitleRenderData, SymbolId, Timestamp, unsubscribeFn } from "../types";
import { Stroke, PachecoSymbol } from "../types";

export interface MediaEngine {
  loadFile(file: File): Promise<void>;
  play(): void;
  pause(): void;
  seek(time: number): void;
  getCurrentTime(): number;
  onTimeUpdate(cb: (time: number) => void): unsubscribeFn;
  getAudioData(): Float32Array;
}

export interface LaneEngine {
  getLanes(): Lane[];
  addLaneAbove(): LaneId;
  addLaneBelow(): LaneId;
  assignEventToLane(eventId: EventId, laneId: LaneId): void;
  getLaneForFrequency(freq: number): LaneId | null;
  onLaneChange(cb: (lanes: Lane[]) => void): unsubscribeFn;
}

export interface LineEvolutionEngine {
  getLineState(): LineState;
  requestLineIncrease(reason: string): void;
  requestLineDecrease(reason: string): void;
  onLineState(cb: (s: LineState) => void): unsubscribeFn;
}

export interface EventCaptureEngine {
  markEvent(time: number): EventId;
  updateEventLane(eventId: EventId, laneId: LaneId): void;
  updateEventRhythm(eventId: EventId, rhythm: number[]): void;
  updateEventPitch(eventId: EventId, profile: string): void;
  updateEventTexture(eventId: EventId, texture: string): void;
  assignSymbol(eventId: EventId, symbolId: SymbolId): void;
  getEvent(eventId: EventId): PachecoEvent | null;
  getAllEvents(): PachecoEvent[];
  onEventCreated(cb: (event: PachecoEvent) => void): unsubscribeFn;
  onEventUpdated(cb: (event: PachecoEvent) => void): unsubscribeFn;
}

export interface RhythmCaptureEngine {
  startCapture(startTime?: number): void;
  tap(): void;
  stopCapture(): number[];
  getLastProfile(): number[] | null;
  onProfile(cb: (profile: number[]) => void): unsubscribeFn;
}

export interface PitchContourEngine {
  startDrawing(): void;
  addPoint(x: number, y: number): void;
  endDrawing(): string;
  normalizeProfile(points: { x: number; y: number }[]): string;
}

export interface SymbolEngine {
  createSymbol(strokes: Stroke[]): SymbolId;
  updateSymbol(id: SymbolId, updates: Partial<PachecoSymbol>): void;
  getSymbol(id: SymbolId): PachecoSymbol | null;
  getAllSymbols(): PachecoSymbol[];
  findMatchingSymbol(profile: Fingerprint): SymbolId | null;
  onSymbolCreated(cb: (symbol: PachecoSymbol) => void): unsubscribeFn;
  onSymbolUpdated(cb: (symbol: PachecoSymbol) => void): unsubscribeFn;
}

export interface PatternPropagationEngine {
  generateFingerprint(event: PachecoEvent): Fingerprint;
  scanTrack(): void;
  propagate(eventId: EventId): EventId[];
  onPropagation(cb: (events: PachecoEvent[]) => void): unsubscribeFn;
}

export interface AdaptiveSubtitleEngine {
  setRenderSettings(settings: Partial<NotationRenderSettings>): void;
  getRenderSettings(): NotationRenderSettings;
  renderFrame(time: number): SubtitleRenderData;
  onRenderSettings(cb: (s: NotationRenderSettings) => void): unsubscribeFn;
}

export interface MicCommandEngine {
  start(): void;
  stop(): void;
  onTransient(cb: (time: number) => void): unsubscribeFn;
  onCommand(cb: (cmd: string) => void): unsubscribeFn;
  onVoiceActivity(cb: (active: boolean) => void): unsubscribeFn;
}

export interface DiaryEngine {
  log(entry: DiaryEntry): void;
  getLog(): DiaryEntry[];
  clear(): void;
  onEntry(cb: (entry: DiaryEntry) => void): unsubscribeFn;
}

export interface StateManager {
  getLevel(): PachecoLevel;
  requestLevelIncrease(reason: string): void;
  setSetting(key: string, value: any): void; // eslint-disable-line @typescript-eslint/no-explicit-any
  getSetting<T>(key: string): T | null;
  onLevelChange(cb: (lvl: PachecoLevel) => void): unsubscribeFn;
}
