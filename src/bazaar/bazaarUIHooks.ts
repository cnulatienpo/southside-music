import { BazaarEngine, BazaarStallData, SamplePayload } from "./bazaarEngine";

export interface BazaarUIHooks {
  onRenderStall?: (stallData: BazaarStallData) => void;
  onRenderExplanation?: (text: string) => void;
  onRenderConnections?: (list: string[]) => void;
  onRenderSample?: (samplePayload: SamplePayload) => void;
  onError?: (text: string) => void;
  onClear?: () => void;
}

export class BazaarUI {
  private readonly engine: BazaarEngine;

  private readonly hooks: BazaarUIHooks;

  constructor(engine: BazaarEngine, hooks: BazaarUIHooks) {
    this.engine = engine;
    this.hooks = hooks;
  }

  public async viewStall(stallId: string): Promise<void> {
    await this.safeExecute(async () => {
      const stall = await this.engine.enterStall(stallId);
      this.hooks.onClear?.();
      this.hooks.onRenderStall?.(stall);
    });
  }

  public async ask(stallId: string, topic: string): Promise<void> {
    await this.safeExecute(async () => {
      const answer = await this.engine.askAbout(stallId, topic);
      this.hooks.onRenderExplanation?.(answer);
    });
  }

  public async playConnections(stallId: string): Promise<void> {
    await this.safeExecute(async () => {
      const connections = await this.engine.getConnections(stallId);
      this.hooks.onRenderConnections?.(connections);
    });
  }

  public async sample(stallId: string, element: string): Promise<void> {
    await this.safeExecute(async () => {
      const payload = await this.engine.sampleStallSound(stallId, element);
      this.hooks.onRenderSample?.(payload);
    });
  }

  public clear(): void {
    this.hooks.onClear?.();
  }

  private async safeExecute(operation: () => Promise<void>): Promise<void> {
    try {
      await operation();
    } catch (error) {
      console.error("Bazaar UI operation failed", error);
      this.hooks.onError?.("The bazaar got noisy. Try that again.");
    }
  }
}
