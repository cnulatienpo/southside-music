export interface ArchiveIndex {
  drills: TimelineEntry[];
  heists: HeistReport[];
  seeds: TimelineEntry[];
  soundworldAssets: GardenMemory[];
  songSections: SongProjectSummary[];
  vocabularyMappings: Record<string, string>;
  pitchMilestones: Milestone[];
  listeningLogs: TimelineEntry[];
  labExperiments: LabExperiment[];
  gardenScrapbook: GardenMemory[];
}

export interface TimelineEntry {
  id: string;
  timestamp: string;
  type: "drill" | "heist" | "seed" | "song" | "vocab" | "milestone" | "garden" | "lab" | "listen";
  summary: string;
  metadata: Record<string, any>;
}

export interface Milestone {
  id: string;
  type: "octave" | "contour" | "color" | "rhythm" | "recognition";
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
  userId: string;
  createdAt: string;
  sourceDescription: string;
  heistMode: "form" | "context" | "mixed";
  perceivedRuthlessness?: number;
  perceivedCreativity?: number;
  perceivedEffort?: number;
  notes?: string;
}
