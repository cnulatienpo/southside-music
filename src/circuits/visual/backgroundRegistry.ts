export interface CircuitsBackground {
  id: string;
  name: string;
  description: string;
  layers: {
    id: string;
    artHint: string;
    parallax?: number;
  }[];
  ambient: string[];
}

export function loadBackgrounds(): CircuitsBackground[] {
  const backgrounds: CircuitsBackground[] = [
    {
      id: "corner_store_night",
      name: "Corner Store at Night",
      description: "aisles, buzzing fridge lights",
      layers: [
        { id: "shelves", artHint: "product shelves", parallax: 0.12 },
        { id: "counter", artHint: "checkout counter", parallax: 0.08 },
        { id: "signs", artHint: "hanging neon signs", parallax: 0.18 },
      ],
      ambient: ["light_flicker", "fridge_hum"],
    },
    {
      id: "metro_platform_3am",
      name: "Metro Platform 3AM",
      description: "dim platform, flickering lights, tiled walls",
      layers: [
        { id: "platform", artHint: "empty platform edge", parallax: 0.06 },
        { id: "tracks", artHint: "tracks disappearing into dark", parallax: 0.14 },
        { id: "columns", artHint: "tiled columns", parallax: 0.1 },
      ],
      ambient: ["light_flicker", "distant_rumble"],
    },
    {
      id: "alley_steam_vent",
      name: "Alley Steam Vent",
      description: "brick walls, vent puffing steam",
      layers: [
        { id: "walls", artHint: "brick walls with grime", parallax: 0.08 },
        { id: "vent", artHint: "vent with pipe", parallax: 0.16 },
        { id: "ground", artHint: "wet pavement", parallax: 0.05 },
      ],
      ambient: ["steam_vent", "distant_rumble"],
    },
    {
      id: "laundromat_empty",
      name: "Laundromat Empty",
      description: "rows of machines, hum of motors",
      layers: [
        { id: "machines", artHint: "washer rows", parallax: 0.14 },
        { id: "tables", artHint: "folding tables", parallax: 0.12 },
        { id: "ceiling", artHint: "vented ceiling", parallax: 0.06 },
      ],
      ambient: ["motor_hum", "light_flicker"],
    },
    {
      id: "flea_market_aisle",
      name: "Flea Market Aisle",
      description: "tarps, crates, hanging lights",
      layers: [
        { id: "tarps", artHint: "hanging tarps", parallax: 0.2 },
        { id: "crates", artHint: "crates and boxes", parallax: 0.1 },
        { id: "lights", artHint: "strings of bulbs", parallax: 0.18 },
      ],
      ambient: ["light_sway", "crowd_murmur"],
    },
    {
      id: "rooftop_AC_units",
      name: "Rooftop AC Units",
      description: "big fans slowly rotating",
      layers: [
        { id: "skyline", artHint: "distant skyline", parallax: 0.04 },
        { id: "units", artHint: "AC units with fans", parallax: 0.16 },
        { id: "rails", artHint: "safety rails", parallax: 0.12 },
      ],
      ambient: ["fan_spin", "low_rumble"],
    },
    {
      id: "diner_backroom",
      name: "Diner Backroom",
      description: "dirty floor, soda machine hum",
      layers: [
        { id: "floor", artHint: "linoleum floor", parallax: 0.08 },
        { id: "machines", artHint: "soda machine and fridge", parallax: 0.12 },
        { id: "boxes", artHint: "stacked supplies", parallax: 0.14 },
      ],
      ambient: ["fridge_hum", "light_flicker"],
    },
    {
      id: "loading_dock",
      name: "Loading Dock",
      description: "pallets, dumpsters, faint reverb",
      layers: [
        { id: "dock", artHint: "open dock edge", parallax: 0.1 },
        { id: "pallets", artHint: "pallets and crates", parallax: 0.16 },
        { id: "rollup", artHint: "roll-up doors", parallax: 0.12 },
      ],
      ambient: ["distant_rumble", "light_sway"],
    },
    {
      id: "underpass_graffiti",
      name: "Underpass Graffiti",
      description: "concrete pillars and sprayed murals",
      layers: [
        { id: "pillars", artHint: "concrete pillars", parallax: 0.08 },
        { id: "murals", artHint: "graffiti art", parallax: 0.14 },
        { id: "ground", artHint: "gravel and trash", parallax: 0.06 },
      ],
      ambient: ["traffic_rumble", "light_flicker"],
    },
    {
      id: "warehouse_corridor",
      name: "Warehouse Corridor",
      description: "long hallway with pipes overhead",
      layers: [
        { id: "walls", artHint: "corridor walls", parallax: 0.1 },
        { id: "pipes", artHint: "overhead pipes", parallax: 0.16 },
        { id: "floor", artHint: "polished concrete", parallax: 0.08 },
      ],
      ambient: ["steam_vent", "low_rumble"],
    },
    {
      id: "service_tunnel",
      name: "Service Tunnel",
      description: "narrow tunnel with cables",
      layers: [
        { id: "cables", artHint: "bundled cables", parallax: 0.18 },
        { id: "walls", artHint: "tight concrete walls", parallax: 0.12 },
        { id: "lights", artHint: "maintenance lights", parallax: 0.16 },
      ],
      ambient: ["light_flicker", "distant_rumble"],
    },
    {
      id: "parking_garage_low",
      name: "Parking Garage Low",
      description: "low ceiling, echo and fumes",
      layers: [
        { id: "beams", artHint: "support beams", parallax: 0.12 },
        { id: "lanes", artHint: "parking lanes", parallax: 0.1 },
        { id: "signage", artHint: "painted arrows", parallax: 0.08 },
      ],
      ambient: ["distant_rumble", "light_flicker"],
    },
    {
      id: "fire_escape_view",
      name: "Fire Escape View",
      description: "stairs overlooking alley",
      layers: [
        { id: "stairs", artHint: "metal stairs", parallax: 0.14 },
        { id: "rail", artHint: "fire escape rail", parallax: 0.16 },
        { id: "alley", artHint: "alleyway below", parallax: 0.08 },
      ],
      ambient: ["light_sway", "distant_rumble"],
    },
    {
      id: "skyline_maintenance",
      name: "Skyline Maintenance",
      description: "catwalk above city lights",
      layers: [
        { id: "lights", artHint: "city lights", parallax: 0.04 },
        { id: "catwalk", artHint: "grated catwalk", parallax: 0.14 },
        { id: "rails", artHint: "safety rails", parallax: 0.12 },
      ],
      ambient: ["wind_sway", "low_rumble"],
    },
    {
      id: "shipping_container_row",
      name: "Shipping Container Row",
      description: "stacked containers with lanterns",
      layers: [
        { id: "containers", artHint: "colorful containers", parallax: 0.14 },
        { id: "walkway", artHint: "narrow walkway", parallax: 0.1 },
        { id: "lamps", artHint: "hanging lamps", parallax: 0.18 },
      ],
      ambient: ["light_sway", "distant_rumble"],
    },
    {
      id: "neon_bodega_front",
      name: "Neon Bodega Front",
      description: "glow of signage and awning",
      layers: [
        { id: "sign", artHint: "bold neon sign", parallax: 0.16 },
        { id: "door", artHint: "glass door", parallax: 0.12 },
        { id: "display", artHint: "window display", parallax: 0.14 },
      ],
      ambient: ["light_flicker", "fridge_hum"],
    },
    {
      id: "arcade_afterhours",
      name: "Arcade Afterhours",
      description: "machines off, screen glow",
      layers: [
        { id: "machines", artHint: "arcade cabinets", parallax: 0.18 },
        { id: "posters", artHint: "retro posters", parallax: 0.12 },
        { id: "carpet", artHint: "patterned carpet", parallax: 0.06 },
      ],
      ambient: ["screen_glow", "fan_spin"],
    },
    {
      id: "construction_scaffolding",
      name: "Construction Scaffolding",
      description: "metal pipes and tarps",
      layers: [
        { id: "scaffold", artHint: "pipe scaffold", parallax: 0.16 },
        { id: "tarps", artHint: "flapping tarps", parallax: 0.2 },
        { id: "tools", artHint: "scattered tools", parallax: 0.12 },
      ],
      ambient: ["light_sway", "hammer_echo"],
    },
    {
      id: "water_treatment_catwalk",
      name: "Water Treatment Catwalk",
      description: "pipes over shimmering basins",
      layers: [
        { id: "basins", artHint: "water basins", parallax: 0.08 },
        { id: "pipes", artHint: "large pipes", parallax: 0.16 },
        { id: "catwalk", artHint: "metal catwalk", parallax: 0.14 },
      ],
      ambient: ["steam_vent", "low_rumble"],
    },
    {
      id: "suburban_substation",
      name: "Suburban Substation",
      description: "fenced transformers and buzzing",
      layers: [
        { id: "fence", artHint: "chain-link fence", parallax: 0.12 },
        { id: "transformers", artHint: "power transformers", parallax: 0.18 },
        { id: "poles", artHint: "utility poles", parallax: 0.1 },
      ],
      ambient: ["electric_hum", "light_flicker"],
    },
    {
      id: "radio_tower_base",
      name: "Radio Tower Base",
      description: "antenna cables and equipment shed",
      layers: [
        { id: "tower", artHint: "tower cables", parallax: 0.16 },
        { id: "shed", artHint: "equipment shed", parallax: 0.1 },
        { id: "fence", artHint: "perimeter fence", parallax: 0.12 },
      ],
      ambient: ["wind_sway", "electric_hum"],
    },
    {
      id: "canal_service_bridge",
      name: "Canal Service Bridge",
      description: "metal bridge over still water",
      layers: [
        { id: "water", artHint: "dark canal water", parallax: 0.06 },
        { id: "bridge", artHint: "service bridge grate", parallax: 0.14 },
        { id: "rails", artHint: "bridge rails", parallax: 0.12 },
      ],
      ambient: ["water_echo", "light_sway"],
    },
    {
      id: "freight_elevator",
      name: "Freight Elevator",
      description: "metal cage, rattling chains",
      layers: [
        { id: "cage", artHint: "mesh cage walls", parallax: 0.16 },
        { id: "controls", artHint: "old panel", parallax: 0.12 },
        { id: "floor", artHint: "scuffed floor", parallax: 0.08 },
      ],
      ambient: ["chain_rattle", "low_rumble"],
    },
    {
      id: "rail_yard_dusk",
      name: "Rail Yard Dusk",
      description: "rows of cars and sodium lamps",
      layers: [
        { id: "tracks", artHint: "multiple tracks", parallax: 0.1 },
        { id: "cars", artHint: "parked freight cars", parallax: 0.14 },
        { id: "lamps", artHint: "tall sodium lamps", parallax: 0.18 },
      ],
      ambient: ["distant_rumble", "light_flicker"],
    },
  ];

  return backgrounds;
}
