import { HubDestination } from "./hubEngine";

export class HubMapLayout {
  public buildLayout(destinations: HubDestination[]): Record<
    string,
    { x: number; y: number; iconHint?: string; doorShape?: string }
  > {
    const layout: Record<string, { x: number; y: number; iconHint?: string; doorShape?: string }> = {
      beats: { x: 5, y: 8, iconHint: "metronome", doorShape: "utility_closet" },
      bass: { x: 2, y: 14, iconHint: "stairs", doorShape: "stairwell" },
      voice: { x: 9, y: 6, iconHint: "mic", doorShape: "intercom_panel" },
      guitar: { x: 12, y: 10, iconHint: "amp", doorShape: "loading_dock" },
      keys: { x: 14, y: 5, iconHint: "neon_keys", doorShape: "neon_arch" },
      structure: { x: 7, y: 11, iconHint: "map", doorShape: "mapboard" },
      texture: { x: 10, y: 13, iconHint: "vending", doorShape: "vending_gap" },
      theft: { x: 1, y: 9, iconHint: "gate", doorShape: "metal_gate" },
      lab: { x: 4, y: 4, iconHint: "lab", doorShape: "wired_door" },
      dojo: { x: 6, y: 15, iconHint: "dojo", doorShape: "rehearsal_door" },
      garden: { x: 16, y: 9, iconHint: "leaves", doorShape: "side_exit" },
      bazaar: { x: 13, y: 15, iconHint: "tarp", doorShape: "tarp_corridor" },
      songbuilder: { x: 8, y: 18, iconHint: "ramp", doorShape: "factory_ramp" },
      archives: { x: 3, y: 1, iconHint: "stairs_up", doorShape: "rusty_stairs" },
    };

    for (const destination of destinations) {
      if (!layout[destination.id]) {
        layout[destination.id] = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
          iconHint: destination.iconHint,
          doorShape: "auxiliary_door",
        };
      }
    }

    return layout;
  }
}
