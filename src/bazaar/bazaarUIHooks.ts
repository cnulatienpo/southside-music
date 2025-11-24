import { BazaarEngine, BazaarStallData, SamplePayload } from "./bazaarEngine";

export interface BazaarUIHooks {
  onRenderStall: (stallData: BazaarStallData) => void;
  onRenderExplanation: (text: string) => void;
  onRenderConnections: (list: string[]) => void;
  onRenderSample: (samplePayload: SamplePayload) => void;
  onError: (text: string) => void;
  onClear: () => void;
}

export class BazaarUI {
  private engine: BazaarEngine;
  private hooks: BazaarUIHooks;

  constructor(engine: BazaarEngine, hooks: BazaarUIHooks) {
    this.engine = engine;
    this.hooks = hooks;
  }

  async travelToStall(stallId: string): Promise<void> {
    try {
      this.hooks.onClear();
      const stallData = await this.engine.enterStall(stallId);
      this.hooks.onRenderStall(stallData);
    } catch (error) {
      console.error(error);
      this.hooks.onError("The aisle is blocked. Try squeezing through again.");
    }
  }

  async ask(stallId: string, topic: string): Promise<void> {
    try {
      const text = await this.engine.askAbout(stallId, topic);
      this.hooks.onRenderExplanation(text);
    } catch (error) {
      console.error(error);
      this.hooks.onError("Vendors are talking over each other—ask again in a sec.");
    }
  }

  async pullConnections(stallId: string): Promise<void> {
    try {
      const list = await this.engine.getConnections(stallId);
      this.hooks.onRenderConnections(list);
    } catch (error) {
      console.error(error);
      this.hooks.onError("The map blew away—refresh for new connections.");
    }
  }

  async sample(stallId: string, element: string): Promise<void> {
    try {
      const samplePayload = await this.engine.sampleStallSound(stallId, element);
      this.hooks.onRenderSample(samplePayload);
    } catch (error) {
      console.error(error);
      this.hooks.onError("The cable crackled—couldn't grab that sound.");
    }
  }
}
