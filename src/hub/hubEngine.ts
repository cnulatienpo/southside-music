import { CircuitsEngine } from "../circuits/circuitsEngine";
import { CircuitTopic } from "../circuits/circuitsTypes";
import { UserDataStore } from "../data/userDataStore";

export interface StoryChain {
  id: string;
  topic: CircuitTopic;
  status?: "in_progress" | "complete" | "abandoned";
  metadata?: Record<string, any>;
}

export interface StoryHistoryEntry {
  runId: string;
  topic: CircuitTopic;
  startedAt: string;
  lastVisitedAt: string;
  status?: "in_progress" | "complete" | "abandoned";
  note?: string;
}

export interface SceneProgressionEngine {
  startRun(topic: CircuitTopic): Promise<StoryChain>;
  continueLastRun(): Promise<StoryChain | null>;
  getRecentRuns?(limit?: number): Promise<StoryHistoryEntry[]>;
}

export interface HubDestination {
  id: string;
  label: string;
  topic: CircuitTopic;
  description: string;
  iconHint?: string;
}

const HUB_DESTINATIONS: HubDestination[] = [
  {
    id: "beats",
    label: "Beats & Time",
    topic: "beats-and-time",
    description: "Rattling utility closet with patched-up drum machines and metronome graffiti.",
    iconHint: "clockwork-gear",
  },
  {
    id: "bass",
    label: "Bass & Low Stuff",
    topic: "bass-low",
    description: "Concrete stairwell humming with subwoofers and slow neon pulses.",
    iconHint: "low-step",
  },
  {
    id: "voice",
    label: "Voice & Words",
    topic: "voice-words",
    description: "Old intercom panel with mic cables bundled like ivy over the wall.",
    iconHint: "speech-wave",
  },
  {
    id: "guitar",
    label: "Guitar & Noise",
    topic: "guitar-noise",
    description: "Chain-link fenced nook with amps stacked under warning stripes.",
    iconHint: "lightning-pick",
  },
  {
    id: "keys",
    label: "Keys & Synths",
    topic: "keys-synths",
    description: "Flickering neon keyboard outline above a rolling cart of synths.",
    iconHint: "neon-keys",
  },
  {
    id: "structure",
    label: "Song Shape",
    topic: "song-shape",
    description: "Bus route map covered in tape markings for verse, hook, and bridge detours.",
    iconHint: "map-lines",
  },
  {
    id: "texture",
    label: "Texture & Layers",
    topic: "texture-layers",
    description: "Between two vending machines spitting static and shimmer samples.",
    iconHint: "layered-tiles",
  },
  {
    id: "theft",
    label: "Theft Guild",
    topic: "theft-guild",
    description: "Behind a rolling metal gate with stencil arrows and bootleg posters.",
    iconHint: "crowbar",
  },
  {
    id: "lab",
    label: "The Lab",
    topic: "lab",
    description: "Cable jungle leading to glass panels and chalkboard scraps.",
    iconHint: "beaker",
  },
  {
    id: "dojo",
    label: "The Dojo",
    topic: "dojo",
    description: "Stripped rehearsal door with tatami tape lines and glove hooks.",
    iconHint: "dojo-banner",
  },
  {
    id: "garden",
    label: "The Garden",
    topic: "garden",
    description: "Side door to the empty lot lit by sodium lamps and creeping vines.",
    iconHint: "leaf-spray",
  },
  {
    id: "bazaar",
    label: "The Bazaar",
    topic: "bazaar",
    description: "Tarp-covered corridor of pop-up stalls glowing with scavenged neon.",
    iconHint: "market-lantern",
  },
  {
    id: "songbuilder",
    label: "Songbuilder",
    topic: "songbuilder",
    description: "Down the ramp toward the factory floor with conveyor belts humming.",
    iconHint: "assembly",
  },
  {
    id: "archives",
    label: "Archives",
    topic: "archives",
    description: "Up rusty metal stairs toward crates of tapes and cracked catalog screens.",
    iconHint: "stacked-boxes",
  },
];

