export type Timestamp = number; // ms
export type LaneId = string;
export type EventId = string;
export type SymbolId = string;
export type Fingerprint = string;
export type PachecoLevel = number; // 0–10

export type unsubscribeFn = () => void;

export interface PachecoEvent {
  id: EventId;
  timestamp: Timestamp; // relative to media time
  laneId: LaneId;
  rhythmProfile?: number[]; // tap intervals
  pitchProfile?: string; // up/down/downUp/upDown/flat
  textureProfile?: string; // optional
  symbolId?: SymbolId;
  fingerprint?: Fingerprint; // computed by recognition engines
}

export interface Stroke {
  points: Array<{ x: number; y: number }>;
  pressure?: number;
}

export interface PachecoSymbol {
  id: SymbolId;
  strokes: Stroke[]; // user’s drawn symbol
  lanePreferred?: LaneId;
  rhythmProfile?: number[];
  pitchProfile?: string;
  textureProfile?: string;
  category?: string;
  fingerprint?: Fingerprint;
}

export interface Lane {
  id: LaneId;
  z: number; // vertical order, high=top
  visible: boolean;
}

export interface LineState {
  lineCount: number; // 0, 1, 2, 3, 5
  active: boolean;
}

export interface NotationRenderSettings {
  slider: number; // 0–100
  showLines: boolean;
  showStaff: boolean;
  showNoteheads: boolean;
  snapPitch: boolean;
  snapRhythm: boolean;
}

export interface DiaryEntry {
  id: string;
  type: string;
  timestamp: Timestamp;
  payload: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface SubtitleRenderData {
  lanes: LaneRenderData[];
}

export interface LaneRenderData {
  laneId: LaneId;
  events: {
    eventId: EventId;
    x: number; // horizontal position
    y: number; // vertical
    symbolId: SymbolId | null;
    pitchPath?: { x: number; y: number }[];
  }[];
}
