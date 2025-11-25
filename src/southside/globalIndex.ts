import { LabEngine } from "../lab/labEngine";
import { DojoEngine } from "../dojo/dojoEngine";
import { GardenEngine } from "../garden/gardenEngine";
import { BazaarEngine } from "../bazaar/bazaarEngine";
import { ArchiveEngine } from "../archives/archiveEngine";
import { CircuitsRuntime } from "../circuits/circuitsRuntime";
import { CircuitsUI } from "../circuits/circuitsUIHooks";
import { CircuitsToolExposure } from "../circuits/circuitsToolExposure";
import { NPCDialogueEngine } from "../circuits/npcDialogueEngine";
import { BackgroundRenderer } from "../circuits/visual/backgroundRenderer";
import type { CircuitTopic } from "../circuits/circuitsTypes";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import { loadConfig, SouthsideConfig } from "./globalConfig";
import { AIProtocol } from "./aiProtocol";
import type { SouthsideEngineName } from "./sharedTypes";

class TheftEngine {}
class SongBuilderEngine {}
class DeepSeekPromptBuilder {}
class SceneProgressionEngine {}
class HubUI {
  open(): void {}
}

export const SouthsideRegistry = {
  engines: {
    lab: LabEngine,
    dojo: DojoEngine,
    garden: GardenEngine,
    bazaar: BazaarEngine,
    theft: TheftEngine,
    songbuilder: SongBuilderEngine,
    archive: ArchiveEngine,
    circuits: CircuitsRuntime,
    npc: NPCDialogueEngine,
    story: SceneProgressionEngine,
  },
  ui: {
    circuits: CircuitsUI,
    hub: HubUI,
    backgrounds: BackgroundRenderer,
  },
  data: {
    toolExposure: CircuitsToolExposure,
    storyChains: SceneProgressionEngine,
  },
};

export class SouthsideApp {
  private readonly userId: string;
  private readonly store: UserDataStore;
  private readonly deepSeek: DeepSeekEngine;
  private readonly config: SouthsideConfig;
  private readonly aiProtocol: AIProtocol;

  private readonly toolExposure: CircuitsToolExposure;
  private circuitsRuntime: CircuitsRuntime | null = null;
  private readonly hubUi: HubUI;

  constructor(options: { userId: string; store: UserDataStore; deepSeek: DeepSeekEngine }) {
    this.userId = options.userId;
    this.store = options.store;
    this.deepSeek = options.deepSeek;
    this.config = loadConfig();
    this.aiProtocol = new AIProtocol(this.config);
    this.toolExposure = new CircuitsToolExposure({ userId: this.userId, store: this.store });
    this.hubUi = new HubUI();
  }

  async initAll(): Promise<void> {
    await this.toolExposure.loadExposure();
    await this.preloadBackgrounds();
    this.initializeCircuits();
  }

  async startHub(): Promise<void> {
    this.hubUi.open();
  }

  async startCircuits(topic: CircuitTopic): Promise<void> {
    if (!this.circuitsRuntime) {
      this.initializeCircuits();
    }

    const context = {
      topic,
      level: "basic" as const,
      seenTools: this.toolExposure.getSeenTools(),
    };

    await this.circuitsRuntime?.start(topic, context);
  }

  getEngine(name: keyof typeof SouthsideRegistry["engines"]): any {
    const mapping = SouthsideRegistry.engines[name as SouthsideEngineName];
    return mapping ?? null;
  }

  getConfig(): SouthsideConfig {
    return this.config;
  }

  getAIProtocol(): AIProtocol {
    return this.aiProtocol;
  }

  getDeepSeek(): DeepSeekEngine {
    return this.deepSeek;
  }

  private initializeCircuits(): void {
    const circuitsUi = new CircuitsUI({
      onRenderScene: () => {},
      onRenderNPC: () => {},
      onRenderSetting: () => {},
      onRenderExcuse: () => {},
      onRenderTools: () => {},
      onRenderChoices: () => {},
      onPlayerChosen: () => {},
      onClear: () => {},
      onBackgroundRender: () => {},
      onBackgroundClear: () => {},
    });

    const backgroundRenderer = new BackgroundRenderer({ ui: circuitsUi });
    backgroundRenderer.render(this.config.locationsRegistry[0] ?? {
      id: "hub",
      name: "Hub Hallway",
      description: "",
      layers: [],
      ambient: [],
    });

    const circuitsEngine: any = {
      selectSceneForTopic: async () =>
        this.config.scenesRegistry[0] ?? {
          id: "placeholder",
          topic: "free-roam",
          npcDescription: "",
          settingText: "",
          excuse: "",
          constraint: { requiredTools: [], optionalTools: [] },
          choices: [],
        },
      logSceneExit: async () => {},
    };

    this.circuitsRuntime = new CircuitsRuntime({
      engine: circuitsEngine,
      ui: circuitsUi,
      toolExposure: this.toolExposure,
      userId: this.userId,
    });
  }

  private async preloadBackgrounds(): Promise<void> {
    const renderer = new BackgroundRenderer({ ui: null });
    this.config.locationsRegistry.forEach((location) => renderer.render(location));
    renderer.clear();
  }
}
