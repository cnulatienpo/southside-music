import { DiaryEntry, LineState, NotationRenderSettings, PachecoSymbol } from '../types';

export interface ImportResult {
  line?: LineState;
  render?: NotationRenderSettings;
  symbols?: PachecoSymbol[];
  diary?: DiaryEntry[];
}

export function importFromJson(payload: string): ImportResult {
  try {
    const parsed = JSON.parse(payload) as ImportResult;
    return parsed;
  } catch (err) {
    console.error('import failed', err);
    return {};
  }
}
