import dayjs from "dayjs";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { EarTrainingLogEntry, TheftHeistReport, UserDataStore } from "../data/userDataStore";
import {
  ArchiveIndex,
  GardenMemory,
  HeistReport,
  LabExperiment,
  Milestone,
  SongProjectSummary,
  TimelineEntry,
} from "./archiveIndex";

export class ArchiveEngine {
  private readonly userId: string;
  private readonly store: UserDataStore;
  private readonly deepSeek: DeepSeekEngine;

  private vocabularyMap: Record<string, string> = {};
  private masteryMilestones: Milestone[] = [];
  private songProjects: SongProjectSummary[] = [];
  private gardenScrapbook: GardenMemory[] = [];
  private labExperiments: LabExperiment[] = [];
  private drills: TimelineEntry[] = [];
  private seeds: TimelineEntry[] = [];
  private soundworldAssets: GardenMemory[] = [];

  constructor(options: { userId: string; store: UserDataStore; deepSeek: DeepSeekEngine }) {
    this.userId = options.userId;
    this.store = options.store;
    this.deepSeek = options.deepSeek;
  }

  public setVocabularyMap(map: Record<string, string>): void {
    this.vocabularyMap = { ...map };
  }

  public setMasteryMilestones(milestones: Milestone[]): void {
    this.masteryMilestones = [...milestones];
  }

  public setSongProjects(projects: SongProjectSummary[]): void {
    this.songProjects = [...projects];
  }

  public setGardenScrapbook(memories: GardenMemory[]): void {
    this.gardenScrapbook = [...memories];
  }

  public setLabExperiments(experiments: LabExperiment[]): void {
    this.labExperiments = [...experiments];
  }

  public setDrills(drillEntries: TimelineEntry[]): void {
    this.drills = [...drillEntries];
  }

  public setSeeds(seedEntries: TimelineEntry[]): void {
    this.seeds = [...seedEntries];
  }

  public setSoundworldAssets(assets: GardenMemory[]): void {
    this.soundworldAssets = [...assets];
  }

  public async getFullIndex(): Promise<ArchiveIndex> {
    const [heists, listeningLogs] = await Promise.all([
      this.safeGetHeistHistory(),
      this.safeGetListeningLogs(),
    ]);

    return {
      drills: this.drills,
      heists,
      seeds: this.seeds,
      soundworldAssets: this.soundworldAssets,
      songSections: this.songProjects,
      vocabularyMappings: { ...this.vocabularyMap },
      pitchMilestones: this.masteryMilestones,
      listeningLogs: listeningLogs.map((log) => this.mapListeningToTimeline(log)),
      labExperiments: this.labExperiments,
      gardenScrapbook: this.gardenScrapbook.length > 0 ? this.gardenScrapbook : this.soundworldAssets,
    };
  }

  public async getTimeline(): Promise<TimelineEntry[]> {
    const index = await this.getFullIndex();

    const timelineSeeds: TimelineEntry[] = [
      ...index.drills,
      ...index.seeds,
      ...index.listeningLogs,
      ...index.pitchMilestones.map((milestone) => ({
        id: milestone.id,
        timestamp: milestone.timestamp,
        type: "milestone" as const,
        summary: milestone.description,
        metadata: { milestoneType: milestone.type },
      })),
      ...index.heists.map((heist) => this.mapHeistToTimeline(heist)),
      ...index.songSections.map((song) => ({
        id: song.id,
        timestamp: song.updatedAt,
        type: "song" as const,
        summary: song.title,
        metadata: { sections: song.sections, notes: song.notes },
      })),
      ...index.labExperiments.map((experiment) => ({
        id: experiment.id,
        timestamp: experiment.timestamp,
        type: "lab" as const,
        summary: experiment.concept,
        metadata: { result: experiment.result },
      })),
    ];

    const timeline = timelineSeeds.filter((entry) => Boolean(entry.timestamp));
    timeline.sort((a, b) => dayjs(a.timestamp).diff(dayjs(b.timestamp)));
    return timeline;
  }

  public async getVocabularyMap(): Promise<Record<string, string>> {
    return { ...this.vocabularyMap };
  }

  public async getMasteryMilestones(): Promise<Milestone[]> {
    return [...this.masteryMilestones];
  }

  public async getHeistHistory(): Promise<HeistReport[]> {
    return this.safeGetHeistHistory();
  }

  public async getSongProjects(): Promise<SongProjectSummary[]> {
    return [...this.songProjects];
  }

  public async getGardenScrapbook(): Promise<GardenMemory[]> {
    return [...this.gardenScrapbook];
  }

  public async getLabExperiments(): Promise<LabExperiment[]> {
    return [...this.labExperiments];
  }

  public async askDeepSeekForReflection(): Promise<string> {
    const prompt = [
      "Archive reflection request:",
      "- Tone: flickering fluorescent lights, metal drawers, blueprint walls, graffiti annotations.",
      "- Voice: note patterns, color associations, playful but observant.",
      "Share a short poetic reflection on the player's evolution without grading them.",
    ].join("\n");

    return this.deepSeek.generateNoGradingResponse({ userId: this.userId, userMessage: prompt });
  }

  private async safeGetHeistHistory(): Promise<HeistReport[]> {
    try {
      const heists = await this.store.getTheftHistory(this.userId, 200);
      return heists.map((heist) => this.mapHeistReport(heist));
    } catch (error) {
      console.error("Failed to pull heist history for archives", error);
      return [];
    }
  }

  private async safeGetListeningLogs(): Promise<EarTrainingLogEntry[]> {
    try {
      return await this.store.getEarTrainingHistory(this.userId, 200);
    } catch (error) {
      console.error("Failed to pull listening logs for archives", error);
      return [];
    }
  }

  private mapHeistReport(report: TheftHeistReport): HeistReport {
    return {
      id: report.id,
      userId: report.userId,
      createdAt: report.createdAt,
      sourceDescription: report.sourceDescription,
      heistMode: report.heistMode,
      perceivedRuthlessness: report.perceivedRuthlessness,
      perceivedCreativity: report.perceivedCreativity,
      perceivedEffort: report.perceivedEffort,
      notes: report.notes,
    };
  }

  private mapHeistToTimeline(report: HeistReport): TimelineEntry {
    return {
      id: report.id,
      timestamp: report.createdAt,
      type: "heist",
      summary: `${report.heistMode} lift: ${report.sourceDescription}`,
      metadata: {
        perceivedRuthlessness: report.perceivedRuthlessness,
        perceivedCreativity: report.perceivedCreativity,
        perceivedEffort: report.perceivedEffort,
        notes: report.notes,
      },
    };
  }

  private mapListeningToTimeline(entry: EarTrainingLogEntry): TimelineEntry {
    return {
      id: entry.id,
      timestamp: entry.createdAt,
      type: "listen",
      summary: `Listening: ${entry.exerciseType}`,
      metadata: {
        difficultyLevel: entry.difficultyLevel,
        userResponse: entry.userResponse,
        systemContext: entry.systemContext,
      },
    };
  }
}
