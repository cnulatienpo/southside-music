export interface LabUIHooks {
  onRenderExperiment: (concept: string, payload: Record<string, any>) => void;
  onTheoryNudge: (text: string) => void;
  onPopupWarning: (text: string) => void;
  onClear: () => void;
}

export class LabUI {
  private hooks: LabUIHooks;

  constructor(hooks: LabUIHooks) {
    this.hooks = hooks;
  }

  public renderExperiment(concept: string, payload: Record<string, any>): void {
    this.hooks.onRenderExperiment(concept, payload);
  }

  public pushTheoryNudge(text: string): void {
    this.hooks.onTheoryNudge(text);
  }

  public popupWarning(text: string): void {
    this.hooks.onPopupWarning(text);
  }

  public clear(): void {
    this.hooks.onClear();
  }
}
