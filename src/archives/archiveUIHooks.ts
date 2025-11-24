/**
 * ARCHIVE UI HOOKS
 * Visualize the Archives as an urban memory vault — industrial cabinets,
 * blueprint pinboards, neon tape, and graffiti tags tracing progress.
 */

import {
  ArchiveIndex,
  GardenMemory,
  LabExperiment,
  Milestone,
  SongProjectSummary,
  TimelineEntry,
} from "./archiveIndex";

export interface ArchiveUIHooks {
  onRenderTimeline?: (timeline: TimelineEntry[]) => void;
  onRenderIndex?: (index: ArchiveIndex) => void;
  onRenderVocabularyMap?: (map: Record<string, string>) => void;
  onRenderMilestones?: (milestones: Milestone[]) => void;
  onRenderHeists?: (heistReports: any[]) => void;
  onRenderSongs?: (songProjects: SongProjectSummary[]) => void;
  onRenderGarden?: (gardenScrapbook: GardenMemory[]) => void;
  onRenderLab?: (labExperiments: LabExperiment[]) => void;
  onReflection?: (text: string) => void;
  onClear?: () => void;
}

/**
 * ArchiveUI is a lightweight mediator that hands data to rendering callbacks.
 * The visual language should feel like opening and sliding drawers, pinning
 * blueprint diagrams, and highlighting achievements with fluorescent markers.
 */
export class ArchiveUI {
  private hooks: ArchiveUIHooks;

  constructor(hooks: ArchiveUIHooks = {}) {
    this.hooks = hooks;
  }

  renderTimeline(timeline: TimelineEntry[]): void {
    this.hooks.onRenderTimeline?.(timeline);
  }

  renderIndex(index: ArchiveIndex): void {
    this.hooks.onRenderIndex?.(index);
  }

  renderVocabulary(map: Record<string, string>): void {
    this.hooks.onRenderVocabularyMap?.(map);
  }

  renderMilestones(milestones: Milestone[]): void {
    this.hooks.onRenderMilestones?.(milestones);
  }

  renderHeists(heistReports: any[]): void {
    this.hooks.onRenderHeists?.(heistReports);
  }

  renderSongs(songProjects: SongProjectSummary[]): void {
    this.hooks.onRenderSongs?.(songProjects);
  }

  renderGarden(gardenScrapbook: GardenMemory[]): void {
    this.hooks.onRenderGarden?.(gardenScrapbook);
  }

  renderLab(labExperiments: LabExperiment[]): void {
    this.hooks.onRenderLab?.(labExperiments);
  }

  renderReflection(text: string): void {
    this.hooks.onReflection?.(text);
  }

  clear(): void {
    this.hooks.onClear?.();
  }
}
