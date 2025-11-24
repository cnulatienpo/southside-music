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

export function loadBazaarStalls(): BazaarStall[] {
  return [
    {
      id: "chicago-house",
      name: "Chicago House Stall",
      description: "Old drum machines on a folding table, LEDs flickering under a tarp.",
      instruments: ["Roland TR-909", "Korg M1 piano", "Juno pads", "sampling vocal chops"],
      rhythmicConcepts: ["four-on-the-floor kicks", "swingy hi-hats", "early drum machine shuffle"],
      textures: ["warm pads", "garage vocals", "dusty clap reverb"],
      exampleClips: ["https://www.youtube.com/watch?v=kYrbOS8S9L0"],
      culturalNotes: [
        "Built by DJs lugging gear into clubs and warehouses.",
        "Queer Black and Latin scenes keeping the floor alive.",
        "DIY edits traded like recipes at the swap meet.",
      ],
    },
    {
      id: "detroit-techno",
      name: "Detroit Techno Stall",
      description: "Black plastic crates full of synth manuals and broken MIDI cables.",
      instruments: ["909 kicks", "DX100 bass", "Jupiter stabs", "FM bells"],
      rhythmicConcepts: ["mechanical 4/4", "syncopated claps", "strobe-light arps"],
      textures: ["chrome pads", "machine hiss", "underground radio IDs"],
      exampleClips: ["https://www.youtube.com/watch?v=5Ph1FuuFApY"],
      culturalNotes: [
        "Afrofuturism on a budget, dreaming past the assembly line.",
        "Belleville kids hacking gear meant for pop.",
        "Late-night radio ghosts drifting through the mix.",
      ],
    },
    {
      id: "salsa",
      name: "Salsa Stall",
      description: "Congas, cowbells, and a crate of dusty fania records.",
      instruments: ["congas", "bongos", "cowbell", "timbales", "brass section"],
      rhythmicConcepts: ["clave", "montuno patterns", "tumbao bass"],
      textures: ["call-and-response coros", "horn stabs", "street parade reverb"],
      exampleClips: ["https://www.youtube.com/watch?v=VL8p0ZUmZyg"],
      culturalNotes: [
        "NYC barrios remixing island roots on loud corners.",
        "Dancefloor language between singers and percussion.",
        "Every cowbell pattern a debate about where the one lives.",
      ],
    },
    {
      id: "cumbia",
      name: "Cumbia Stall",
      description: "Plastic speakers blasting accordion and güiro loops.",
      instruments: ["accordion", "güiro", "bajo sexto", "timbales", "synth leads"],
      rhythmicConcepts: ["cumbia swing", "2/4 shuffle", "offbeat percussion taps"],
      textures: ["accordion air", "tape echo vocals", "handmade synth flutes"],
      exampleClips: ["https://www.youtube.com/watch?v=eZRg7z7GSLk"],
      culturalNotes: [
        "Border-town dances under holiday lights.",
        "Sound systems hauling plywood boxes to plazas.",
        "Accordion melodies drifting over cheap FM radios.",
      ],
    },
    {
      id: "rembetiko",
      name: "Rembetiko Stall",
      description: "Battered bouzouki and a thermos of strong coffee.",
      instruments: ["bouzouki", "baglamas", "hand percussion", "voice"],
      rhythmicConcepts: ["zeibekiko 9/8", "hasapiko 4/4", "lament rubato"],
      textures: ["raspy vocals", "cafe clatter", "sliding tremolo strings"],
      exampleClips: ["https://www.youtube.com/watch?v=tVrp7rQ9nPU"],
      culturalNotes: [
        "Songs of ports, prisons, and smoky basements.",
        "Eastern scales sneaking through Greek tavern doors.",
        "Rough voices telling stories over cheap wine.",
      ],
    },
    {
      id: "gospel",
      name: "Gospel Stall",
      description: "Hand fans, hymnals, and a portable keyboard humming softly.",
      instruments: ["organ", "choir", "drum kit", "handclaps", "bass guitar"],
      rhythmicConcepts: ["shout patterns", "slow build swells", "double-time praise breakdowns"],
      textures: ["stacked harmonies", "room mics", "crowd shouts"],
      exampleClips: ["https://www.youtube.com/watch?v=VLLLvdmkSlY"],
      culturalNotes: [
        "Sanctuary energy spilling into the street.",
        "Choirs training breath control between potlucks.",
        "Call-and-response as community heartbeat.",
      ],
    },
    {
      id: "metal",
      name: "Metal Stall",
      description: "Torn patches on a tarp, distorted amp blaring a riff in the distance.",
      instruments: ["electric guitars", "double-kick drums", "bass", "growl vocals"],
      rhythmicConcepts: ["gallops", "blast beats", "half-time breakdowns"],
      textures: ["cranked tube amps", "pick scrapes", "mosh pit roar"],
      exampleClips: ["https://www.youtube.com/watch?v=WD85-5QYc2w"],
      culturalNotes: [
        "DIY venues in basements and backyards.",
        "Patches traded like currency across continents.",
        "Drummers chasing speed while cables snake across the floor.",
      ],
    },
    {
      id: "hip-hop",
      name: "Hip-Hop Stall",
      description: "SP-404 on a milk crate, local rapper freestyling for fun.",
      instruments: ["samplers", "drum machines", "turntables", "voices", "808s"],
      rhythmicConcepts: ["boom-bap swing", "trap triplets", "cypher callouts"],
      textures: ["vinyl crackle", "corner block noise", "roomy ad-libs"],
      exampleClips: ["https://www.youtube.com/watch?v=y83x7MgzWOA"],
      culturalNotes: [
        "Stories shouted over bass through park speakers.",
        "Beat tapes sold next to incense sticks and mixtapes.",
        "Punchlines, politics, and party chants side by side.",
      ],
    },
    {
      id: "afrobeat",
      name: "Afrobeat Stall",
      description: "Polyrhythms looping from a speaker hung on a pole.",
      instruments: ["talking drum", "tenor guitar", "horn section", "shekere", "keys"],
      rhythmicConcepts: ["12/8 over 4/4 feel", "interlocking guitar lines", "call-and-response horns"],
      textures: ["percussion carpets", "chant vocals", "live room haze"],
      exampleClips: ["https://www.youtube.com/watch?v=QjCqi1aN6-4"],
      culturalNotes: [
        "Dance marathons fueled by political grooves.",
        "Singers cueing horns with hand signals over the crowd.",
        "Hi-life guitar glints hiding inside long jams.",
      ],
    },
    {
      id: "bollywood",
      name: "Bollywood Stall",
      description: "Bright colors, swirling melodies, portable harmonium samples.",
      instruments: ["harmonium", "tabla", "string sections", "synth bells", "vocals"],
      rhythmicConcepts: ["filmi swing", "tabla thekas", "dance-floor halftime flips"],
      textures: ["lush strings", "melisma hooks", "echoed claps"],
      exampleClips: ["https://www.youtube.com/watch?v=-Gz64n4XuBI"],
      culturalNotes: [
        "Film sets meeting village rhythms in one chorus.",
        "Playback singers trading ornaments like spices.",
        "Dhol loops roaring next to synth arpeggios in street markets.",
      ],
    },
    {
      id: "industrial",
      name: "Industrial Stall",
      description: "Heavy pipes, metallic clangs, a rusted fan chopping the air.",
      instruments: ["metal percussion", "synth noise", "drum machines", "shouted vocals"],
      rhythmicConcepts: ["machine pulses", "syncopated clangs", "slow stomps"],
      textures: ["factory reverb", "distorted PA", "steam hiss"],
      exampleClips: ["https://www.youtube.com/watch?v=ao-Sahfy7Hg"],
      culturalNotes: [
        "Warehouse parties fueled by sparks and sampler grit.",
        "DIY contact mics taped to pipes for texture.",
        "Body music for dancers in steel-toe boots.",
      ],
    },
    {
      id: "balkan-brass",
      name: "Balkan Brass Stall",
      description: "Tuba rumble under a tent, trumpets racing each other for tips.",
      instruments: ["trumpets", "tuba", "snare with jingle", "clarinet", "voice"],
      rhythmicConcepts: ["fast 7/8 dances", "romani swing", "accent flips"],
      textures: ["shouted melodies", "brassy overtones", "crowd claps"],
      exampleClips: ["https://www.youtube.com/watch?v=8H9G_gdgZ1k"],
      culturalNotes: [
        "Wedding bands sprinting through village streets.",
        "Horn lines bending like someone yelling from a rooftop.",
        "Improvised breaks to make dancers spin faster.",
      ],
    },
    {
      id: "jamaican-soundsystem",
      name: "Jamaican Sound System Stall",
      description: "Towering speakers humming, selector juggling dub plates.",
      instruments: ["siren boxes", "tape echo", "bass bins", "microphone", "drum machine"],
      rhythmicConcepts: ["one drop", "steppers", "offbeat skank"],
      textures: ["spring reverb trails", "heavy sub", "chatting toasts"],
      exampleClips: ["https://www.youtube.com/watch?v=CyFKZNHFvC4"],
      culturalNotes: [
        "Street dances turning lanes into arenas.",
        "Dub engineers carving space with faders in real time.",
        "Riddims recycled, renamed, and reborn overnight.",
      ],
    },
  ];
}
