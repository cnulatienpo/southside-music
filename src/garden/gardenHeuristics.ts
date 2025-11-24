export type SeedAnalysis = {
  motionPattern: string;
  textureProfile: string;
  environmentalCue: string;
  rhythmicShape: string;
  intensity: string;
};

const MOTION_MAP: Record<string, string> = {
  push: "pushing forward",
  drag: "dragging weight",
  slide: "sliding on wet concrete",
  sway: "swaying like loose cables",
  spiral: "spiraling neon",
  rush: "rushing subway draft",
  swing: "swinging steel beams",
};

const TEXTURE_MAP: Record<string, string> = {
  grit: "gritty metal",
  rough: "rough concrete",
  smooth: "smooth wet pavement",
  glassy: "glassy neon",
  rusty: "rusted iron",
  oily: "oily asphalt",
  dusty: "dusty warehouse",
};

const ENV_MAP: Record<string, string> = {
  subway: "subway tunnel",
  streetlight: "under sodium streetlights",
  alley: "back alley",
  rooftop: "rooftop with vents",
  fire: "fire escape",
  rail: "train rail",
  duct: "air duct corridor",
};

const RHYTHM_MAP: Record<string, string> = {
  chain: "chain-swing syncopation",
  clank: "clanking off-beats",
  hiss: "steam stutters",
  hum: "neon pulse",
  drip: "puddle drips",
  stomp: "loading-dock stomp",
};

const INTENSITY_KEYWORDS: Record<string, string> = {
  tense: "tense",
  urgent: "urgent",
  frantic: "frantic",
  lazy: "laid-back",
  calm: "steady",
  soft: "soft glow",
  hard: "hard-edged",
};

const DEFAULT_ANALYSIS: SeedAnalysis = {
  motionPattern: "wandering scaffolding",
  textureProfile: "gritty metal",
  environmentalCue: "industrial greenhouse",
  rhythmicShape: "neon pulse",
  intensity: "steady",
};

function pickMatch(text: string, mapping: Record<string, string>, fallback: string): string {
  const key = Object.keys(mapping).find((item) => text.includes(item));
  return key ? mapping[key] : fallback;
}

export function analyzeSeed(seedText: string): SeedAnalysis {
  if (!seedText) return { ...DEFAULT_ANALYSIS };
  const lower = seedText.toLowerCase();

  const motionPattern = pickMatch(lower, MOTION_MAP, DEFAULT_ANALYSIS.motionPattern);
  const textureProfile = pickMatch(lower, TEXTURE_MAP, DEFAULT_ANALYSIS.textureProfile);
  const environmentalCue = pickMatch(lower, ENV_MAP, DEFAULT_ANALYSIS.environmentalCue);
  const rhythmicShape = pickMatch(lower, RHYTHM_MAP, DEFAULT_ANALYSIS.rhythmicShape);
  const intensity = pickMatch(lower, INTENSITY_KEYWORDS, DEFAULT_ANALYSIS.intensity);

  return {
    motionPattern,
    textureProfile,
    environmentalCue,
    rhythmicShape,
    intensity,
  };
}
