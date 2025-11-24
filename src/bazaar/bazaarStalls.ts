export interface BazaarStall {
  id: string;
  name: string;
  description: string;
  instruments: string[];
  rhythmicConcepts: string[];
  textures: string[];
  exampleClips: string[];
  culturalNotes: string[];
}

const bazaarStalls: BazaarStall[] = [
  {
    id: "chicago-house",
    name: "Chicago House Stall",
    description: "Old drum machines on a folding table, LEDs flickering under a tarp.",
    instruments: ["Roland TR-707", "Korg M1 piano", "Juno-106 pads"],
    rhythmicConcepts: ["four-on-the-floor", "hi-hat shuffle", "jack swing"],
    textures: ["dusty drum machine", "reverbed vocals", "warehouse echo"],
    exampleClips: [
      "https://www.youtube.com/watch?v=G3YhLltxF2s",
      "https://www.youtube.com/watch?v=hnK2WlWgk7E",
    ],
    culturalNotes: [
      "House parties built on community DIY energy, not velvet ropes.",
      "Gospel chords slipped into synth patches, turning dancefloors into choir practice.",
    ],
  },
  {
    id: "detroit-techno",
    name: "Detroit Techno Stall",
    description: "Black plastic crates full of synth manuals and broken MIDI cables.",
    instruments: ["Roland TR-909", "DX7 bells", "Moog bass"],
    rhythmicConcepts: ["machine funk", "syncopated claps", "motorik pulse"],
    textures: ["cold strings", "acid squelch", "factory reverb"],
    exampleClips: [
      "https://www.youtube.com/watch?v=51N1OpP6DwM",
      "https://www.youtube.com/watch?v=Q9x5L-m0bYk",
    ],
    culturalNotes: [
      "Futurism patched into rust belt reality.",
      "Hi-tech soul: church harmonies pushed through drum machines.",
    ],
  },
  {
    id: "salsa",
    name: "Salsa Stall",
    description: "Congas, cowbells, and a crate of dusty fania records.",
    instruments: ["congas", "timbales", "baby bass", "brass section"],
    rhythmicConcepts: ["clave", "montuno", "tumbao"],
    textures: ["horn stabs", "call-and-response coros", "street parade reverb"],
    exampleClips: [
      "https://www.youtube.com/watch?v=4NkLQf9BlP4",
      "https://www.youtube.com/watch?v=iyLdoQGBchQ",
    ],
    culturalNotes: [
      "Dance-floor negotiations between clave and swing.",
      "NYC blocks to Caribbean docks, one guagua at a time.",
    ],
  },
  {
    id: "cumbia",
    name: "Cumbia Stall",
    description: "Plastic speakers blasting accordion and güiro loops.",
    instruments: ["accordion", "güiro", "bass guitar", "tambora"],
    rhythmicConcepts: ["cumbia swing", "backbeat lilt", "hemiola hints"],
    textures: ["dusty vinyl crackle", "percussive scrape", "plucked bass warmth"],
    exampleClips: [
      "https://www.youtube.com/watch?v=Hq5Iib7R1sE",
      "https://www.youtube.com/watch?v=pIG1m1a-2aw",
    ],
    culturalNotes: [
      "River towns, bus radios, quinceañera dance floors all in one sway.",
      "Mixes Indigenous flutes, Afro drumming, and accordion caravans.",
    ],
  },
  {
    id: "rembetiko",
    name: "Rembetiko Stall",
    description: "Battered bouzouki and a thermos of strong coffee.",
    instruments: ["bouzouki", "baglama", "guitar"],
    rhythmicConcepts: ["zeibekiko 9/8", "hasapiko", "amanes rubato"],
    textures: ["raspy vocals", "smoky café echo", "tremolo strings"],
    exampleClips: [
      "https://www.youtube.com/watch?v=6d6l1Ypf1Do",
      "https://www.youtube.com/watch?v=FwuM-SlHgbk",
    ],
    culturalNotes: [
      "Port city blues with refugee history baked in.",
      "Street poetry sung over odd meters and cheap wine.",
    ],
  },
  {
    id: "gospel",
    name: "Gospel Stall",
    description: "Hand fans, hymnals, and a portable keyboard humming softly.",
    instruments: ["Hammond organ", "choir claps", "piano", "tambourine"],
    rhythmicConcepts: ["shout beat", "hand-clap polyrhythm", "call and response"],
    textures: ["warm chorus", "roomy reverb", "push-and-pull dynamics"],
    exampleClips: [
      "https://www.youtube.com/watch?v=5UIeq0d2n5E",
      "https://www.youtube.com/watch?v=Jr5yK9yck4M",
    ],
    culturalNotes: [
      "Sanctuary harmonies that sneaked into house, soul, and R&B.",
      "Improvised runs as family conversations set to rhythm.",
    ],
  },
  {
    id: "metal",
    name: "Metal Stall",
    description: "Torn patches on a tarp, distorted amp blaring a riff in the distance.",
    instruments: ["distorted guitar", "double-kick drums", "bass", "growl mic"],
    rhythmicConcepts: ["gallop", "blast beat", "half-time breakdown"],
    textures: ["wall of sound", "feedback tail", "palm-muted crunch"],
    exampleClips: [
      "https://www.youtube.com/watch?v=u1V8YRJnr4Q",
      "https://www.youtube.com/watch?v=CD-E-LDc384",
    ],
    culturalNotes: [
      "DIY scenes in basements, festivals in muddy fields, same denim jackets.",
      "Riffs as communal chants—headbang first, genre label later.",
    ],
  },
  {
    id: "hip-hop",
    name: "Hip-Hop Stall",
    description: "SP-404 on a milk crate, local rapper freestyling for fun.",
    instruments: ["MPC pads", "SP samplers", "turntables", "SM58 mic"],
    rhythmicConcepts: ["boom-bap swing", "trap triplets", "off-grid pocket"],
    textures: ["vinyl crackle", "808 sub", "chopped soul loop"],
    exampleClips: [
      "https://www.youtube.com/watch?v=QWfbGGZE07M",
      "https://www.youtube.com/watch?v=DU6IdS_39-U",
    ],
    culturalNotes: [
      "Neighborhood news broadcast over park jams.",
      "Sampling is archaeology with a drum machine and a good ear.",
    ],
  },
  {
    id: "afrobeat",
    name: "Afrobeat Stall",
    description: "Polyrhythms looping from a speaker hung on a pole.",
    instruments: ["talking drum", "tenor guitar", "horn section", "organ"],
    rhythmicConcepts: ["interlocking guitars", "call-and-response horns", "clave cousins"],
    textures: ["hypnotic groove", "crowd shouts", "extended vamps"],
    exampleClips: [
      "https://www.youtube.com/watch?v=Qj5K_wQ7WOM",
      "https://www.youtube.com/watch?v=0H3T5vNxvpw",
    ],
    culturalNotes: [
      "Fela’s Lagos clubs taught funk to breathe for 15 minutes straight.",
      "Political sermons carried by sax squeals and rhythm guitars.",
    ],
  },
  {
    id: "bollywood",
    name: "Bollywood Stall",
    description: "Bright colors, swirling melodies, portable harmonium samples.",
    instruments: ["harmonium", "dholak", "sitar", "synth strings"],
    rhythmicConcepts: ["keherwa", "bhajan sway", "filmi grooves"],
    textures: ["lush strings", "playback vocals", "tabla slap"],
    exampleClips: [
      "https://www.youtube.com/watch?v=Cwkej79U3ek",
      "https://www.youtube.com/watch?v=Cz5mArlS5F0",
    ],
    culturalNotes: [
      "Film studios as giant music labs mixing folk, disco, and orchestra pits.",
      "Earworm melodies that jump languages overnight.",
    ],
  },
  {
    id: "industrial",
    name: "Industrial Stall",
    description: "Heavy pipes, metallic clangs, a rusted fan chopping the air.",
    instruments: ["found metal", "drum machines", "distorted vocals", "synth bass"],
    rhythmicConcepts: ["mechanical march", "noise pulses", "syncopated hits"],
    textures: ["factory ambience", "tape hiss", "bitcrushed snare"],
    exampleClips: [
      "https://www.youtube.com/watch?v=SGW3UwLAaNc",
      "https://www.youtube.com/watch?v=wHWb5X9G7Jk",
    ],
    culturalNotes: [
      "Dancefloors built in warehouses, sweat mixing with machine oil.",
      "Punk attitude smashed into sequencers and cheap distortion pedals.",
    ],
  },
  {
    id: "balkan-brass",
    name: "Balkan Brass Stall",
    description: "Trumpets trading riffs over a drum strapped to a cousin's back.",
    instruments: ["trumpet", "tuba", "davul", "clarinet"],
    rhythmicConcepts: ["7/8 dance", "cocek groove", "winding horn runs"],
    textures: ["shouting crowds", "breathy clarinet", "ringing cymbals"],
    exampleClips: [
      "https://www.youtube.com/watch?v=BmF9kD8t4iQ",
      "https://www.youtube.com/watch?v=aYX3pks5yEc",
    ],
    culturalNotes: [
      "Village weddings, street parades, and brass bands that never quit.",
      "Scales and ornaments bouncing between Roma, Ottoman, and Balkan traditions.",
    ],
  },
];

export function loadBazaarStalls(): BazaarStall[] {
  return [...bazaarStalls];
}