export class HubEngine {
  private readonly userId: string;
  private readonly store: UserDataStore;
  private readonly circuitsEngine: CircuitsEngine;
  private readonly storyEngine: SceneProgressionEngine;
  private readonly maxStoredRuns = 12;

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

  getHubDestinations(): HubDestination[] {
    return [...HUB_DESTINATIONS];
  }

  async getSuggestedTopics(): Promise<CircuitTopic[]> {
    const destinations = this.getHubDestinations();
    const touches = await this.loadTopicTouches();
    const now = Date.now();

    const ranked = destinations.map((destination) => {
      const lastTouch = touches[destination.topic] ?? 0;
      const staleness = now - lastTouch;
      const chaos = Math.random() * 0.25;
      const score = staleness / 1000 + chaos;
      return { destination, score };
    });

    ranked.sort((a, b) => b.score - a.score);

    return ranked.slice(0, 6).map((item) => item.destination.topic);
  }

  async startCircuit(topic: CircuitTopic): Promise<StoryChain> {
    const chain = await this.storyEngine.startRun(topic);
    await this.noteTopicTouch(topic);
    await this.recordRun({
      runId: chain.id ?? `run-${Date.now()}`,
      topic,
      startedAt: new Date().toISOString(),
      lastVisitedAt: new Date().toISOString(),
      status: "in_progress",
    });
    return chain;
  }

  async continueLastRun(): Promise<StoryChain | null> {
    const chain = await this.storyEngine.continueLastRun();
    if (!chain) {
      return null;
    }

    await this.noteTopicTouch(chain.topic);
    await this.recordRun({
      runId: chain.id ?? `run-${Date.now()}`,
      topic: chain.topic,
      startedAt: new Date().toISOString(),
      lastVisitedAt: new Date().toISOString(),
      status: chain.status ?? "in_progress",
    });

    return chain;
  }

  async getRecentRuns(limit = 5): Promise<StoryHistoryEntry[]> {
    if (typeof this.storyEngine.getRecentRuns === "function") {
      const runs = await this.storyEngine.getRecentRuns(limit);
      if (runs?.length) {
        return runs.slice(0, limit);
      }
    }

    const storedRuns = await this.loadRunsFromStore();
    return storedRuns.slice(0, limit);
  }

  private async loadTopicTouches(): Promise<Record<string, number>> {
    return (await this.store.getCustomData<Record<string, number>>(
      this.topicTouchKey()
    )) ?? {};
  }

  private async noteTopicTouch(topic: CircuitTopic): Promise<void> {
    const touches = await this.loadTopicTouches();
    touches[topic] = Date.now();
    await this.store.setCustomData(this.topicTouchKey(), touches);
  }

  private topicTouchKey(): string {
    return `hub_topic_touches_${this.userId}`;
  }

  private runHistoryKey(): string {
    return `hub_recent_runs_${this.userId}`;
  }

  private async loadRunsFromStore(): Promise<StoryHistoryEntry[]> {
    const runs =
      (await this.store.getCustomData<StoryHistoryEntry[]>(
        this.runHistoryKey()
      )) ?? [];

    return runs.sort(
      (a, b) =>
        new Date(b.lastVisitedAt).getTime() -
        new Date(a.lastVisitedAt).getTime()
    );
  }

  private async recordRun(entry: StoryHistoryEntry): Promise<void> {
    const existing = await this.loadRunsFromStore();
    const filtered = existing.filter((item) => item.runId !== entry.runId);
    const updated: StoryHistoryEntry = {
      ...entry,
      lastVisitedAt: entry.lastVisitedAt ?? new Date().toISOString(),
    };
    filtered.unshift(updated);
    const limited = filtered.slice(0, this.maxStoredRuns);
    await this.store.setCustomData(this.runHistoryKey(), limited);
  }
}
