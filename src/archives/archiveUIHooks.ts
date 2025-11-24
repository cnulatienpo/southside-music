import { ArchiveIndex, GardenMemory, LabExperiment, Milestone, SongProjectSummary, TimelineEntry } from "./archiveIndex";
import { HeistReport } from "./memoryStructures";

export interface ArchiveUIHooks {
  onRenderTimeline?: (timeline: TimelineEntry[]) => void;
  onRenderIndex?: (index: ArchiveIndex) => void;
  onRenderVocabularyMap?: (map: Record<string, string>) => void;
  onRenderMilestones?: (milestones: Milestone[]) => void;
  onRenderHeists?: (heistReports: HeistReport[]) => void;
  onRenderSongs?: (songProjects: SongProjectSummary[]) => void;
  onRenderGarden?: (gardenScrapbook: GardenMemory[]) => void;
  onRenderLab?: (labExperiments: LabExperiment[]) => void;
  onReflection?: (text: string) => void;
  onClear?: () => void;
}

/**
 * ArchiveUI provides a metal-cabinet inspired callback layer for ArchiveEngine data.
 * Think drawers sliding out, blueprint diagrams pinned up, neon circles over wins,
 * cassette labels on every timeline node, and graffiti-scrawled graphs of progress.
 */
export class ArchiveUI {
  private hooks: ArchiveUIHooks;

  constructor(hooks: ArchiveUIHooks = {}) {
    this.hooks = hooks;
  }

  public renderTimeline(timeline: TimelineEntry[]): void {
    this.hooks.onRenderTimeline?.(timeline);
  }

  public renderIndex(index: ArchiveIndex): void {
    this.hooks.onRenderIndex?.(index);
  }

  public renderVocabulary(map: Record<string, string>): void {
    this.hooks.onRenderVocabularyMap?.(map);
  }

  public renderMilestones(milestones: Milestone[]): void {
    this.hooks.onRenderMilestones?.(milestones);
  }

  public renderHeists(heistReports: HeistReport[]): void {
    this.hooks.onRenderHeists?.(heistReports);
  }

  public renderSongs(songProjects: SongProjectSummary[]): void {
    this.hooks.onRenderSongs?.(songProjects);
  }

  public renderGarden(gardenScrapbook: GardenMemory[]): void {
    this.hooks.onRenderGarden?.(gardenScrapbook);
  }

  public renderLab(labExperiments: LabExperiment[]): void {
    this.hooks.onRenderLab?.(labExperiments);
  }

  public renderReflection(text: string): void {
    this.hooks.onReflection?.(text);
  }

  public clear(): void {
    this.hooks.onClear?.();
  }
}
