import { LineState, NotationRenderSettings } from '../types';
import { Persistence } from './Persistence';
import { StateManager } from './StateManager';

export class PachecoStateManager {
  private manager = new StateManager();

  constructor() {
    const storedLine = Persistence.loadLineState();
    const storedRender = Persistence.loadRenderSettings();
    if (storedLine) {
      this.manager.setLineState(storedLine);
    }
    if (storedRender) {
      this.manager.setRenderSettings(storedRender);
    }
    this.manager.on('state-changed', (state) => {
      if (state.line) Persistence.saveLineState(state.line);
      if (state.render) Persistence.saveRenderSettings(state.render);
    });
  }

  updateLine(state: LineState) {
    this.manager.setLineState(state);
  }

  updateRender(settings: NotationRenderSettings) {
    this.manager.setRenderSettings(settings);
  }

  getSnapshot() {
    return {
      line: this.manager.getLineState(),
      render: this.manager.getRenderSettings(),
    };
  }
}
