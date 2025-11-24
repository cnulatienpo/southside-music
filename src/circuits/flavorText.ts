export interface FlavorTextLib {
  greetings: string[];
  encouragements: string[];
  constraints: string[];
  reactions: string[];
  exits: string[];
}

export function loadFlavorText(): FlavorTextLib {
  return {
    greetings: [
      "Oh good, someone who actually looks awake.",
      "You again? Alright, let's see what you got.",
      "Slide through, the city's humming already.",
      "Hey, you brought snacks? No? Okay, vibes only then.",
      "Look at you, dodging the rain and the rules.",
    ],
    encouragements: [
      "Yeah that felt kinda right. Or wrong. Who knows.",
      "Keep poking at it. Something'll spark.",
      "If it wobbles, roll with it.",
      "Noise is just flavor waiting to be tamed.",
      "Looks messy, sounds curious—nice.",
    ],
    constraints: [
      "Half the gear's taped together, but that's our style.",
      "We only got a couple buttons working; city budget cuts.",
      "Power's spotty, so we're keeping it lean.",
      "Management said 'minimal setup', we said 'sure'.",
      "Someone borrowed the fancy stuff; we got the fun leftovers.",
    ],
    reactions: [
      "Okay, that did something squiggly.",
      "Oh, the vents liked that one.",
      "Bold move, curious outcome.",
      "Feels like a train taking a nap.",
      "Yeah, the room tilted a little in a good way.",
    ],
    exits: [
      "Cool, bounce whenever. I'll be here with the hum.",
      "You heading out? Grab a snack on the way.",
      "Alright, city keeps spinning, see you around.",
      "Leave the door half-open; the breeze is nice.",
      "Peace. Watch for puddles.",
    ],
  };
}
