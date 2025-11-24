import { CircuitsBackground } from "./backgroundRegistry";

export type AmbientInstructionType = "flicker" | "steam" | "rumble";

export interface AmbientInstruction {
  type: AmbientInstructionType;
  interval: number;
  intensity: number;
}

export class AmbientAnimationEngine {
  private readonly defaultFallback: AmbientInstruction = {
    type: "rumble",
    interval: 1500,
    intensity: 0.2,
  };

  private readonly ambientMap: Record<string, AmbientInstruction> = {
    steam_vent: { type: "steam", interval: 1200, intensity: 0.6 },
    light_flicker: { type: "flicker", interval: 900, intensity: 0.4 },
    distant_rumble: { type: "rumble", interval: 1800, intensity: 0.35 },
    motor_hum: { type: "rumble", interval: 1400, intensity: 0.25 },
    light_sway: { type: "flicker", interval: 1600, intensity: 0.3 },
    fan_spin: { type: "rumble", interval: 1100, intensity: 0.2 },
    low_rumble: { type: "rumble", interval: 2000, intensity: 0.45 },
    fridge_hum: { type: "rumble", interval: 1700, intensity: 0.22 },
    traffic_rumble: { type: "rumble", interval: 1300, intensity: 0.32 },
    screen_glow: { type: "flicker", interval: 1500, intensity: 0.28 },
    hammer_echo: { type: "rumble", interval: 1000, intensity: 0.42 },
    electric_hum: { type: "rumble", interval: 1250, intensity: 0.3 },
    wind_sway: { type: "flicker", interval: 2100, intensity: 0.26 },
    water_echo: { type: "rumble", interval: 1600, intensity: 0.24 },
    chain_rattle: { type: "rumble", interval: 900, intensity: 0.38 },
    crowd_murmur: { type: "rumble", interval: 1900, intensity: 0.2 },
  };

  getAmbientAnimations(background: CircuitsBackground): AmbientInstruction[] {
    const instructions: AmbientInstruction[] = [];

    for (const ambient of background.ambient || []) {
      const preset = this.ambientMap[ambient];
      if (preset) {
        instructions.push(preset);
      } else {
        instructions.push(this.defaultFallback);
      }
    }

    if (instructions.length === 0) {
      instructions.push(this.defaultFallback);
    }

    return instructions;
  }
}
