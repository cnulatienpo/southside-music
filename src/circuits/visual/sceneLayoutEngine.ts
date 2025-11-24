import { CircuitScene } from "../circuitsTypes";

export interface SceneLayout {
  npcPosition: { x: number; y: number };
  settingTextPosition: { x: number; y: number };
  excusePosition: { x: number; y: number };
  toolRegion: { x: number; y: number; width: number; height: number };
  choiceRegion: { x: number; y: number };
}

export class SceneLayoutEngine {
  private viewportWidth: number;
  private viewportHeight: number;

  constructor(width: number = 1280, height: number = 720) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  computeLayout(scene: CircuitScene): SceneLayout {
    const npcSide = this.resolveSide(scene);
    const npcX = npcSide === "right" ? this.viewportWidth * 0.72 : this.viewportWidth * 0.22;
    const npcY = this.viewportHeight * 0.52;

    const settingTextPosition = {
      x: this.viewportWidth * 0.05,
      y: this.viewportHeight * 0.08,
    };

    const excusePosition = {
      x: this.viewportWidth * 0.07,
      y: this.viewportHeight * 0.45,
    };

    const toolRegion = {
      x: this.viewportWidth * 0.2,
      y: this.viewportHeight * 0.62,
      width: this.viewportWidth * 0.6,
      height: this.viewportHeight * 0.18,
    };

    const choiceRegion = {
      x: this.viewportWidth * 0.5,
      y: this.viewportHeight * 0.88,
    };

    return {
      npcPosition: { x: npcX, y: npcY },
      settingTextPosition,
      excusePosition,
      toolRegion,
      choiceRegion,
    };
  }

  updateViewport(w: number, h: number) {
    this.viewportWidth = w;
    this.viewportHeight = h;
  }

  private resolveSide(scene: CircuitScene): "left" | "right" {
    const metadataSide = (scene.metadata as any)?.npcSide;
    if (metadataSide === "left" || metadataSide === "right") {
      return metadataSide;
    }

    const idValue = scene.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return idValue % 2 === 0 ? "left" : "right";
  }
}
