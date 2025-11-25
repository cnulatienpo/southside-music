export interface StoryChainDefinition {
  id: string;
  name: string;
  description: string;
  steps: {
    sceneId: string;
    note?: string;
  }[];
}

export function loadStoryChains(): StoryChainDefinition[] {
  return [
    {
      id: "night_shift_arc",
      name: "Night Shift Arc",
      description: "Late-night slices that drift from street noise to studio glow.",
      steps: [
        { sceneId: "corner_store_radio", note: "blurry AM dial intro" },
        { sceneId: "bus_ride_structure" },
        { sceneId: "beat_ticket_window" },
        { sceneId: "studio_door_intercom" },
      ],
    },
    {
      id: "flea_market_arc",
      name: "Flea Market Arc",
      description: "Crate-digging and bartering toward unexpected musical finds.",
      steps: [
        { sceneId: "flea_market_aisle" },
        { sceneId: "genre_stall_showdown" },
        { sceneId: "folding_table_sampler" },
        { sceneId: "back_lot_boom_bap" },
      ],
    },
    {
      id: "apartment_arc",
      name: "Apartment Arc",
      description: "Home-noise textures that turn into rhythmic ideas.",
      steps: [
        { sceneId: "neighbor_banging_on_wall" },
        { sceneId: "hallway_echo" },
        { sceneId: "rooftop_ac_units" },
      ],
    },
    {
      id: "train_line_arc",
      name: "Train Line Arc",
      description: "Rhythms sparked by transit clatter and platform chatter.",
      steps: [
        { sceneId: "platform_busker_polyrhythm" },
        { sceneId: "tunnel_reverb_sketch" },
        { sceneId: "carriage_click_track" },
        { sceneId: "yard_switch_sync" },
      ],
    },
    {
      id: "late_class_arc",
      name: "Late Class Arc",
      description: "Loose practice-room vignettes that connect small study habits.",
      steps: [
        { sceneId: "empty_practice_room" },
        { sceneId: "sheet_music_exchange" },
        { sceneId: "metronome_ping_pong" },
        { sceneId: "hall_monitor_detour" },
        { sceneId: "after_hours_mixdown" },
      ],
    },
  ];
}
