/**
 * ARCHIVES MEMORY STRUCTURES (duplicate exports for convenience)
 * These types mirror the definitions in archiveIndex.ts so other
 * systems can import a consistent contract without circular imports.
 */

export interface TimelineEntry {
  id: string;
  timestamp: string;
  type: string;
  summary: string;
  metadata: Record<string, any>;
}

export interface Milestone {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface SongProjectSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sections: number;
  notes?: string;
}

export interface GardenMemory {
  id: string;
  seedText: string;
  shapes: any[];
  audioEvents: any[];
}

export interface LabExperiment {
  id: string;
  concept: string;
  result: any;
  timestamp: string;
}

export interface HeistReport {
  id: string;
  target?: string;
  loot?: string;
  insight?: string;
  timestamp: string;
  outcome?: string;
}

export interface ArchiveIndex {
  drills: any[];
  heists: HeistReport[];
  seeds: any[];
  soundworldAssets: any[];
  songSections: any[];
  vocabulary: Record<string, string>;
  pitchMilestones: Milestone[];
  listeningLogs: any[];
}
