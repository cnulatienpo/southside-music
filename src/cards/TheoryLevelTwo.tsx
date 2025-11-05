export type TheoryLevel = 1 | 2;

export type TheoryCardFace = {
  lines: string[];
  chela?: string;
  tryIt?: string;
  joke?: string;
};

export type TheoryCard = {
  id: string;
  level: TheoryLevel;
  title: string;
  front: TheoryCardFace & { chela: string };
  back: TheoryCardFace & { tryIt: string };
};

export const theoryLevelTwoCards: TheoryCard[] = [
  {
    id: "L2:home-magnet",
    level: 2,
    title: "Home Magnet",
    front: {
      lines: [
        "The note that acts like the rug everyone ends up sitting on.",
        "Songs orbit it the way cats keep returning to the warm laptop lid.",
        "Hear it in: Adele's final chorus, the Super Mario flagpole fanfare, your phone's unlock chime when you exhale.",
      ],
      chela: "Chela: \"Even my tail circles back there when I'm done flexing.\"",
    },
    back: {
      lines: [
        "Feel it in film: the hero stepping back onto the porch after the sequel tease.",
        "In design: the color you repeat in every frame so the collage doesn't float away.",
        "In life: that sigh when the elevator lands on your floor.",
      ],
      tryIt: "Hum a note, wander anywhere for ten seconds, then fall onto the pitch that feels like home base. That's your magnet.",
    },
  },
  {
    id: "L2:chord-crowd",
    level: 2,
    title: "Chord Crowd",
    front: {
      lines: [
        "A stack of tones linking arms like friends in a photobooth.",
        "Each one leans a different way, but together they pose as a single mood.",
        "Hear it in: Tyler, the Creator's synth beds, gospel organ swells, the Netflix intro boom.",
      ],
      chela: "Chela: \"Three dogs howling? That's a chord. Respect the pack.\"",
    },
    back: {
      lines: [
        "See it in sculpture: a Calder mobile where shapes balance by pulling on each other.",
        "In film: the ensemble shot when everyone piles into frame and the music thickens.",
        "In fashion: layered jackets that make one silhouette instead of a closet fight.",
      ],
      tryIt: "Record three friendly noises—whistle, hum, tap a mug. Play them all at once and note the mood they create.",
    },
  },
  {
    id: "L2:interval-leaps",
    level: 2,
    title: "Interval Leaps",
    front: {
      lines: [
        "The space between two notes is a jump distance, not a math quiz.",
        "Some jumps are curb hops; others are rooftop parkour.",
        "Hear it in: the Star Wars opening vault, Billie Eilish whisper slides, every sitcom doorbell gag.",
      ],
      chela: "Chela: \"Small jumps for sneaking, huge jumps for dramatic entrances. Choose wisely.\"",
    },
    back: {
      lines: [
        "In dance: the difference between a shuffle step and a grand jeté.",
        "In comics: the gap between panels your brain has to cross.",
        "In product design: the distance between two buttons that decides if the interface feels breezy or clunky.",
      ],
      tryIt: "Sing two notes from any song you love. Measure the leap with your hands in the air—tiny space or skyscraper span?", 
    },
  },
  {
    id: "L2:circular-paths",
    level: 2,
    title: "Loop Ritual",
    front: {
      lines: [
        "Chords walking in circles until someone breaks the spell.",
        "Like coffee shop lines—you know the route, but the faces keep changing.",
        "Hear it in: Daft Punk's \"Get Lucky\" vamp, Bollywood string cycles, Animal Crossing's endless afternoons.",
      ],
      chela: "Chela: \"Loops are leashes—comfortable until you decide to bolt.\"",
    },
    back: {
      lines: [
        "In film: montage music that resets every eight seconds while the story sprints.",
        "In architecture: circular staircases that hypnotize but never surprise unless you jump the railing.",
        "In UX: loading animations that reassure you the app is still breathing.",
      ],
      tryIt: "Build a four-chord or four-sound loop. Let it run for a minute, then swap just one piece. Feel the ritual tilt.",
    },
  },
  {
    id: "L2:dynamic-weather",
    level: 2,
    title: "Dynamic Weather",
    front: {
      lines: [
        "Volume is mood lighting—dim for secrets, blinding for confessions.",
        "Songs breathe like thunderstorms rolling past open windows.",
        "Hear it in: Lizzo's quiet-to-loud swells, Hans Zimmer's foghorn builds, the rollercoaster of a Billie Joel bridge.",
      ],
      chela: "Chela: \"If everything is loud, nothing is loud. Same with barking.\"",
    },
    back: {
      lines: [
        "See it in cinema: headlights flaring in the rain before cutting to hush.",
        "In illustration: bold marker strokes exploding out of pencil sketches.",
        "In life: whispering gossip before screaming at the plot twist together.",
      ],
      tryIt: "Play any groove softly, then again like you're scoring a heist finale. Notice how your body posture changes.",
    },
  },
  {
    id: "L2:color-shifts",
    level: 2,
    title: "Mode Dials",
    front: {
      lines: [
        "A song's palette swap—same shapes, brand-new tint.",
        "Like switching your Instagram filter from neon rave to sepia campfire.",
        "Hear it in: Stranger Things' synth nostalgia, Lydian jazz sparkle, lo-fi hip-hop's warm couch haze.",
      ],
      chela: "Chela: \"Twist the dial and the hallway smells different. That's a mode.\"",
    },
    back: {
      lines: [
        "In film: the moment lighting flips from daylight to sodium orange.",
        "In fashion: swapping sneakers for boots but keeping the same outfit silhouette.",
        "In graphic design: recoloring the same poster until it whispers or shouts.",
      ],
      tryIt: "Take a melody you know. Shift every note up by the same amount—suddenly the mood wears a different jacket.",
    },
  },
];

export const THEORY_LEVEL_TWO_CARD_COUNT = theoryLevelTwoCards.length;
