import { NotationRenderSettings } from "../events/EventTypes";

export class LineEvolutionEngine {
  private stage = 0;

  advance(settings: NotationRenderSettings): NotationRenderSettings {
    this.stage = Math.min(this.stage + 1, 5);
    const showLines = this.stage > 0;
    const showStaff = this.stage >= 5;
    return {
      ...settings,
      showLines,
      showStaff,
      showRealNoteheads: showStaff,
    };
  }

  getStage() {
    return this.stage;
  }
}
