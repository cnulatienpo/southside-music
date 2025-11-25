import type { CircuitScene, CircuitTopic, CircuitToolId } from "../circuits/circuitsTypes";
import type { CircuitsBackground } from "../circuits/visual/backgroundRegistry";
import type { NPCProfile } from "../circuits/npcProfiles";

export type SouthsideEngineName =
  | "lab"
  | "dojo"
  | "garden"
  | "bazaar"
  | "theft"
  | "songbuilder"
  | "archive"
  | "circuits";

export interface SouthsideMode {
  id: SouthsideEngineName;
  description: string;
  iconHint?: string;
}

export type SouthsideLocation = CircuitsBackground;
export type SouthsideNPC = NPCProfile;
export type SouthsideTool = CircuitToolId;
export type SouthsideScene = CircuitScene;

export interface SouthsideRunSummary {
  chainId: string;
  topicsVisited: CircuitTopic[];
  npcNames: string[];
  length: number;
  createdAt: string;
}

export type Souvenir = {
  id: string;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
};

export type TrophyTag = string;

export type SouthsideSouvenir = Souvenir;
export type SouthsideTrophyTag = TrophyTag;

export interface AIPersona {
  name: string;
  voice: string;
  principles: string[];
  samplePhrases?: string[];
}
