import { TapInput } from './interactions/tapInput';
import { SliderInput } from './interactions/sliderInput';
import { DialInput } from './interactions/dialInput';
import { GestureInput } from './interactions/gestureInput';
import { PadGrid } from './interactions/padGrid';
import { TextInput } from './interactions/textInput';
import { MicInputStub } from './interactions/micInputStub';

type CircuitToolId = string;
type CircuitsUI = any;
type CircuitsToolExposure = any;
type CircuitScene = { id: string };

export class CircuitsActionRouter {
  private ui: CircuitsUI;
  private toolExposure: CircuitsToolExposure;

  constructor(options: { ui: CircuitsUI; toolExposure: CircuitsToolExposure }) {
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
    | MicInputStub {
    switch (toolId) {
      case 'tap':
        return new TapInput();
      case 'slider':
        return new SliderInput({ min: 0, max: 1, initial: 0.5 });
      case 'dial':
        return new DialInput({ min: 0, max: 1, initial: 0.5 });
      case 'gesture':
        return new GestureInput();
      case 'pad-grid':
        return new PadGrid(2, 2);
      case 'text':
        return new TextInput();
      case 'mic':
      default:
        return new MicInputStub();
    }
  }

  routeAction(scene: CircuitScene, toolId: CircuitToolId, action: any): {
    sceneId: string;
    toolId: CircuitToolId;
    action: any;
    timestamp: number;
  } {
    const timestamp = Date.now();
    return {
      sceneId: scene.id,
      toolId,
      action,
      timestamp,
    };
  }
}
