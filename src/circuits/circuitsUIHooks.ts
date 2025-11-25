import { CircuitChoice, CircuitScene, CircuitToolId } from "./circuitsTypes";

export interface CircuitsUIHooks {
  onRenderScene?(scene: CircuitScene): void;
  onRenderNPC?(text: string): void;
  onRenderSetting?(text: string): void;
  onRenderExcuse?(text: string): void;
  onRenderTools?(tools: CircuitToolId[]): void;
  onRenderChoices?(choices: CircuitChoice[]): void;
  onPlayerChosen?(choice: CircuitChoice): void;
  onClear?(): void;
  onBackgroundRender?(): void;
  onBackgroundClear?(): void;
}

const noop = () => {};

export class CircuitsUI implements CircuitsUIHooks {
  private readonly hooks: CircuitsUIHooks;

  constructor(hooks: CircuitsUIHooks) {
    this.hooks = hooks;
  }

  onRenderScene(scene: CircuitScene): void {
    (this.hooks.onRenderScene ?? noop)(scene);
  }

  onRenderNPC(text: string): void {
    (this.hooks.onRenderNPC ?? noop)(text);
  }

  onRenderSetting(text: string): void {
    (this.hooks.onRenderSetting ?? noop)(text);
  }

  onRenderExcuse(text: string): void {
    (this.hooks.onRenderExcuse ?? noop)(text);
  }

  onRenderTools(tools: CircuitToolId[]): void {
    (this.hooks.onRenderTools ?? noop)(tools);
  }

  onRenderChoices(choices: CircuitChoice[]): void {
    (this.hooks.onRenderChoices ?? noop)(choices);
  }

  onPlayerChosen(choice: CircuitChoice): void {
    (this.hooks.onPlayerChosen ?? noop)(choice);
  }

  onClear(): void {
    (this.hooks.onClear ?? noop)();
  }

  onBackgroundRender(): void {
    (this.hooks.onBackgroundRender ?? noop)();
  }

  onBackgroundClear(): void {
    (this.hooks.onBackgroundClear ?? noop)();
  }
}
