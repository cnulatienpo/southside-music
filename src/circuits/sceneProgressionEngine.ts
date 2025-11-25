import { CircuitsEngine } from "./circuitsEngine";
import { CircuitsRuntime } from "./circuitsRuntime";
import { CircuitsToolExposure } from "./circuitsToolExposure";
import {
  CircuitChoice,
  CircuitContext,
  CircuitScene,
  CircuitTopic,
} from "./circuitsTypes";
import { StoryChainDefinition, loadStoryChains } from "./storyChainRegistry";
import { UserDataStore } from "../data/userDataStore";
import { nanoid } from "nanoid";

const SEEN_SCENES_KEY = "circuits_seen_scenes";
const TOPIC_VISITS_KEY = "circuits_topic_visits";

type SeenScenesRecord = Record<string, string[]>;
type TopicVisitsRecord = Record<string, Record<string, number>>;
type SceneSource = {
  getScenesForTopic?: (topic: CircuitTopic) => CircuitScene[];
  listScenesForTopic?: (topic: CircuitTopic) => CircuitScene[];
};

export class SceneProgressionEngine implements CircuitsEngine {
  private readonly userId: string;
  private readonly store: UserDataStore;
  private readonly circuitsEngine: CircuitsEngine;
  private readonly runtime: CircuitsRuntime;
  private readonly toolExposure: CircuitsToolExposure;

  private storyChains: StoryChainDefinition[] = [];
  private seenScenes: Set<string> = new Set();
  private topicVisits: Map<CircuitTopic, number> = new Map();
  private pendingScene: CircuitScene | null = null;
  private recentScenes: string[] = [];

  constructor(options: {
    userId: string;
    store: UserDataStore;
    circuitsEngine: CircuitsEngine;
    runtime: CircuitsRuntime;
    toolExposure: CircuitsToolExposure;
  }) {
    this.userId = options.userId;
    this.store = options.store;
    this.circuitsEngine = options.circuitsEngine;
    this.runtime = options.runtime;
    this.toolExposure = options.toolExposure;
  }

  async init(): Promise<void> {
    this.storyChains = loadStoryChains();
    const seenScenesRecord =
      (await this.store.getCustomData<SeenScenesRecord>(SEEN_SCENES_KEY)) ?? {};
    const topicVisitsRecord =
      (await this.store.getCustomData<TopicVisitsRecord>(TOPIC_VISITS_KEY)) ?? {};

    this.seenScenes = new Set(seenScenesRecord[this.userId] ?? []);
    const visits = topicVisitsRecord[this.userId] ?? {};
    this.topicVisits = new Map(Object.entries(visits));
  }

  async startAtTopic(topic: CircuitTopic): Promise<void> {
    const context = await this.buildContext(topic);
    const nextScene = this.selectNextScene(topic, context);
    this.pendingScene = nextScene;

    await this.runtime.start(topic, context);
  }

  async handleChoice(choice: CircuitChoice): Promise<void> {
    this.logChoice(choice);
    this.bumpTopicVisit(choice.nextTopic);

    const nextContext = await this.buildContext(choice.nextTopic, choice);
    const nextScene = this.selectNextScene(choice.nextTopic, nextContext);
    this.pendingScene = nextScene;

    await this.runtime.start(choice.nextTopic, nextContext);
  }

  getSeenScenes(): string[] {
    return Array.from(this.seenScenes);
  }

  async selectSceneForTopic(topic: CircuitTopic, context: CircuitContext): Promise<CircuitScene> {
    const scene =
      this.pendingScene ?? this.selectNextScene(topic, context) ?? (await this.circuitsEngine.selectSceneForTopic(topic, context));
    this.pendingScene = null;
    this.markSceneSeen(scene);
    this.bumpTopicVisit(topic);
    return scene;
  }

  async logSceneExit(params: {
    userId: string;
    scene: CircuitScene;
    choice: CircuitChoice;
    context?: CircuitContext | undefined;
  }): Promise<void> {
    if (typeof this.circuitsEngine.logSceneExit === "function") {
      await this.circuitsEngine.logSceneExit(params);
    }
  }

