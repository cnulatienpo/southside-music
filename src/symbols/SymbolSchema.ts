export interface Stroke {
  points: Array<{ x: number; y: number }>;
  pressure?: number;
}

export interface PachecoSymbol {
  id: string;
  strokes: Stroke[];
  lanePreferred?: string;
  rhythmProfile?: number[];
  pitchProfile?: string;
  textureProfile?: string;
  category?: string;
  fingerprint?: string;
}
