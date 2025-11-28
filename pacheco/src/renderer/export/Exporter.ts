import { DiaryEntry, LineState, NotationRenderSettings, PachecoSymbol } from '../types';

export interface ExportBundle {
  line?: LineState;
  render?: NotationRenderSettings;
  symbols?: PachecoSymbol[];
  diary?: DiaryEntry[];
}

export function exportToJson(bundle: ExportBundle): string {
  return JSON.stringify(bundle);
}
