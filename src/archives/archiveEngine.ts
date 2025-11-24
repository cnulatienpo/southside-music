/**
 * ARCHIVE ENGINE
 * Aggregates creative memory across the Southside School systems.
 */

import {
  ArchiveIndex,
  GardenMemory,
  LabExperiment,
  Milestone,
  SongProjectSummary,
  TimelineEntry,
  HeistReport,
} from "./memoryStructures";

// Lightweight contracts for collaborating systems. These are intentionally
// open-ended so that different engines can plug in their own data providers.
type UserDataStore = {
  getDrills?: (userId: string) => Promise<any[]> | any[];
  getHeists?: (userId: string) => Promise<HeistReport[]> | HeistReport[];
  getSeeds?: (userId: string) => Promise<any[]> | any[];
  getSoundworldAssets?: (userId: string) => Promise<any[]> | any[];
  getSongSections?: (userId: string) => Promise<any[]> | any[];
  getVocabularyMap?: (userId: string) => Promise<Record<string, string>> | Record<string, string>;
  getPitchMilestones?: (userId: string) => Promise<Milestone[]> | Milestone[];
  getListeningLogs?: (userId: string) => Promise<any[]> | any[];
  getSongProjects?: (userId: string) => Promise<SongProjectSummary[]> | SongProjectSummary[];
  getGardenScrapbook?: (userId: string) => Promise<GardenMemory[]> | GardenMemory[];
  getLabExperiments?: (userId: string) => Promise<LabExperiment[]> | LabExperiment[];
};

type DeepSeekEngine = {
  reflectOnArchive?: (payload: {
    userId: string;
    timeline: TimelineEntry[];
    vocabulary: Record<string, string>;
    milestones: Milestone[];
  }) => Promise<string> | string;
};

export class ArchiveEngine {
  userId: string;
  store: UserDataStore;
  deepSeek: DeepSeekEngine;

  constructor(options: { userId: string; store: UserDataStore; deepSeek: DeepSeekEngine }) {
    this.userId = options.userId;
    this.store = options.store;
    this.deepSeek = options.deepSeek;
  }

  private async resolveArray<T>(value: Promise<T[]> | T[] | undefined): Promise<T[]> {
    if (!value) return [] as T[];
    const resolved = await value;
    return Array.isArray(resolved) ? resolved : [];
  }

  private async resolveObject<T extends object>(value: Promise<T> | T | undefined): Promise<T> {
    if (!value) return {} as T;
    return await value;
  }

  private coerceTimestamp(entry: any): string {
    if (!entry) return new Date().toISOString();
    return (
      entry.timestamp ||
      entry.createdAt ||
      entry.updatedAt ||
      (entry.metadata && entry.metadata.timestamp) ||
      new Date().toISOString()
    );
  }

  private toTimelineEntry(
    id: string,
    type: TimelineEntry["type"],
    summary: string,
    timestampSource: any,
    metadata: Record<string, any> = {}
  ): TimelineEntry {
    return {
      id,
      timestamp: this.coerceTimestamp(timestampSource),
      type,
      summary,
      metadata,
    };
  }

  async getFullIndex(): Promise<ArchiveIndex> {
    const [
      drills,
      heists,
      seeds,
      soundworldAssets,
      songSections,
      vocabulary,
      pitchMilestones,
      listeningLogs,
    ] = await Promise.all([
      this.resolveArray(this.store.getDrills?.(this.userId)),
      this.resolveArray(this.store.getHeists?.(this.userId)),
      this.resolveArray(this.store.getSeeds?.(this.userId)),
      this.resolveArray(this.store.getSoundworldAssets?.(this.userId)),
      this.resolveArray(this.store.getSongSections?.(this.userId)),
      this.resolveObject(this.store.getVocabularyMap?.(this.userId)),
      this.resolveArray(this.store.getPitchMilestones?.(this.userId)),
      this.resolveArray(this.store.getListeningLogs?.(this.userId)),
    ]);

    return {
      drills,
      heists,
      seeds,
      soundworldAssets,
      songSections,
      vocabulary: vocabulary ?? {},
      pitchMilestones,
      listeningLogs,
    };
  }

