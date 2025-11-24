import { nanoid } from "nanoid";
import { AudioEvent } from "../dualMode/audioMusicModel";

export type SoundElement = {
  name: string;
  description: string;
  tags: string[];
  defaultOptions?: {
    intensity?: number;
    spread?: number;
    duration?: number;
  };
};

export class GardenSoundworld {
  private library: Map<string, SoundElement> = new Map();

  loadDefaultUrbanSet(): void {
    const defaults: SoundElement[] = [
      {
        name: "metal-pipe hit",
        description: "Sharp clang from hollow metal pipes",
        tags: ["percussion", "metal", "attack"],
        defaultOptions: { intensity: 0.8 },
      },
      {
        name: "steam hiss",
        description: "Pressurized steam venting in bursts",
        tags: ["noise", "air", "sustain"],
        defaultOptions: { duration: 1200 },
      },
      {
        name: "subway-rumble bass",
        description: "Low rolling bass like a passing train",
        tags: ["bass", "drone", "motion"],
        defaultOptions: { duration: 1800, intensity: 0.9 },
      },
      {
        name: "chain drag percussion",
        description: "Loose chains scraping concrete",
        tags: ["percussion", "texture", "grit"],
        defaultOptions: { spread: 3 },
      },
      {
        name: "neon buzz pad",
        description: "Electric hum with flicker artifacts",
        tags: ["pad", "electric", "sustain"],
        defaultOptions: { duration: 2000 },
      },
      {
        name: "air duct drone",
        description: "Hollow wind inside metal ducts",
        tags: ["drone", "hollow", "air"],
      },
      {
        name: "CRT static burst",
        description: "Broken display static snaps",
        tags: ["noise", "spark", "burst"],
        defaultOptions: { intensity: 0.6 },
      },
      {
        name: "crosswalk beep rhythm",
        description: "City crosswalk signal beeps in tempo",
        tags: ["pulse", "beep", "bright"],
      },
      {
        name: "manhole echo reverb",
        description: "Metallic verb tail from underground",
        tags: ["reverb", "metallic", "space"],
      },
    ];

    defaults.forEach((element) => this.library.set(element.name, element));
  }

  spawn(
    elementName: string,
    options?: { startTime?: number; intensity?: number; duration?: number; spread?: number }
  ): AudioEvent[] {
    const element = this.library.get(elementName);
    if (!element) return [];

    const baseTimestamp = options?.startTime ?? 0;
    const intensity = options?.intensity ?? element.defaultOptions?.intensity ?? 0.7;
    const duration = options?.duration ?? element.defaultOptions?.duration ?? 800;
    const spread = options?.spread ?? element.defaultOptions?.spread ?? 1;

    const events: AudioEvent[] = [
      {
        id: `${elementName}-${nanoid()}`,
        type: element.tags.includes("percussion") ? "beat" : "effect",
        timestamp: baseTimestamp,
        velocity: Math.round(intensity * 127),
        duration,
        metadata: { tags: element.tags, source: elementName },
      },
    ];

    for (let i = 1; i < spread; i += 1) {
      events.push({
        ...events[0],
        id: `${elementName}-${nanoid()}`,
        timestamp: baseTimestamp + i * (duration * 0.2),
      });
    }

    return events;
  }

  listAvailable(): string[] {
    return Array.from(this.library.keys());
  }
}
