import type { CircuitsBackground } from "./backgroundRegistry";

export type AmbientType = "flicker" | "steam" | "rumble" | "sway";

export interface AmbientInstruction {
  type: AmbientType;
  interval: number;
  intensity: number;
}

const ambientLookup: Record<string, AmbientInstruction> = {
  steam_vent: { type: "steam", interval: 1200, intensity: 0.6 },
  light_flicker: { type: "flicker", interval: 900, intensity: 0.4 },
  distant_rumble: { type: "rumble", interval: 2000, intensity: 0.3 },
  fan_wobble: { type: "sway", interval: 1500, intensity: 0.45 },
  neon_buzz: { type: "flicker", interval: 750, intensity: 0.35 },
  machine_hum: { type: "rumble", interval: 1800, intensity: 0.25 },
  sign_creak: { type: "sway", interval: 1700, intensity: 0.5 },
  rail_rattle: { type: "rumble", interval: 1200, intensity: 0.45 },
  drip_echo: { type: "flicker", interval: 1400, intensity: 0.28 },
  traffic_sway: { type: "sway", interval: 1600, intensity: 0.4 },
  fridge_hum: { type: "rumble", interval: 1500, intensity: 0.22 },
  crowd_murmur: { type: "rumble", interval: 1900, intensity: 0.2 },
};

export class AmbientAnimationEngine {
  getAmbientAnimations(background: CircuitsBackground): AmbientInstruction[] {
    const seen = new Set<string>();
    return background.ambient
      .map((ambientKey) => {
        const instruction = ambientLookup[ambientKey];
        if (!instruction || seen.has(ambientKey)) {
          return null;
        }
        seen.add(ambientKey);
        return instruction;
      })
      .filter((inst): inst is AmbientInstruction => Boolean(inst));
  }
}
