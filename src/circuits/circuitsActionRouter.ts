import { TapInput } from "./interactions/tapInput";
import { SliderInput } from "./interactions/sliderInput";
import { DialInput } from "./interactions/dialInput";
import { GestureInput } from "./interactions/gestureInput";
import { PadGrid } from "./interactions/padGrid";
import { TextInput } from "./interactions/textInput";
import { MicInputStub } from "./interactions/micInputStub";

export type CircuitToolId = string;
export interface CircuitScene {
  id: string;
}

export interface CircuitsUI {
  // Placeholder for UI-specific hooks; intentionally minimal for zero-grading flow.
}

export interface CircuitsToolExposure {
  isToolAvailable(toolId: CircuitToolId): boolean;
}

interface RouterOptions {
  ui: CircuitsUI;
  toolExposure: CircuitsToolExposure;
}

export class CircuitsActionRouter {
  private readonly ui: CircuitsUI;
  private readonly toolExposure: CircuitsToolExposure;

  constructor(options: RouterOptions) {
    this.ui = options.ui;
    this.toolExposure = options.toolExposure;
  }

  getInteractionForTool(toolId: CircuitToolId):
    | TapInput
    | SliderInput
    | DialInput
    | GestureInput
    | PadGrid
    | TextInput
    | MicInputStub
    | null {
    if (!this.toolExposure.isToolAvailable(toolId)) {
      return null;
    }

    switch (toolId) {
      case "tap":
        return new TapInput();
      case "slider":
        return new SliderInput({ min: 0, max: 1, initial: 0.5 });
      case "dial":
        return new DialInput({ min: 0, max: 1, initial: 0.5 });
      case "gesture":
        return new GestureInput();
      case "pad-grid":
        return new PadGrid(2, 2);
      case "text":
        return new TextInput();
      case "mic":
        return new MicInputStub();
      default:
        return new TextInput();
    }
  }

  routeAction(scene: CircuitScene, toolId: CircuitToolId, action: unknown): {
    sceneId: string;
    toolId: CircuitToolId;
    action: unknown;
    timestamp: number;
  } {
    return {
      sceneId: scene.id,
      toolId,
      action,
      timestamp: Date.now(),
    };
  }
}
