export interface PachecoEvent {
  id: string;
  timestamp: number;
  laneId: string;
  rhythmProfile?: number[];
  pitchProfile?: string;
  textureProfile?: string;
  symbolId?: string;
  patternFingerprint?: string;
}

export interface Lane {
  id: string;
  zOrder: number;
  name: string;
  visible: boolean;
}

export interface NotationRenderSettings {
  sliderLevel: number; // 0-100
  showLines: boolean;
  showStaff: boolean;
  showRealNoteheads: boolean;
  showUserSymbols: boolean;
  snapPitch: boolean;
  snapRhythm: boolean;
}
