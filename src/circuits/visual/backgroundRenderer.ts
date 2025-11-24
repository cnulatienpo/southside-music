import { CircuitsBackground } from "./backgroundRegistry";

export interface RenderInstruction {
  layerId: string;
  artHint: string;
  parallax: number;
  ambient: string[];
}

interface RendererOptions {
  ui: any;
}

export class BackgroundRenderer {
  private readonly ui: any;

  constructor(options: RendererOptions) {
    this.ui = options.ui;
  }

  render(background: CircuitsBackground): RenderInstruction[] {
    const ambient = background.ambient ?? [];
    const instructions = background.layers.map((layer) => ({
      layerId: layer.id,
      artHint: layer.artHint,
      parallax: typeof layer.parallax === "number" ? layer.parallax : 0,
      ambient,
    }));

    if (this.ui && typeof this.ui.onRenderBackground === "function") {
      this.ui.onRenderBackground({
        id: background.id,
        name: background.name,
        layers: instructions,
        ambient,
      });
    }

    return instructions;
  }

  clear(): void {
    if (this.ui && typeof this.ui.onClearBackground === "function") {
      this.ui.onClearBackground();
    }
  }
}
