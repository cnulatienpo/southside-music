/**
 * ARCHIVES INDEX
 * Defines the structures returned by the ArchiveEngine.
 */

export interface TimelineEntry {
  id: string;
  timestamp: string;
  type: string; // "drill","heist","seed","song","vocab","milestone","garden","lab","listen"
  summary: string;
  metadata: Record<string, any>;
}

export interface Milestone {
  id: string;
  type: string; // "octave","contour","color","rhythm","recognition"
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
