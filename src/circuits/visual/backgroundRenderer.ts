import type { CircuitsBackground } from "./backgroundRegistry";

export interface RenderInstruction {
  layerId: string;
  artHint: string;
  parallax: number;
  ambient: string[];
}

export class BackgroundRenderer {
  private ui: any;
  private lastRender: RenderInstruction[] = [];

  constructor(options: { ui: any }) {
    this.ui = options.ui;
  }

  render(background: CircuitsBackground): RenderInstruction[] {
    this.lastRender = background.layers.map((layer) => ({
      layerId: layer.id,
      artHint: layer.artHint,
      parallax: typeof layer.parallax === "number" ? layer.parallax : 0,
      ambient: background.ambient,
    }));

    if (this.ui && typeof this.ui.onBackgroundRender === "function") {
      this.ui.onBackgroundRender(this.lastRender);
    }

    return this.lastRender;
  }

  clear(): void {
    this.lastRender = [];
    if (this.ui && typeof this.ui.onBackgroundClear === "function") {
      this.ui.onBackgroundClear();
    }
  }
}
