export interface DojoUIHooks {
  onRenderDrillPrompt(promptText: string): Promise<void>;
  onRenderFollowUp(text: string): Promise<void>;
  onRenderAcknowledgement(text: string): Promise<void>;
  onRenderDrillVisualization(payload: Record<string, any>): Promise<void>;
  onClear(): Promise<void>;
}

export class DojoUI implements DojoUIHooks {
  public async onRenderDrillPrompt(): Promise<void> {
    return Promise.resolve();
  }

  public async onRenderFollowUp(): Promise<void> {
    return Promise.resolve();
  }

  public async onRenderAcknowledgement(): Promise<void> {
    return Promise.resolve();
  }

  public async onRenderDrillVisualization(): Promise<void> {
    return Promise.resolve();
  }

  public async onClear(): Promise<void> {
    return Promise.resolve();
  }
}
