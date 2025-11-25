import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { UserDataStore } from "../../data/userDataStore";
import { CircuitScene, CircuitTopic } from "../circuitsTypes";
import { NPCProfile } from "../npcProfiles";
import { Souvenir, SouvenirType, StoryChain } from "./circuitsMetaTypes";

export class CircuitsSouvenirEngine {
  private readonly userId: string;
  private readonly store: UserDataStore;
  private readonly scenes: Map<string, CircuitScene>;
  private readonly npcProfiles: Map<string, NPCProfile>;

  constructor(options: {
    userId: string;
    store: UserDataStore;
    scenes: CircuitScene[];
    npcProfiles: NPCProfile[];
  }) {
    this.userId = options.userId;
    this.store = options.store;
    this.scenes = new Map(options.scenes.map((scene) => [scene.id, scene]));
    this.npcProfiles = new Map(options.npcProfiles.map((npc) => [npc.id, npc]));
  }

  async generateSouvenirs(chain: StoryChain): Promise<Souvenir[]> {
    const candidates = this.buildCandidates(chain);
    const desiredCount = Math.min(3, Math.max(1, Math.floor(Math.random() * 3) + 1));
    const selected = this.pickRandomSubset(candidates, desiredCount);

    const saved: Souvenir[] = [];
    for (const souvenir of selected) {
      const fullSouvenir: Souvenir = {
        ...souvenir,
        id: nanoid(),
        userId: this.userId,
        createdAt: dayjs().toISOString(),
      };
      saved.push(await this.store.saveSouvenir(fullSouvenir));
    }

    return saved;
  }

  async getSouvenirs(limit = 50): Promise<Souvenir[]> {
    return this.store.listSouvenirs(this.userId, limit);
  }

  private buildCandidates(chain: StoryChain): Array<Omit<Souvenir, "id" | "createdAt" | "userId">> {
    const topicsVisited = this.getUniqueTopics(chain);
    const encounteredNPCs = this.getEncounteredNPCs(chain);
    const sceneSouvenirs: Array<Omit<Souvenir, "id" | "createdAt" | "userId">> = [];

    for (const node of chain.nodes) {
      const scene = this.scenes.get(node.sceneId);
      if (scene) {
        sceneSouvenirs.push({
          label: `Sticker: ${scene.settingText.split(".")[0] ?? scene.id}`,
          type: "sticker",
          metadata: {
            sceneId: scene.id,
            topic: scene.topic,
            excuse: scene.excuse,
            snippet: scene.settingText,
          },
        });
      }
    }

    const topicSouvenirs = topicsVisited.map((topic) => ({
      label: `Scrap: ${topic}`,
      type: "scrap" as SouvenirType,
      metadata: {
        topic,
        emphasis: this.describeTopicMood(topic),
        density: chain.nodes.filter((node) => node.topic === topic).length,
      },
    }));

    const quoteSouvenirs = encounteredNPCs.map((npc) => ({
      label: `Quote: ${npc.name}`,
      type: "quote" as SouvenirType,
      metadata: {
        npcId: npc.id,
        npcRole: npc.role,
        text: this.randomFromArray(npc.catchphrases) ?? "They left a murmur behind.",
      },
    }));

    const constraintSouvenirs = chain.nodes
      .filter((node) => node.constraint)
      .map((node) => ({
        label: `Shape: ${node.constraint?.requiredTools.join(" + ")}`,
        type: "shape" as SouvenirType,
        metadata: {
          sceneId: node.sceneId,
          topic: node.topic,
          constraint: node.constraint,
          vibe: "contour sketch from tools used",
        },
      }));

    const ticketSouvenirs: Array<Omit<Souvenir, "id" | "createdAt" | "userId">> = [];
    if (chain.nodes.length > 1) {
      const first = chain.nodes[0];
      const last = chain.nodes[chain.nodes.length - 1];
      ticketSouvenirs.push({
        label: `Ticket: ${first.topic} → ${last.topic}`,
        type: "ticket",
        metadata: {
          start: first.topic,
          end: last.topic,
          hops: chain.nodes.length,
          time: `${dayjs(first.timestamp ?? chain.createdAt).format("HH:mm")} - ${dayjs(
            last.timestamp ?? chain.createdAt
          ).format("HH:mm")}`,
        },
      });
    }

    const allCandidates = [
      ...this.uniqueByLabel(sceneSouvenirs),
      ...this.uniqueByLabel(topicSouvenirs),
      ...this.uniqueByLabel(quoteSouvenirs),
      ...this.uniqueByLabel(constraintSouvenirs),
      ...this.uniqueByLabel(ticketSouvenirs),
    ];

    if (allCandidates.length === 0) {
      return [
        {
          label: "Pocket lint from a quiet alley",
          type: "scrap",
          metadata: { mood: "mysterious", note: "A reminder that silence counts too." },
        },
      ];
    }

    return allCandidates;
  }

  private pickRandomSubset<T>(items: T[], count: number): T[] {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.max(1, Math.min(count, items.length)));
  }

  private uniqueByLabel<T extends { label: string }>(items: T[]): T[] {
    const seen = new Set<string>();
    const unique: T[] = [];

    for (const item of items) {
      if (!seen.has(item.label)) {
        unique.push(item);
        seen.add(item.label);
      }
    }

    return unique;
  }

  private getUniqueTopics(chain: StoryChain): CircuitTopic[] {
    const topics = new Set<CircuitTopic>();
    chain.nodes.forEach((node) => topics.add(node.topic));
    return Array.from(topics);
  }

  private getEncounteredNPCs(chain: StoryChain): NPCProfile[] {
    const npcs = new Map<string, NPCProfile>();

    chain.nodes.forEach((node) => {
      const npcId = node.npcId ?? node.metadata?.npcId;
      if (npcId && this.npcProfiles.has(npcId)) {
        npcs.set(npcId, this.npcProfiles.get(npcId) as NPCProfile);
        return;
      }

      const npcName = node.npcName ?? node.metadata?.npcName;
      if (npcName) {
        const match = Array.from(this.npcProfiles.values()).find((npc) => npc.name === npcName);
        if (match) {
          npcs.set(match.id, match);
        }
      }
    });

    return Array.from(npcs.values());
  }

  private describeTopicMood(topic: CircuitTopic): string {
    const lowercase = topic.toLowerCase();
    if (lowercase.includes("night") || lowercase.includes("moon")) {
      return "nocturnal ink stain";
    }
    if (lowercase.includes("bus") || lowercase.includes("metro")) {
      return "transit scrawl";
    }
    if (lowercase.includes("bass") || lowercase.includes("low")) {
      return "deep growl";
    }
    if (lowercase.includes("voice") || lowercase.includes("chant")) {
      return "echo sketch";
    }
    return "freeform scribble";
  }

  private randomFromArray<T>(items: T[]): T | undefined {
    if (!items.length) {
      return undefined;
    }
    const index = Math.floor(Math.random() * items.length);
    return items[index];
  }
}

export type { Souvenir, SouvenirType };
