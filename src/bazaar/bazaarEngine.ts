import { BazaarStall, loadBazaarStalls } from "./bazaarStalls";
import { UserDataStore } from "../data/userDataStore";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { MediaSync } from "../lib/mediaSync";

export interface BazaarStallData {
  id: string;
  name: string;
  instruments: string[];
  rhythms: string[];
  textures: string[];
  exampleClips: string[];
  culturalNotes: string[];
}

export type SamplePayloadType = "instrument" | "texture" | "pattern";

export interface SampleEvent {
  time: number;
  action: string;
  note?: string;
  velocity?: number;
  description?: string;
}

export interface SamplePayload {
  type: SamplePayloadType;
  audioEvents: SampleEvent[];
  metadata: {
    stallId: string;
    element: string;
    vibe: string;
    source: string;
  };
}

type BazaarEngineOptions = {
  userId: string;
  store: UserDataStore;
  deepSeek: DeepSeekEngine;
  mediaSync: MediaSync;
};

export class BazaarEngine {
  private userId: string;
  private store: UserDataStore;
  private deepSeek: DeepSeekEngine;
  private mediaSync: MediaSync;
  private stalls: BazaarStall[];
  private currentStall: BazaarStall | null;

  constructor(options: BazaarEngineOptions) {
    this.userId = options.userId;
    this.store = options.store;
    this.deepSeek = options.deepSeek;
    this.mediaSync = options.mediaSync;
    this.stalls = loadBazaarStalls();
    this.currentStall = null;
  }

  private findStall(stallId: string): BazaarStall {
    const stall = this.stalls.find((candidate) => candidate.id === stallId);
    if (!stall) {
      throw new Error(`Bazaar stall not found: ${stallId}`);
    }
    return stall;
  }

  private async logBazaarEntry(stall: BazaarStall): Promise<void> {
    try {
      await this.store.logModeUsage({
        userId: this.userId,
        modeName: "bazaar",
        action: "enter",
        metadata: {
          stallId: stall.id,
          stallName: stall.name,
        },
      });
    } catch (error) {
      console.error("Failed to log bazaar entry", error);
    }
  }

  private async logBazaarSample(stall: BazaarStall, element: string): Promise<void> {
    try {
      await this.store.logModeUsage({
        userId: this.userId,
        modeName: "bazaar",
        action: "enter",
        metadata: {
          stallId: stall.id,
          stallName: stall.name,
          sampleElement: element,
        },
      });
    } catch (error) {
      console.error("Failed to log bazaar sample", error);
    }
  }

  async enterStall(stallId: string): Promise<BazaarStallData> {
    const stall = this.findStall(stallId);
    this.currentStall = stall;

    try {
      await this.mediaSync.pause();
    } catch (error) {
      console.error("Bazaar media pause failed", error);
    }

    await this.logBazaarEntry(stall);

    return {
      id: stall.id,
      name: stall.name,
      instruments: stall.instruments,
      rhythms: stall.rhythmicConcepts,
      textures: stall.textures,
      exampleClips: stall.exampleClips,
      culturalNotes: stall.culturalNotes,
    };
  }

  async askAbout(stallId: string, topic: string): Promise<string> {
    const stall = this.findStall(stallId);
    const prompt = `Bazaar stall: ${stall.name}. Topic: ${topic}. Keep it casual, vivid, and respectful. Compare with nearby stalls when it helps.`;
    try {
      const response = await this.deepSeek.generateNoGradingResponse({
        userId: this.userId,
        userMessage: prompt,
      });
      return response;
    } catch (error) {
      console.error("DeepSeek askAbout failed", error);
      return "The stall noise drowns out the answer—try asking again.";
    }
  }

  async sampleStallSound(stallId: string, element: string): Promise<SamplePayload> {
    const stall = this.findStall(stallId);
    const baseTime = Date.now() % 500;

    const audioEvents: SampleEvent[] = [
      { time: baseTime, action: "start", description: `${element} cue` },
      { time: baseTime + 240, action: "accent", velocity: 0.9, note: "root" },
      { time: baseTime + 480, action: "accent", velocity: 0.75, note: "fifth" },
      { time: baseTime + 720, action: "release", description: "fade" },
    ];

    const payload: SamplePayload = {
      type: this.inferSampleType(element),
      audioEvents,
      metadata: {
        stallId: stall.id,
        element,
        vibe: stall.description,
        source: "bazaar",
      },
    };

    await this.logBazaarSample(stall, element);
    return payload;
  }

  async getConnections(stallId: string): Promise<string[]> {
    const stall = this.findStall(stallId);
    const prompt = `You are guiding a player through a flea-market bazaar of sound. Suggest short connections from ${stall.name} to other global scenes in two to four beats of text each.`;

    try {
      const response = await this.deepSeek.generateNoGradingResponse({
        userId: this.userId,
        userMessage: prompt,
      });
      return response
        .split(/\n|,|;/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    } catch (error) {
      console.error("Failed to fetch bazaar connections", error);
      return ["The aisle is too loud—try again after a lap."];
    }
  }

  private inferSampleType(element: string): SamplePayloadType {
    const normalized = element.toLowerCase();
    if (normalized.includes("drum") || normalized.includes("rhythm") || normalized.includes("beat")) {
      return "pattern";
    }
    if (normalized.includes("texture") || normalized.includes("noise") || normalized.includes("pad")) {
      return "texture";
    }
    return "instrument";
  }
}
