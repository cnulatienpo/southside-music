import fs from "fs";
import path from "path";
import { loadNPCProfiles } from "../circuits/npcProfiles";
import { loadBackgrounds } from "../circuits/visual/backgroundRegistry";
import type { CircuitScene, CircuitToolId } from "../circuits/circuitsTypes";
import type { AIPersona, SouthsideMode, SouthsideNPC, SouthsideLocation } from "./sharedTypes";

export interface SouthsideConfig {
  bannedWords: string[];
  toneGuidelines: string[];
  modeDescriptions: Record<string, string>;
  aiPersonaConfig: AIPersona;
  noGradingRules: string[];
  boundaryLine: string;
  toolsRegistry: CircuitToolId[];
  scenesRegistry: CircuitScene[];
  npcRegistry: SouthsideNPC[];
  locationsRegistry: SouthsideLocation[];
  modes: SouthsideMode[];
}

const boundaryLine = "Not for nothin’, but this game ain’t like that.";

const bannedWords = ["correct", "wrong", "mistake", "grade", "fail", "assignment", "test", "score"];

const toneGuidelines = [
  "casual urban-industrial tone with city grit",
  "never talk down to player",
  "no grading, no scores",
  "no teacher voice",
  "use sensory city metaphors",
  "encouraging but never evaluative",
  "player chooses direction always",
];

const modeDescriptions: Record<string, string> = {
  lab: "underground experiment hall with blueprints + bubbling gear",
  dojo: "industrial training room with scuffed floors + fans",
  garden: "urban greenhouse empty lot for creativity",
  bazaar: "flea market of global sound",
  theft: "chaotic guild of aesthetic theft",
  songbuilder: "factory floor where tracks are assembled",
  archive: "industrial memory vault",
  circuits: "scene-based sandbox world",
};

const aiPersonaConfig: AIPersona = {
  name: "Southside Guide",
  voice: "casual, gritty, encouraging",
  principles: [
    "never lecture, always co-create",
    "stay curious and mirror the player's words",
    "keep everything grounded in city textures and motion",
  ],
  samplePhrases: [
    boundaryLine,
    "you call the shots; I'm just here to keep the hum steady",
    "let's reroute this vibe through the laundromat spin cycle",
  ],
};

const noGradingRules = [
  "never say correct",
  "never say wrong",
  "never imply evaluation",
  `reinforce boundary: "${boundaryLine}"`,
  "encourage curiosity not performance",
  "reflect player language",
];

const toolsRegistry: CircuitToolId[] = [
  "textInput",
  "tapInput",
  "sliderInput",
  "dialInput",
  "padGrid",
  "gestureInput",
  "micInputStub",
];

function loadScenesRegistry(): CircuitScene[] {
  const candidatePath = path.join(__dirname, "../circuits/circuitsScenes.js");
  if (fs.existsSync(candidatePath)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const moduleExports = require(candidatePath);
    if (typeof moduleExports.loadCircuitsScenes === "function") {
      return moduleExports.loadCircuitsScenes();
    }
    if (Array.isArray(moduleExports.default)) {
      return moduleExports.default as CircuitScene[];
    }
  }
  return [];
}

export const defaultSouthsideConfig: SouthsideConfig = {
  bannedWords,
  toneGuidelines,
  modeDescriptions,
  aiPersonaConfig,
  noGradingRules,
  boundaryLine,
  toolsRegistry,
  scenesRegistry: loadScenesRegistry(),
  npcRegistry: loadNPCProfiles(),
  locationsRegistry: loadBackgrounds(),
  modes: Object.entries(modeDescriptions).map(([id, description]) => ({
    id: id as SouthsideMode["id"],
    description,
  })),
};

export function loadConfig(): SouthsideConfig {
  return defaultSouthsideConfig;
}
