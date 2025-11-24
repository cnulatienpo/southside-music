export interface NPCProfile {
  id: string;
  name: string;
  role: string;
  vibe: string;
  description: string;
  catchphrases: string[];
}

export function loadNPCProfiles(): NPCProfile[] {
  return [
    {
      id: "corner_clerk",
      name: "Mira",
      role: "corner store clerk",
      vibe: "wry",
      description: "Half-asleep behind a counter stacked with instant noodles and neon candies.",
      catchphrases: [
        "You look like you need caffeine and chaos.",
        "The fridge hum is our soundtrack tonight.",
        "Don't mind the flickering sign, it's vibing.",
      ],
    },
    {
      id: "bus_driver",
      name: "Roland",
      role: "bus driver",
      vibe: "patient",
      description: "Wears a reflective vest, sips cold coffee, eyes always on the next stop.",
      catchphrases: [
        "Next stop: wherever you want, kid.",
        "Doors squeak like a remix, huh?",
        "Schedule's a myth tonight.",
        "Mind the gap and the gossip.",
      ],
    },
    {
      id: "security_guard",
      name: "Gigi",
      role: "security guard",
      vibe: "gruff",
      description: "Leaning on a flashlight, boots planted, sarcastic eyebrow always raised.",
      catchphrases: [
        "Don't set off any alarms unless they're fun ones.",
        "Cameras? Half of 'em are fake.",
        "I've seen weirder than this at 3AM.",
      ],
    },
    {
      id: "laundromat_attendant",
      name: "Samir",
      role: "laundromat attendant",
      vibe: "sleepy",
      description: "Earbuds in, folding endless towels, surrounded by slow-spinning drums.",
      catchphrases: [
        "Dryers sound like lullabies tonight.",
        "Lost socks are probably starting a band.",
        "Keep it low, machines are cranky.",
      ],
    },
    {
      id: "barber",
      name: "Tasha",
      role: "barber",
      vibe: "friendly",
      description: "Clippers hanging from a hook, fades sharp as her wit.",
      catchphrases: [
        "Sit down, relax, let the buzz do the talking.",
        "Edges clean, vibes messy—perfect.",
        "You bring the noise, I bring the lineup.",
      ],
    },
    {
      id: "bartender",
      name: "Paz",
      role: "bartender",
      vibe: "smooth",
      description: "Shakes mocktails like a DJ crossfades, wiping the bar with a grin.",
      catchphrases: [
        "Ice clinks got rhythm, trust.",
        "No tabs, just vibes.",
        "Neon sign's buzzing in B-flat, maybe?",
      ],
    },
    {
      id: "bodega_owner",
      name: "Mr. Reyes",
      role: "bodega owner",
      vibe: "practical",
      description: "Stacks newspapers at dawn, remembers everyone's order and gossip.",
      catchphrases: [
        "If it sparks, don't burn the cat food aisle.",
        "Card reader's moody, cash is king.",
        "Clock's wrong, but we're right on time.",
      ],
    },
    {
      id: "night_janitor",
      name: "Keon",
      role: "night janitor",
      vibe: "deadpan",
      description: "Pushing a squeaky cart, headphones resting around his neck.",
      catchphrases: [
        "Floor buffer's got more soul than the elevator.",
        "Watch the wet spot—no slip solos.",
        "If you hear footsteps, it's probably me. Probably.",
      ],
    },
    {
      id: "balcony_neighbor",
      name: "Lulu",
      role: "neighbor yelling from balcony",
      vibe: "dramatic",
      description: "Housecoat, slippers, voice that cuts through city sirens.",
      catchphrases: [
        "Keep it down or make it better—your choice!",
        "These pigeons got opinions and so do I.",
        "You cooking beats or burning dinner?",
      ],
    },
    {
      id: "flea_vendor",
      name: "Tiny",
      role: "flea market vendor",
      vibe: "chaotic",
      description: "Tables of tangled cables, old speakers, and mystery gadgets.",
      catchphrases: [
        "Everything works until you ask questions.",
        "Found this in a storage unit, probably legal.",
        "Haggle with sounds, not dollars.",
        "Careful, that switch summons pigeons.",
      ],
    },
    {
      id: "delivery_driver",
      name: "Jules",
      role: "delivery driver",
      vibe: "rushed",
      description: "Packages stacked to the ceiling, hoodie up, sneakers dusty.",
      catchphrases: [
        "I got five minutes and a van double-parked.",
        "City's a maze, but we're making shortcuts.",
        "If it rattles, that's the soundtrack.",
      ],
    },
    {
      id: "busker_broken",
      name: "Nico",
      role: "busker with broken instrument",
      vibe: "optimistic",
      description: "Guitar missing two strings, amp held together with stickers.",
      catchphrases: [
        "Two strings, endless possibilities.",
        "If it buzzes, it's character.",
        "Crowd or no crowd, I'm vibing.",
      ],
    },
    {
      id: "street_preacher",
      name: "Reverend K",
      role: "street preacher",
      vibe: "booming",
      description: "Portable speaker, long coat, gestures big enough for the block.",
      catchphrases: [
        "Can I get an amen or at least a nod?",
        "Static is just the universe whispering.",
        "Bless the beat, not the mess.",
      ],
    },
    {
      id: "diner_server",
      name: "May",
      role: "diner server",
      vibe: "warm",
      description: "Balancing coffee pots and plates, apron full of pens.",
      catchphrases: [
        "Refill? Remix? Same energy.",
        "Kitchen bell sings louder than me.",
        "Leave the menu, keep the vibe.",
      ],
    },
    {
      id: "thrift_cashier",
      name: "Ollie",
      role: "thrift shop cashier",
      vibe: "quirky",
      description: "Checkerboard nails, stacks of vintage tapes behind the counter.",
      catchphrases: [
        "Everything here has a past life.",
        "Tape deck's possessed but in a cute way.",
        "Price tag fell off? Make up a number.",
      ],
    },
    {
      id: "construction_flagger",
      name: "Vic",
      role: "construction flagger",
      vibe: "no-nonsense",
      description: "Orange vest, signal paddle, dust-covered boots tapping to machinery.",
      catchphrases: [
        "Jackhammer's got the baseline covered.",
        "Hard hat on, judgment off.",
        "Traffic's wild, but so are we.",
      ],
    },
    {
      id: "parking_attendant",
      name: "Suri",
      role: "parking attendant",
      vibe: "deadpan",
      description: "Sits in a tiny booth with a space heater and a stack of tickets.",
      catchphrases: [
        "Tickets? Nah, just vibes.",
        "Gate arm only listens when it wants to.",
        "People think I'm a robot; I'm just bored.",
      ],
    },
    {
      id: "night_nurse",
      name: "Elena",
      role: "night nurse",
      vibe: "calm",
      description: "Wears sneakers for silent steps, carries a chipped thermos.",
      catchphrases: [
        "Monitors beep in 4/4, it's comforting.",
        "Shh, the night shift has its own rhythm.",
        "Rest when you can, hum when you can't.",
      ],
    },
    {
      id: "arcade_tech",
      name: "Patch",
      role: "arcade technician",
      vibe: "tinkerer",
      description: "Tool belt full of coins and screwdrivers, eyes on the pinball lights.",
      catchphrases: [
        "This cabinet only tilts out of affection.",
        "Pixels or vinyl, I'll fix it.",
        "Joysticks talk back if you listen.",
      ],
    },
    {
      id: "subway_poet",
      name: "Dorian",
      role: "subway poet",
      vibe: "dreamy",
      description: "Notebook covered in stickers, writing between station stops.",
      catchphrases: [
        "Subway brakes are my backing track.",
        "Words fall like tokens, catch one.",
        "Echoes make the best rhyme partners.",
      ],
    },
    {
      id: "loft_producer",
      name: "Aya",
      role: "loft producer",
      vibe: "laid-back",
      description: "Laptop balanced on a milk crate, plants everywhere.",
      catchphrases: [
        "My synth's asleep but the city isn't.",
        "We keep it lo-fi, dust and all.",
        "If it glitches, it's texture.",
      ],
    },
    {
      id: "hardware_hacker",
      name: "Rex",
      role: "hardware hacker",
      vibe: "chaotic",
      description: "Goggles on the forehead, soldering iron tucked in a hoodie pocket.",
      catchphrases: [
        "I rewired a toaster once; it sang.",
        "Careful, that's technically experimental.",
        "Smoke? That's just the vibe manifesting.",
      ],
    },
    {
      id: "bus_station_usher",
      name: "Arlene",
      role: "bus station usher",
      vibe: "efficient",
      description: "Clipboard in hand, knows every arrival by heart, scarf wrapped tight.",
      catchphrases: [
        "Lines are suggestions, keep moving.",
        "Announcements mumble, I translate.",
        "This place never sleeps, it just blinks slowly.",
      ],
    },
  ];
}
