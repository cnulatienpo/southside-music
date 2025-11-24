import { nanoid } from "nanoid";
import { AudioEvent } from "../dualMode/audioMusicModel";
import { UserDataStore } from "../data/userDataStore";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { MediaSync } from "../lib/mediaSync";
import { BazaarStall, loadBazaarStalls } from "./bazaarStalls";

export type SamplePayloadType = "instrument" | "texture" | "pattern";

export interface SamplePayload {
  type: SamplePayloadType;
  audioEvents: AudioEvent[];
  metadata: Record<string, unknown>;
}

export type BazaarStallData = BazaarStall;

interface BazaarEngineOptions {
  userId: string;
  store: UserDataStore;
  deepSeek: DeepSeekEngine;
  mediaSync: MediaSync;
}

export class BazaarEngine {
  private readonly userId: string;

  private readonly store: UserDataStore;

  private readonly deepSeek: DeepSeekEngine;

  private readonly mediaSync: MediaSync;

  private readonly stalls: BazaarStall[];

  private currentStall: BazaarStall | null;

  constructor(options: BazaarEngineOptions) {
    this.userId = options.userId;
    this.store = options.store;
    this.deepSeek = options.deepSeek;
    this.mediaSync = options.mediaSync;
    this.stalls = loadBazaarStalls();
    this.currentStall = null;
  }

  public async enterStall(stallId: string): Promise<BazaarStallData> {
    const stall = this.findStall(stallId);
    this.currentStall = stall;

    await this.logBazaarEvent("bazaar_enter", stallId, { name: stall.name });

    return stall;
  }

  public async askAbout(stallId: string, topic: string): Promise<string> {
    const stall = this.findStall(stallId);
    const question = `Bazaar mode question about ${stall.name}: ${topic}. Keep it short, curious, and non-academic.`;

    try {
      return await this.deepSeek.generateNoGradingResponse({
        userId: this.userId,
        userMessage: question,
      });
    } catch (error) {
      console.error("DeepSeek askAbout failed", error);
      return "This aisle is loud, but the vendor says it's all about feeling the groove and history in the crowd.";
    }
  }

  public async sampleStallSound(stallId: string, element: string): Promise<SamplePayload> {
    const stall = this.findStall(stallId);
    const payload = this.buildSamplePayload(stall, element);

    await this.logBazaarEvent("bazaar_sample", stallId, {
      element,
      sampleType: payload.type,
    });

    return payload;
  }

  public async getConnections(stallId: string): Promise<string[]> {
    const stall = this.findStall(stallId);
    const prompt = `Suggest quick links from ${stall.name} to other stalls in two to four hops.`;

    try {
      const response = await this.deepSeek.generateNoGradingResponse({
        userId: this.userId,
        userMessage: prompt,
      });
      const ideas = response
        .split(/\n|→/)
        .map((item) => item.trim())
        .filter(Boolean);

      if (ideas.length > 0) {
        return ideas;
      }
    } catch (error) {
      console.error("DeepSeek getConnections failed", error);
    }

    return this.buildFallbackConnections(stall.id);
  }

  private findStall(stallId: string): BazaarStall {
    const stall = this.stalls.find((item) => item.id === stallId);
    if (!stall) {
      throw new Error(`Stall not found: ${stallId}`);
    }

    return stall;
  }

  private buildSamplePayload(stall: BazaarStall, element: string): SamplePayload {
    const timestamp = 0;
    const baseMetadata = {
      stallId: stall.id,
      stallName: stall.name,
      source: "bazaar",
      element,
    };

    if (stall.instruments.includes(element)) {
      const audioEvents: AudioEvent[] = [
        {
          id: nanoid(),
          type: "sample",
          timestamp,
          metadata: { ...baseMetadata, category: "instrument", instrument: element },
        },
      ];

      return {
        type: "instrument",
        audioEvents,
        metadata: { ...baseMetadata, flavor: "signature instrument pull" },
      };
    }

    if (stall.textures.includes(element)) {
      const audioEvents: AudioEvent[] = [
        {
          id: nanoid(),
          type: "effect",
          timestamp,
          metadata: { ...baseMetadata, category: "texture" },
        },
      ];

      return {
        type: "texture",
        audioEvents,
        metadata: { ...baseMetadata, flavor: "crowded-aisle texture" },
      };
    }

    const rhythmicEvent: AudioEvent = {
      id: nanoid(),
      type: "beat",
      timestamp,
      metadata: { ...baseMetadata, category: "pattern", rhythmHint: element },
    };

    return {
      type: "pattern",
      audioEvents: [rhythmicEvent],
      metadata: { ...baseMetadata, flavor: "borrowed groove fragment" },
    };
  }

  private buildFallbackConnections(stallId: string): string[] {
    const connections: Record<string, string[]> = {
      "chicago-house": ["Chicago house → Detroit techno → UK rave", "Chicago house → Gospel harmonies"],
      "detroit-techno": ["Detroit techno → Chicago house → French touch", "Detroit techno → Electro → Ghetto tech"],
      salsa: ["Salsa → Son cubano → Latin jazz", "Salsa → Gospel call-and-response → House vocals"],
      cumbia: ["Cumbia → Afro-Colombian drums → Champeta", "Cumbia → Mexican sonidero → Club remixes"],
      rembetiko: ["Rembetiko → Balkan brass phrasing", "Rembetiko → Blues storytelling"],
      gospel: ["Gospel → Soul → House piano", "Gospel → Hip-hop choir hooks"],
      metal: ["Metal → Hardcore → Industrial", "Metal → Doom → Stoner rock"],
      "hip-hop": ["Hip-hop → House sampling → Jersey club", "Hip-hop → Afrobeat horns → Highlife samples"],
      afrobeat: ["Afrobeat → Highlife → Afro-pop", "Afrobeat → Jazz funk → Disco"],
      bollywood: ["Bollywood → Disco → Italo connections", "Bollywood → Classical ragas → Psychedelia"],
      industrial: ["Industrial → Techno warehouse sound", "Industrial → Noise rock"],
      "balkan-brass": ["Balkan brass → Klezmer phrasing", "Balkan brass → Ska horn lines"],
    };

    return connections[stallId] ?? ["Wander the aisles—everything eventually connects."];
  }

  private async logBazaarEvent(
    event: "bazaar_enter" | "bazaar_sample",
    stallId: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      await this.store.logModeUsage({
        userId: this.userId,
        modeName: "bazaar",
        action: "enter",
        metadata: {
          event,
          stallId,
          ...(metadata ?? {}),
        },
      });
    } catch (error) {
      console.error(`Failed to log bazaar event: ${event}`, error);
    }
  }
}
