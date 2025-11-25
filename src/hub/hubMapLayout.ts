import { HubDestination } from "./hubEngine";

export type HubMapPosition = {
  x: number;
  y: number;
  iconHint?: string;
  doorShape?: string;
};

type HubMap = Record<string, HubMapPosition>;

export class HubMapLayout {
  private readonly baseline: HubMap;

  constructor(destinations?: HubDestination[]) {
    this.baseline = this.buildBaseline(destinations ?? []);
  }

  getLayout(): HubMap {
    return { ...this.baseline };
  }

  private buildBaseline(destinations: HubDestination[]): HubMap {
    const defaultMap: HubMap = {
      beats: { x: 0.1, y: 0.55, iconHint: "clockwork-gear", doorShape: "utility" },
      bass: { x: 0.2, y: 0.72, iconHint: "low-step", doorShape: "stairwell" },
      voice: { x: 0.25, y: 0.38, iconHint: "speech-wave", doorShape: "intercom" },
      guitar: { x: 0.35, y: 0.6, iconHint: "lightning-pick", doorShape: "cage" },
      keys: { x: 0.42, y: 0.32, iconHint: "neon-keys", doorShape: "arcade" },
      structure: { x: 0.5, y: 0.48, iconHint: "map-lines", doorShape: "bus-map" },
      texture: { x: 0.58, y: 0.58, iconHint: "layered-tiles", doorShape: "vending" },
      theft: { x: 0.65, y: 0.2, iconHint: "crowbar", doorShape: "rollup" },
      lab: { x: 0.7, y: 0.42, iconHint: "beaker", doorShape: "glass" },
      dojo: { x: 0.75, y: 0.68, iconHint: "dojo-banner", doorShape: "rehearsal" },
      garden: { x: 0.85, y: 0.82, iconHint: "leaf-spray", doorShape: "side-door" },
      bazaar: { x: 0.82, y: 0.52, iconHint: "market-lantern", doorShape: "tarp" },
      songbuilder: { x: 0.62, y: 0.88, iconHint: "assembly", doorShape: "ramp" },
      archives: { x: 0.9, y: 0.28, iconHint: "stacked-boxes", doorShape: "stairs" },
    };

    destinations.forEach((destination) => {
      if (!defaultMap[destination.id]) {
        defaultMap[destination.id] = {
          x: 0.5 + Math.random() * 0.1,
          y: 0.5 + Math.random() * 0.1,
          iconHint: destination.iconHint,
          doorShape: "graffiti",
        };
      }
    });

    return defaultMap;
  }
}
