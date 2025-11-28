import { LineState, NotationRenderSettings } from '../types';

const LINE_KEY = 'pacheco-line-state';
const RENDER_KEY = 'pacheco-render-settings';

export const Persistence = {
  saveLineState(state: LineState) {
    localStorage.setItem(LINE_KEY, JSON.stringify(state));
  },
  loadLineState(): LineState | undefined {
    const raw = localStorage.getItem(LINE_KEY);
    return raw ? (JSON.parse(raw) as LineState) : undefined;
  },
  saveRenderSettings(settings: NotationRenderSettings) {
    localStorage.setItem(RENDER_KEY, JSON.stringify(settings));
  },
  loadRenderSettings(): NotationRenderSettings | undefined {
    const raw = localStorage.getItem(RENDER_KEY);
    return raw ? (JSON.parse(raw) as NotationRenderSettings) : undefined;
  },
};
