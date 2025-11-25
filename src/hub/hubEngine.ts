import { UserDataStore } from "../data/userDataStore";
import { CircuitsEngine } from "../circuits/circuitsEngine";
import { CircuitTopic } from "../circuits/circuitsTypes";

export interface StoryChainStep {
  sceneId: string;
  choiceId?: string;
  notes?: string;
}

export interface StoryChain {
  id: string;
  topic: CircuitTopic;
  status?: "active" | "complete" | "paused";
  steps?: StoryChainStep[];
  metadata?: Record<string, any>;
}

export interface StoryHistoryEntry {
  runId: string;
  topic: CircuitTopic;
  startedAt: string;
  updatedAt: string;
  summary?: string;
  status?: "active" | "complete" | "paused" | "abandoned";
}

export interface SceneProgressionEngine {
  startRun(topic: CircuitTopic): Promise<StoryChain>;
  continueLastRun?(): Promise<StoryChain | null>;
  getHistory?(options?: { limit?: number }): Promise<StoryHistoryEntry[]>;
}

export interface HubDestination {
  id: string;
  label: string;
  topic: CircuitTopic;
  description: string;
  iconHint?: string;
}

const HUB_RECENTS_KEY = (userId: string) => `hub_recent_runs_${userId}`;

export class HubEngine {
  private readonly userId: string;
  private readonly store: UserDataStore;
  private readonly circuitsEngine: CircuitsEngine;
  private readonly storyEngine: SceneProgressionEngine;

  constructor(options: {
    userId: string;
    store: UserDataStore;
    circuitsEngine: CircuitsEngine;
    storyEngine: SceneProgressionEngine;
  }) {
    this.userId = options.userId;
    this.store = options.store;
    this.circuitsEngine = options.circuitsEngine;
    this.storyEngine = options.storyEngine;
  }

  public getHubDestinations(): HubDestination[] {
    return [
      {
        id: "beats",
        label: "Beats & Time",
        topic: "beats_time",
        description: "rattling utility closet with tempo maps taped to the wall",
        iconHint: "metronome",
      },
      {
        id: "bass",
        label: "Bass & Low Stuff",
        topic: "bass_low",
        description: "stairwell humming with subwoofers hidden below",
        iconHint: "stairs",
      },
      {
        id: "voice",
        label: "Voice & Words",
        topic: "voice_words",
        description: "old intercom with a cracked mic and lyric scraps",
        iconHint: "mic",
      },
      {
        id: "guitar",
        label: "Guitar & Noise",
        topic: "guitar_noise",
        description: "caged amp stack buzzing near a loading dock door",
        iconHint: "amp",
      },
      {
        id: "keys",
        label: "Keys & Synths",
        topic: "keys_synths",
        description: "flickering neon keyboard outline above a doorway",
        iconHint: "neon_keys",
      },
      {
        id: "structure",
        label: "Song Shape",
        topic: "song_shape",
        description: "bus route map with song forms scribbled over it",
        iconHint: "map",
      },
      {
        id: "texture",
        label: "Texture & Layers",
        topic: "texture_layers",
        description: "between two vending machines leaking light",
        iconHint: "vending",
      },
      {
        id: "theft",
        label: "Theft Guild",
        topic: "theft_guild",
        description: "rolling metal gate with warning stickers",
        iconHint: "gate",
      },
      {
        id: "lab",
        label: "The Lab",
        topic: "lab",
        description: "wires and chalkboard scraps taped to a lab door",
        iconHint: "lab",
      },
      {
        id: "dojo",
        label: "The Dojo",
        topic: "dojo",
        description: "stripped-down rehearsal door with taped targets",
        iconHint: "dojo",
      },
      {
        id: "garden",
        label: "The Garden",
        topic: "garden",
        description: "side door to an overgrown empty lot",
        iconHint: "leaves",
      },
      {
        id: "bazaar",
        label: "The Bazaar",
        topic: "bazaar",
        description: "tarp-covered corridor with hanging lamps",
        iconHint: "tarp",
      },
      {
        id: "songbuilder",
        label: "Songbuilder",
        topic: "songbuilder",
        description: "ramp down toward the factory floor with carts of gear",
        iconHint: "ramp",
      },
      {
        id: "archives",
        label: "Archives",
        topic: "archives",
        description: "rusty metal stairs leading up to a locked cage room",
        iconHint: "stairs_up",
      },
    ];
  }

  public async getSuggestedTopics(): Promise<CircuitTopic[]> {
    const destinations = this.getHubDestinations();
    const topics = destinations.map((destination) => destination.topic);
    const runs = await this.getRecentRuns(20);

    const recency: Record<string, number> = {};
    for (const topic of topics) {
      const lastSeen = runs.find((run) => run.topic === topic);
      recency[topic] = lastSeen ? new Date(lastSeen.updatedAt).getTime() : 0;
    }

    const scored = topics.map((topic) => ({
      topic,
      score: recency[topic] + Math.random() * 5000,
    }));

    scored.sort((a, b) => a.score - b.score);

    return scored.slice(0, 5).map((entry) => entry.topic);
  }

  public async startCircuit(topic: CircuitTopic): Promise<StoryChain> {
    const chain = await this.storyEngine.startRun(topic);
    await this.recordRun({
      runId: chain.id,
      topic,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: chain.status ?? "active",
    });
    return chain;
  }

  public async continueLastRun(): Promise<StoryChain | null> {
    if (typeof this.storyEngine.continueLastRun !== "function") {
      return null;
    }

    const chain = await this.storyEngine.continueLastRun();
    if (!chain) {
      return null;
    }

    await this.recordRun({
      runId: chain.id,
      topic: chain.topic,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: chain.status ?? "active",
    });

    return chain;
  }

  public async getRecentRuns(limit = 5): Promise<StoryHistoryEntry[]> {
    const history = await this.getHistoryFromStoryEngine(limit);
    if (history.length) {
      await this.persistStoredRuns(history);
      return history.slice(0, limit);
    }

    const stored = await this.loadStoredRuns();
    return stored.slice(0, limit);
  }

  private async getHistoryFromStoryEngine(limit: number): Promise<StoryHistoryEntry[]> {
    if (typeof this.storyEngine.getHistory !== "function") {
      return [];
    }

    try {
      const history = await this.storyEngine.getHistory({ limit });
      return history ?? [];
    } catch (error) {
      console.warn("HubEngine: unable to read story history", error);
      return [];
    }
  }

  private async loadStoredRuns(): Promise<StoryHistoryEntry[]> {
    const stored = await this.store.getCustomData<StoryHistoryEntry[]>(HUB_RECENTS_KEY(this.userId));
    return stored ?? [];
  }

  private async persistStoredRuns(runs: StoryHistoryEntry[]): Promise<void> {
    await this.store.setCustomData(HUB_RECENTS_KEY(this.userId), runs.slice(0, 25));
  }

  private async recordRun(entry: StoryHistoryEntry): Promise<void> {
    const runs = await this.loadStoredRuns();
    const existingIndex = runs.findIndex((run) => run.runId === entry.runId);
    if (existingIndex >= 0) {
      runs[existingIndex] = { ...runs[existingIndex], ...entry, updatedAt: new Date().toISOString() };
    } else {
      runs.unshift(entry);
    }

    const trimmed = runs.slice(0, 25);
    await this.store.setCustomData(HUB_RECENTS_KEY(this.userId), trimmed);
  }
}
