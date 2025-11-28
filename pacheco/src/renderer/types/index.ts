export interface PachecoEvent {
  id: string;
  timestamp: number;
  type: string;
  payload: Record<string, unknown>;
}

export interface PachecoSymbol {
  id: string;
  name: string;
  description?: string;
  data?: Record<string, unknown>;
}

export interface Lane {
  id: string;
  label: string;
  events: PachecoEvent[];
}

export interface LineState {
  id: string;
  lanes: Lane[];
  revision: number;
}

export interface NotationRenderSettings {
  zoom: number;
  showGrid: boolean;
  highlightLane?: string;
}

export interface DiaryEntry {
  id: string;
  createdAt: number;
  message: string;
}