  private selectNextScene(topic: CircuitTopic, context?: CircuitContext): CircuitScene | null {
    const scenes = this.getScenesForTopic(topic);

    if (!scenes.length) {
      return null;
    }

    const candidates = this.filterRecentlySeen(scenes);
    const weighted = candidates.map((scene) => {
      const baseWeight = this.seenScenes.has(scene.id) ? 0.6 : 1.4;
      const chainBoost = this.computeChainBoost(scene.id);
      const topicBoost = this.computeTopicBoost(topic);
      return {
        scene,
        weight: Math.max(0.1, baseWeight + chainBoost + topicBoost),
      };
    });

    const totalWeight = weighted.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const entry of weighted) {
      roll -= entry.weight;
      if (roll <= 0) {
        return entry.scene;
      }
    }

    return weighted[weighted.length - 1]?.scene ?? null;
  }

  private markSceneSeen(scene: CircuitScene): void {
    if (!scene) {
      return;
    }

    this.seenScenes.add(scene.id);
    this.recentScenes = [...this.recentScenes, scene.id].slice(-5);
    void this.persistSeenScenes();
  }

  private computeChainBoost(sceneId: string): number {
    let boost = 0;

    for (const chain of this.storyChains) {
      const index = chain.steps.findIndex((step) => step.sceneId === sceneId);
      if (index === -1) {
        continue;
      }

      const allPreviousSeen = chain.steps
        .slice(0, index)
        .every((step) => this.seenScenes.has(step.sceneId));
      const alreadySeen = this.seenScenes.has(sceneId);

      if (allPreviousSeen && !alreadySeen) {
        boost += 2;
      } else if (allPreviousSeen && alreadySeen) {
        boost += 0.5;
      } else if (!alreadySeen && index === 0) {
        boost += 0.75;
      }
    }

    return boost;
  }

  private computeTopicBoost(topic: CircuitTopic): number {
    const visits = this.topicVisits.get(topic) ?? 0;
    if (visits === 0) {
      return 0.5;
    }
    if (visits < 3) {
      return 0.1;
    }
    return 0;
  }

  private filterRecentlySeen(scenes: CircuitScene[]): CircuitScene[] {
    const freshScenes = scenes.filter((scene) => !this.recentScenes.includes(scene.id));
    if (freshScenes.length) {
      return freshScenes;
    }
    return scenes;
  }

  private getScenesForTopic(topic: CircuitTopic): CircuitScene[] {
    const source = this.circuitsEngine as unknown as SceneSource;
    if (typeof source.getScenesForTopic === "function") {
      return source.getScenesForTopic(topic) ?? [];
    }
    if (typeof source.listScenesForTopic === "function") {
      return source.listScenesForTopic(topic) ?? [];
    }
    return [];
  }

  private async buildContext(
    topic: CircuitTopic,
    previousChoice?: CircuitChoice
  ): Promise<CircuitContext> {
    await this.toolExposure.loadExposure();
    const seenTools = this.toolExposure.getSeenTools();
    const level = this.deriveLevelFromExposure(seenTools.length);

    return {
      topic,
      level,
      seenTools,
      previousSceneId: previousChoice?.metadata?.previousSceneId ?? undefined,
      previousChoiceId: previousChoice?.id,
    };
  }

  private deriveLevelFromExposure(count: number): CircuitContext["level"] {
    if (count < 3) {
      return "basic";
    }
    if (count < 8) {
      return "intermediate";
    }
    return "advanced";
  }

  private async persistSeenScenes(): Promise<void> {
    const record =
      (await this.store.getCustomData<SeenScenesRecord>(SEEN_SCENES_KEY)) ?? {};
    record[this.userId] = Array.from(this.seenScenes);
    await this.store.setCustomData(SEEN_SCENES_KEY, record);
  }

  private async persistTopicVisits(): Promise<void> {
    const record =
      (await this.store.getCustomData<TopicVisitsRecord>(TOPIC_VISITS_KEY)) ?? {};
    const serializedVisits: Record<string, number> = {};
    for (const [topic, count] of this.topicVisits.entries()) {
      serializedVisits[topic] = count;
    }
    record[this.userId] = serializedVisits;
    await this.store.setCustomData(TOPIC_VISITS_KEY, record);
  }

  private bumpTopicVisit(topic: CircuitTopic): void {
    const current = this.topicVisits.get(topic) ?? 0;
    this.topicVisits.set(topic, current + 1);
    void this.persistTopicVisits();
  }

  private logChoice(choice: CircuitChoice): void {
    const metadata = choice.metadata ?? {};
    const debugPayload = {
      id: nanoid(),
      choiceId: choice.id,
      nextTopic: choice.nextTopic,
      metadata,
      timestamp: new Date().toISOString(),
    };
    if (typeof console !== "undefined" && console.debug) {
      console.debug("circuits:choice", debugPayload);
    }
  }
}
