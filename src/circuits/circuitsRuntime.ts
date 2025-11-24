import { CircuitsEngine } from "./circuitsEngine";
import { CircuitsToolExposure } from "./circuitsToolExposure";
import { CircuitsUI } from "./circuitsUIHooks";
import {
  CircuitChoice,
  CircuitContext,
  CircuitScene,
  CircuitTopic,
  CircuitToolId,
} from "./circuitsTypes";

export class CircuitsRuntime {
  private readonly engine: CircuitsEngine;
  private readonly ui: CircuitsUI;
  private readonly toolExposure: CircuitsToolExposure;
  private readonly userId: string;

  private currentScene: CircuitScene | null = null;
  private currentContext: CircuitContext | null = null;

  constructor(options: {
    engine: CircuitsEngine;
    ui: CircuitsUI;
    toolExposure: CircuitsToolExposure;
    userId: string;
  }) {
    this.engine = options.engine;
    this.ui = options.ui;
    this.toolExposure = options.toolExposure;
    this.userId = options.userId;
  }

  async start(topic: CircuitTopic, context: CircuitContext): Promise<void> {
    await this.toolExposure.loadExposure();
    this.currentContext = context;
    const scene = await this.engine.selectSceneForTopic(topic, context);
    this.currentScene = scene;

    this.ui.onRenderScene(scene);
    this.ui.onRenderNPC(scene.npcDescription);
    this.ui.onRenderSetting(scene.settingText);
    this.ui.onRenderExcuse(scene.excuse);

    const toolsToShow = this.getVisibleTools(scene.constraint.optionalTools, scene.constraint.requiredTools);
    this.ui.onRenderTools(toolsToShow);
    await Promise.all(toolsToShow.map((tool) => this.toolExposure.markSeen(tool)));

    this.ui.onRenderChoices(scene.choices);
  }

  async choose(choice: CircuitChoice): Promise<void> {
    if (this.currentScene) {
      await this.engine.logSceneExit({
        userId: this.userId,
        scene: this.currentScene,
        choice,
        context: this.currentContext ?? undefined,
      });
    }

    this.ui.onPlayerChosen(choice);
    this.ui.onClear();

    const seenTools = this.toolExposure.getSeenTools();
    const nextContext: CircuitContext = {
      topic: choice.nextTopic,
      level: this.deriveLevelFromExposure(seenTools),
      seenTools,
      previousSceneId: this.currentScene?.id,
      previousChoiceId: choice.id,
    };

    await this.start(choice.nextTopic, nextContext);
  }

  private deriveLevelFromExposure(seenTools: CircuitToolId[]): CircuitContext["level"] {
    if (seenTools.length < 3) {
      return "basic";
    }
    if (seenTools.length < 8) {
      return "intermediate";
    }
    return "advanced";
  }

  private getVisibleTools(
    optionalTools: CircuitToolId[] | undefined,
    requiredTools: CircuitToolId[]
  ): CircuitToolId[] {
    const visible = new Set<CircuitToolId>();
    const seenTools = new Set(this.toolExposure.getSeenTools());

    requiredTools.forEach((tool) => visible.add(tool));
    optionalTools?.forEach((tool) => {
      if (seenTools.has(tool)) {
        visible.add(tool);
      }
    });

    return Array.from(visible);
  }
}
