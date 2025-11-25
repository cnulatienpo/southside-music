import { UserDataStore } from "../../data/userDataStore";
import { CircuitsEngine } from "../circuitsEngine";
import { CircuitsSceneController } from "../circuitsSceneController";
import { CircuitTopic } from "../circuitsTypes";
import { StoryChain } from "./circuitsMetaTypes";

export interface ReplaySummary {
  id: string;
  createdAt: string;
  topicsVisited: CircuitTopic[];
  npcNames: string[];
  length: number;
  summaryText: string;
}

export class CircuitsReplayEngine {
  private readonly store: UserDataStore;
  private readonly circuitsEngine: CircuitsEngine;
  private readonly sceneController: CircuitsSceneController;

  constructor(options: {
    store: UserDataStore;
    circuitsEngine: CircuitsEngine;
    sceneController: CircuitsSceneController;
  }) {
    this.store = options.store;
    this.circuitsEngine = options.circuitsEngine;
    this.sceneController = options.sceneController;
  }

  async getRunSummaries(limit = 20): Promise<ReplaySummary[]> {
    const profile = await this.store.getOrCreateProfile();
    const runs = await this.store.listCircuitRuns(profile.id, limit);

    return runs.map((run) => ({
      id: run.id,
      createdAt: run.createdAt,
      topicsVisited: this.extractTopics(run),
      npcNames: this.extractNpcNames(run),
      length: run.nodes.length,
      summaryText: this.generateSummaryText(run),
    }));
  }

  async replayRun(chainId: string): Promise<StoryChain> {
    const chain = await this.store.getCircuitRun(chainId);
    if (!chain) {
      throw new Error(`No circuit run found for id ${chainId}`);
    }

    return chain;
  }

  private extractTopics(chain: StoryChain): CircuitTopic[] {
    const topics = new Set<CircuitTopic>();
    chain.nodes.forEach((node) => topics.add(node.topic));
    return Array.from(topics);
  }

  private extractNpcNames(chain: StoryChain): string[] {
    const names = new Set<string>();
    chain.nodes.forEach((node) => {
      if (node.npcName) {
        names.add(node.npcName);
      }
      const npcName = node.metadata?.npcName as string | undefined;
      if (npcName) {
        names.add(npcName);
      }
    });
    return Array.from(names);
  }

  private generateSummaryText(chain: StoryChain): string {
    const topics = this.extractTopics(chain);
    const npcs = this.extractNpcNames(chain);
    const intro = topics.length
      ? `Started with ${topics[0]} and wandered through ${topics.slice(1).join(", ") || "its own echo"}.`
      : "A run made of pure curiosity.";
    const npcLine = npcs.length ? ` Talked with ${npcs.join(", ")}.` : " Met murmurs more than faces.";
    const rhythmLine = chain.nodes.length > 3 ? " The chain was long and loopy." : " A short, punchy hop.";

    return `${intro}${npcLine}${rhythmLine}`;
  }
}