  async getTimeline(): Promise<TimelineEntry[]> {
    const index = await this.getFullIndex();
    const timeline: TimelineEntry[] = [];

    index.drills.forEach((drill: any) => {
      timeline.push(
        this.toTimelineEntry(drill.id || `drill-${timeline.length}`, "drill", drill.summary || "Drill", drill)
      );
    });

    index.heists.forEach((heist) => {
      timeline.push(
        this.toTimelineEntry(
          heist.id || `heist-${timeline.length}`,
          "heist",
          heist.insight || heist.target || "Heist",
          heist,
          { outcome: heist.outcome, target: heist.target }
        )
      );
    });

    index.seeds.forEach((seed: any) => {
      timeline.push(
        this.toTimelineEntry(seed.id || `seed-${timeline.length}`, "seed", seed.text || seed.summary || "Seed", seed)
      );
    });

    index.songSections.forEach((section: any) => {
      timeline.push(
        this.toTimelineEntry(
          section.id || `song-${timeline.length}`,
          "song",
          section.title || section.name || "Song section",
          section,
          { section }
        )
      );
    });

    Object.entries(index.vocabulary || {}).forEach(([phrase, concept], idx) => {
      timeline.push(this.toTimelineEntry(`vocab-${idx}`, "vocab", `${phrase} → ${concept}`, { timestamp: undefined }));
    });

    index.pitchMilestones.forEach((milestone) => {
      timeline.push(
        this.toTimelineEntry(
          milestone.id,
          "milestone",
          milestone.description,
          milestone,
          { milestoneType: milestone.type }
        )
      );
    });

    index.soundworldAssets.forEach((asset: any) => {
      timeline.push(
        this.toTimelineEntry(
          asset.id || `garden-${timeline.length}`,
          "garden",
          asset.summary || asset.name || "Soundworld sketch",
          asset,
          { palette: asset.palette, mood: asset.mood }
        )
      );
    });

    index.listeningLogs.forEach((entry: any, idx: number) => {
      timeline.push(
        this.toTimelineEntry(
          entry.id || `listen-${idx}`,
          "listen",
          entry.notes || entry.track || "Listening",
          entry,
          { source: entry.source }
        )
      );
    });

    return timeline.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  async getVocabularyMap(): Promise<Record<string, string>> {
    const vocab = await this.resolveObject(this.store.getVocabularyMap?.(this.userId));
    return vocab ?? {};
  }

  async getMasteryMilestones(): Promise<Milestone[]> {
    return this.resolveArray(this.store.getPitchMilestones?.(this.userId));
  }

  async getHeistHistory(): Promise<HeistReport[]> {
    return this.resolveArray(this.store.getHeists?.(this.userId));
  }

  async getSongProjects(): Promise<SongProjectSummary[]> {
    return this.resolveArray(this.store.getSongProjects?.(this.userId));
  }

  async getGardenScrapbook(): Promise<GardenMemory[]> {
    return this.resolveArray(this.store.getGardenScrapbook?.(this.userId));
  }

  async getLabExperiments(): Promise<LabExperiment[]> {
    return this.resolveArray(this.store.getLabExperiments?.(this.userId));
  }

  async askDeepSeekForReflection(): Promise<string> {
    const [timeline, vocabulary, milestones] = await Promise.all([
      this.getTimeline(),
      this.getVocabularyMap(),
      this.getMasteryMilestones(),
    ]);

    if (typeof this.deepSeek.reflectOnArchive === "function") {
      return await this.deepSeek.reflectOnArchive({
        userId: this.userId,
        timeline,
        vocabulary,
        milestones,
      });
    }

    return "Your archive hums under flickering lights — a collage of drills, heists, and neon notes.";
  }
}
