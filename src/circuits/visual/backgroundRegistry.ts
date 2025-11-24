export interface CircuitsBackgroundLayer {
  id: string;
  artHint: string;
  parallax?: number;
}

export interface CircuitsBackground {
  id: string;
  name: string;
  description: string;
  layers: CircuitsBackgroundLayer[];
  ambient: string[];
}

export function loadBackgrounds(): CircuitsBackground[] {
  return [
    {
      id: "corner_store_night",
      name: "Corner Store Night",
      description: "aisles, buzzing fridge lights",
      layers: [
        { id: "shelves", artHint: "stocked aisles", parallax: 0.2 },
        { id: "counter", artHint: "checkout counter", parallax: 0.35 },
        { id: "signs", artHint: "neon window signs", parallax: 0.45 },
      ],
      ambient: ["light_flicker", "fridge_hum"],
    },
    {
      id: "metro_platform_3am",
      name: "Metro Platform 3AM",
      description: "dim platform, flickering lights, tiled walls",
      layers: [
        { id: "tiles", artHint: "tiled wall backdrop", parallax: 0.15 },
        { id: "benches", artHint: "metal benches", parallax: 0.3 },
        { id: "track_edge", artHint: "yellow safety line", parallax: 0.5 },
      ],
      ambient: ["light_flicker", "rail_rattle"],
    },
    {
      id: "alley_steam_vent",
      name: "Alley Steam Vent",
      description: "brick walls, vent puffing steam",
      layers: [
        { id: "brick", artHint: "brick corridor", parallax: 0.18 },
        { id: "vent", artHint: "metal vent", parallax: 0.35 },
        { id: "pipes", artHint: "rusted pipes", parallax: 0.4 },
      ],
      ambient: ["steam_vent", "drip_echo"],
    },
    {
      id: "laundromat_empty",
      name: "Laundromat Empty",
      description: "rows of machines, hum of motors",
      layers: [
        { id: "machines", artHint: "washer dryer rows", parallax: 0.22 },
        { id: "chairs", artHint: "waiting chairs", parallax: 0.36 },
        { id: "windows", artHint: "street-facing windows", parallax: 0.48 },
      ],
      ambient: ["light_flicker", "machine_hum"],
    },
    {
      id: "flea_market_aisle",
      name: "Flea Market Aisle",
      description: "tarps, crates, hanging lights",
      layers: [
        { id: "tarps", artHint: "patchwork tarps", parallax: 0.18 },
        { id: "tables", artHint: "vendor tables", parallax: 0.32 },
        { id: "hanging_lights", artHint: "string lights", parallax: 0.46 },
      ],
      ambient: ["light_flicker", "crowd_murmur"],
    },
    {
      id: "rooftop_AC_units",
      name: "Rooftop A/C Units",
      description: "big fans slowly rotating",
      layers: [
        { id: "skyline", artHint: "distant skyline", parallax: 0.12 },
        { id: "ac_units", artHint: "heavy A/C units", parallax: 0.28 },
        { id: "vents", artHint: "roof vents", parallax: 0.42 },
      ],
      ambient: ["fan_wobble", "distant_rumble"],
    },
    {
      id: "diner_backroom",
      name: "Diner Backroom",
      description: "dirty floor, soda machine hum",
      layers: [
        { id: "storage", artHint: "storage shelves", parallax: 0.2 },
        { id: "soda_machine", artHint: "soda fountain", parallax: 0.34 },
        { id: "door", artHint: "swing door", parallax: 0.46 },
      ],
      ambient: ["machine_hum", "light_flicker"],
    },
    {
      id: "loading_dock",
      name: "Loading Dock",
      description: "pallets, dumpsters, faint reverb",
      layers: [
        { id: "wall", artHint: "warehouse wall", parallax: 0.14 },
        { id: "pallets", artHint: "pallet stacks", parallax: 0.3 },
        { id: "dumpsters", artHint: "metal dumpsters", parallax: 0.44 },
      ],
      ambient: ["distant_rumble", "sign_creak"],
    },
    {
      id: "subway_tunnel_edge",
      name: "Subway Tunnel Edge",
      description: "dark tunnel mouth with maintenance lights",
      layers: [
        { id: "tunnel", artHint: "tunnel walls", parallax: 0.16 },
        { id: "lights", artHint: "maintenance lights", parallax: 0.28 },
        { id: "tracks", artHint: "tracks disappearing", parallax: 0.5 },
      ],
      ambient: ["light_flicker", "rail_rattle"],
    },
    {
      id: "bridge_underpass",
      name: "Bridge Underpass",
      description: "graffiti pillars, echoing traffic",
      layers: [
        { id: "pillars", artHint: "concrete pillars", parallax: 0.14 },
        { id: "graffiti", artHint: "graffiti art", parallax: 0.3 },
        { id: "overpass", artHint: "overpass beams", parallax: 0.46 },
      ],
      ambient: ["distant_rumble", "traffic_sway"],
    },
    {
      id: "construction_scaffold",
      name: "Construction Scaffold",
      description: "metal bars, tarps, city noise",
      layers: [
        { id: "frames", artHint: "scaffold frames", parallax: 0.18 },
        { id: "tarps", artHint: "wind-blown tarps", parallax: 0.32 },
        { id: "tools", artHint: "hanging tools", parallax: 0.48 },
      ],
      ambient: ["sign_creak", "traffic_sway"],
    },
    {
      id: "arcade_hallway",
      name: "Arcade Hallway",
      description: "retro cabinets, neon reflections",
      layers: [
        { id: "walls", artHint: "glowing walls", parallax: 0.14 },
        { id: "cabinets", artHint: "arcade cabinets", parallax: 0.28 },
        { id: "signs", artHint: "directional neon", parallax: 0.44 },
      ],
      ambient: ["light_flicker", "neon_buzz"],
    },
    {
      id: "parking_garage_lowlight",
      name: "Parking Garage Lowlight",
      description: "concrete ramps, low sodium lights",
      layers: [
        { id: "ramps", artHint: "spiral ramps", parallax: 0.18 },
        { id: "pipes", artHint: "ceiling pipes", parallax: 0.32 },
        { id: "signage", artHint: "painted arrows", parallax: 0.46 },
      ],
      ambient: ["light_flicker", "distant_rumble"],
    },
    {
      id: "neon_backstreet",
      name: "Neon Backstreet",
      description: "wet pavement, buzzing neon signs",
      layers: [
        { id: "buildings", artHint: "tight building faces", parallax: 0.16 },
        { id: "signs", artHint: "stacked neon signs", parallax: 0.34 },
        { id: "puddles", artHint: "reflective puddles", parallax: 0.48 },
      ],
      ambient: ["neon_buzz", "drip_echo"],
    },
    {
      id: "train_yard",
      name: "Train Yard",
      description: "lined cars, metal clanks",
      layers: [
        { id: "rail_lines", artHint: "parallel rails", parallax: 0.18 },
        { id: "cars", artHint: "boxcars", parallax: 0.34 },
        { id: "signals", artHint: "signal towers", parallax: 0.46 },
      ],
      ambient: ["rail_rattle", "distant_rumble"],
    },
    {
      id: "abandoned_factory_floor",
      name: "Abandoned Factory Floor",
      description: "broken windows, hanging cables",
      layers: [
        { id: "walls", artHint: "peeling walls", parallax: 0.14 },
        { id: "machinery", artHint: "silent machinery", parallax: 0.32 },
        { id: "cables", artHint: "hanging cables", parallax: 0.46 },
      ],
      ambient: ["light_flicker", "sign_creak"],
    },
    {
      id: "water_treatment_catwalk",
      name: "Water Treatment Catwalk",
      description: "metal grates above churning tanks",
      layers: [
        { id: "tanks", artHint: "water tanks", parallax: 0.16 },
        { id: "catwalk", artHint: "metal catwalk", parallax: 0.32 },
        { id: "rails", artHint: "safety rails", parallax: 0.5 },
      ],
      ambient: ["machine_hum", "steam_vent"],
    },
    {
      id: "radio_tower_roof",
      name: "Radio Tower Roof",
      description: "antenna forest with night wind",
      layers: [
        { id: "sky", artHint: "night sky", parallax: 0.08 },
        { id: "antennas", artHint: "clustered antennas", parallax: 0.28 },
        { id: "cables", artHint: "taut cables", parallax: 0.42 },
      ],
      ambient: ["traffic_sway", "distant_rumble"],
    },
    {
      id: "shipping_container_maze",
      name: "Shipping Container Maze",
      description: "stacked containers with narrow alleys",
      layers: [
        { id: "stacks", artHint: "container stacks", parallax: 0.16 },
        { id: "walkway", artHint: "narrow walkway", parallax: 0.34 },
        { id: "signage", artHint: "spray labels", parallax: 0.46 },
      ],
      ambient: ["sign_creak", "distant_rumble"],
    },
    {
      id: "graffiti_corridor",
      name: "Graffiti Corridor",
      description: "tagged walls, puddles, sparse light",
      layers: [
        { id: "walls", artHint: "tagged walls", parallax: 0.18 },
        { id: "lights", artHint: "overhead bulbs", parallax: 0.34 },
        { id: "puddles", artHint: "rain puddles", parallax: 0.5 },
      ],
      ambient: ["light_flicker", "drip_echo"],
    },
    {
      id: "underground_boiler_room",
      name: "Underground Boiler Room",
      description: "pipes, gauges, low rumble",
      layers: [
        { id: "boilers", artHint: "hulking boilers", parallax: 0.16 },
        { id: "pipes", artHint: "steam pipes", parallax: 0.32 },
        { id: "gauges", artHint: "glowing gauges", parallax: 0.48 },
      ],
      ambient: ["steam_vent", "distant_rumble"],
    },
    {
      id: "late_night_bus_stop",
      name: "Late Night Bus Stop",
      description: "empty shelter, far-off traffic",
      layers: [
        { id: "road", artHint: "empty road", parallax: 0.14 },
        { id: "shelter", artHint: "glass shelter", parallax: 0.32 },
        { id: "advert", artHint: "backlit advert", parallax: 0.46 },
      ],
      ambient: ["light_flicker", "distant_rumble"],
    },
  ];
}
