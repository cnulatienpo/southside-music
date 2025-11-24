export interface SceneLayout {
  npcPosition: { x: number; y: number };
  settingTextPosition: { x: number; y: number };
  excusePosition: { x: number; y: number };
  toolRegion: { x: number; y: number; width: number; height: number };
  choiceRegion: { x: number; y: number };
}

export interface CircuitScene {
  id: string;
  npcSide?: "left" | "right";
  emphasisSide?: "left" | "right";
}

export class SceneLayoutEngine {
  private viewportWidth: number;
  private viewportHeight: number;

  constructor(width = 1280, height = 720) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  computeLayout(scene: CircuitScene): SceneLayout {
    const npcSide = scene.npcSide || scene.emphasisSide || "left";
    const npcX = npcSide === "left" ? this.viewportWidth * 0.25 : this.viewportWidth * 0.75;
    const npcY = this.viewportHeight * 0.6;

    const settingTextPosition = { x: this.viewportWidth * 0.05, y: this.viewportHeight * 0.08 };
    const excusePosition = { x: this.viewportWidth * 0.08, y: this.viewportHeight * 0.45 };
    const toolRegion = {
      x: this.viewportWidth * 0.2,
      y: this.viewportHeight * 0.62,
      width: this.viewportWidth * 0.6,
      height: this.viewportHeight * 0.22,
    };
    const choiceRegion = { x: this.viewportWidth * 0.5, y: this.viewportHeight * 0.9 };

    return {
      npcPosition: { x: npcX, y: npcY },
      settingTextPosition,
      excusePosition,
      toolRegion,
      choiceRegion,
    };
  }

  updateViewport(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }
}
