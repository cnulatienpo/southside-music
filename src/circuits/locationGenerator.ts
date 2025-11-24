export type CircuitsLocation = {
  id: string;
  name: string;
  description: string;
  vibe: string;
  backgroundArtHint: string;
};

export function loadLocations(): CircuitsLocation[] {
  return [
    {
      id: "corner_store_night",
      name: "Corner Store at Night",
      description: "Humming refrigerators, neon overstock, and a sleepy cat near the register.",
      vibe: "quiet-glow",
      backgroundArtHint: "corner_store",
    },
    {
      id: "bus_stop_flicker",
      name: "Bus Stop with Flickering Light",
      description: "Rain-specked bench under a buzzing lamp, empty schedules flapping.",
      vibe: "waiting",
      backgroundArtHint: "bus_stop",
    },
    {
      id: "bodega_counter",
      name: "Bodega Counter",
      description: "Glass counter with lottery tickets, coffee machine sputtering in the back.",
      vibe: "chatty",
      backgroundArtHint: "bodega_counter",
    },
    {
      id: "alley_steam",
      name: "Alley with Steam Vent",
      description: "Steam billows from a grate, brick walls tagged with layered graffiti.",
      vibe: "mysterious",
      backgroundArtHint: "alley_steam",
    },
    {
      id: "empty_laundromat",
      name: "Empty Laundromat",
      description: "Rows of washers spinning slow, vending machine light buzzing softly.",
      vibe: "hushed",
      backgroundArtHint: "laundromat",
    },
    {
      id: "rooftop_ac",
      name: "Rooftop with AC Units",
      description: "Metallic drone of fans, skyline blinking in the distance.",
      vibe: "open-air",
      backgroundArtHint: "rooftop",
    },
    {
      id: "diner_backroom",
      name: "Back Room of a Diner",
      description: "Checkered floor, stacks of syrup crates, swinging door to the kitchen.",
      vibe: "cozy-chaos",
      backgroundArtHint: "diner_backroom",
    },
    {
      id: "metro_platform_3am",
      name: "Metro Platform 3AM",
      description: "Empty platform, train announcements echoing, fluorescent lights buzz.",
      vibe: "liminal",
      backgroundArtHint: "metro_platform",
    },
    {
      id: "thrift_shop_aisle",
      name: "Thrift Shop Aisle",
      description: "Racks of odd jackets, boom box playing softly behind the counter.",
      vibe: "nostalgic",
      backgroundArtHint: "thrift_shop",
    },
    {
      id: "church_basement_kitchen",
      name: "Church Basement Kitchen",
      description: "Long folding tables, giant coffee urns, and a bulletin board of flyers.",
      vibe: "community",
      backgroundArtHint: "church_kitchen",
    },
    {
      id: "loading_dock",
      name: "Loading Dock Behind a Club",
      description: "Metal doors thump with distant bass, pallets stacked near dumpsters.",
      vibe: "backstage",
      backgroundArtHint: "loading_dock",
    },
    {
      id: "flea_market_corridor",
      name: "Flea Market Corridor",
      description: "A maze of tables with lamps, crates of vinyl, and tangled extension cords.",
      vibe: "treasure-hunt",
      backgroundArtHint: "flea_market",
    },
    {
      id: "downtown_tunnel",
      name: "Downtown Tunnel Walkway",
      description: "Echoing footsteps, mosaic tiles, and flickering emergency lights.",
      vibe: "echoing",
      backgroundArtHint: "tunnel",
    },
    {
      id: "sodium_parking",
      name: "Parking Lot under Sodium Lights",
      description: "Orange glow on cracked pavement, shopping carts gathered like a herd.",
      vibe: "wide-open",
      backgroundArtHint: "parking_lot",
    },
    {
      id: "bar_patio_neon",
      name: "Bar Patio with Neon Buzz",
      description: "Metal tables, neon signs buzzing, laughter muffled behind glass.",
      vibe: "loose",
      backgroundArtHint: "bar_patio",
    },
    {
      id: "arcade_corner",
      name: "Arcade Corner",
      description: "Retro cabinets glow in a dim corner, buttons clicking like rain.",
      vibe: "bright-noise",
      backgroundArtHint: "arcade",
    },
    {
      id: "warehouse_ramp",
      name: "Warehouse Ramp",
      description: "Concrete slope, forklifts resting, stray radio murmuring in the distance.",
      vibe: "industrial",
      backgroundArtHint: "warehouse",
    },
    {
      id: "garden_alcove",
      name: "Community Garden Alcove",
      description: "String lights over raised beds, crickets chirping near compost bins.",
      vibe: "calm",
      backgroundArtHint: "garden",
    },
    {
      id: "bridge_walkway",
      name: "Bridge Walkway",
      description: "Wind whipping, city lights below, metal grates rattling underfoot.",
      vibe: "restless",
      backgroundArtHint: "bridge",
    },
    {
      id: "record_shop_back",
      name: "Record Shop Back Room",
      description: "Stacks of unsorted crates, a cat sleeping on a turntable cover.",
      vibe: "dusty",
      backgroundArtHint: "record_shop",
    },
    {
      id: "food_truck_lane",
      name: "Food Truck Lane",
      description: "Engines idling, smell of spices, order bells chiming.",
      vibe: "hungry",
      backgroundArtHint: "food_truck",
    },
  ];
}
