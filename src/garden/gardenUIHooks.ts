export interface GardenUIHooks {
  onRenderSeed?(seedPayload: unknown): void;
  onRenderVisualUpdate?(visualModel: unknown): void;
  onRenderAudioUpdate?(audioModel: unknown): void;
  onRenderSoundworldElement?(element: unknown): void;
  onFollowUp?(text: string): void;
  onClear?(): void;
}

export class GardenUI {
  private hooks: GardenUIHooks;

  constructor(hooks?: GardenUIHooks) {
    this.hooks = hooks ?? {};
  }

  renderSeed(seedPayload: unknown): void {
    this.hooks.onRenderSeed?.(seedPayload);
  }

  renderVisualUpdate(visualModel: unknown): void {
    this.hooks.onRenderVisualUpdate?.(visualModel);
  }

  renderAudioUpdate(audioModel: unknown): void {
    this.hooks.onRenderAudioUpdate?.(audioModel);
  }

  renderSoundworldElement(element: unknown): void {
    this.hooks.onRenderSoundworldElement?.(element);
  }

  deliverFollowUp(text: string): void {
    this.hooks.onFollowUp?.(text);
  }

  clear(): void {
    this.hooks.onClear?.();
  }
}
