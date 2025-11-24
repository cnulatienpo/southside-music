export interface EarTrainingVisualDesignOptions {
  onRenderPrompt?: (text: string) => void;
  onRenderFollowUp?: (text: string) => void;
  onRenderAcknowledgement?: (text: string) => void;
  onRenderTermIntro?: (term: string) => void;
  onRenderExerciseVisual?: (payload: any) => void;
  onClear?: () => void;
}

/**
 * Platform-agnostic visual design surface for ear training flows.
 * Rendering is delegated to consumer-provided callbacks, keeping the tone
 * friendly and pressure-free.
 */
export class EarTrainingVisualDesign {
  private readonly options: EarTrainingVisualDesignOptions;

  constructor(options: EarTrainingVisualDesignOptions = {}) {
    this.options = { ...options };
  }

  renderPrompt(text: string): void {
    try {
      this.options.onRenderPrompt?.(text);
    } catch (error) {
      console.error("EarTrainingVisualDesign.renderPrompt error", error);
    }
  }

  renderFollowUp(text: string): void {
    try {
      this.options.onRenderFollowUp?.(text);
    } catch (error) {
      console.error("EarTrainingVisualDesign.renderFollowUp error", error);
    }
  }

  renderAcknowledgement(text: string): void {
    try {
      this.options.onRenderAcknowledgement?.(text);
    } catch (error) {
      console.error("EarTrainingVisualDesign.renderAcknowledgement error", error);
    }
  }

  renderTermIntro(term: string): void {
    try {
      this.options.onRenderTermIntro?.(term);
    } catch (error) {
      console.error("EarTrainingVisualDesign.renderTermIntro error", error);
    }
  }

  renderExerciseVisual(payload: any): void {
    try {
      this.options.onRenderExerciseVisual?.(payload);
    } catch (error) {
      console.error("EarTrainingVisualDesign.renderExerciseVisual error", error);
    }
  }

  clear(): void {
    try {
      this.options.onClear?.();
    } catch (error) {
      console.error("EarTrainingVisualDesign.clear error", error);
    }
  }
}
