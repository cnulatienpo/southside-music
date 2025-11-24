import { NPCProfile } from "./npcProfiles";

export type CircuitToolId = string;

export interface CircuitChoice {
  id: string;
  label?: string;
  note?: string;
}

type ToolReasonMap = Record<CircuitToolId, string[]>;

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export class ExcuseGenerator {
  private toolReasons: ToolReasonMap = {
    oscillator: [
      "the oscillator's the only thing that survived the surge",
      "everything else popped a fuse, oscillator's chilling",
    ],
    filter: [
      "the filter knob is stuck half-open, kinda charming",
      "only the filter responds; rest went home early",
    ],
    sampler: [
      "sampler's awake, the rest are on break",
      "the sampler button is the only one that still clicks",
    ],
    sequencer: [
      "sequencer's clocking fine even if the lights say otherwise",
      "old sequencer keeps looping even with half the LEDs dead",
    ],
    looper: [
      "the looper's running on backup batteries",
      "this looper never quits, unlike the mixer",
    ],
    mixer: [
      "mixer lost two channels, so we kept the survivors",
      "someone spilled soda on the mixer, so it's diet settings only",
    ],
    mic: [
      "intercom only picks up low sounds today",
      "the mic's duct-taped to the wall, don't ask",
    ],
    drum: [
      "drum pad's touchy; smack it nice",
      "only two pads registered after the thunderstorm",
    ],
  };

  private genericExcuses: string[] = [
    "manager cut the power, we running barebones right now",
    "this old boombox only has one working button",
    "traffic noise drowned the highs, so we kept the low stuff",
    "half the rack is out for repairs, but scraps got soul",
    "extension cords are doing overtime; keep it minimal",
  ];

  generateExcuse(tools: CircuitToolId[], npc: NPCProfile): string {
    const describedTools = tools.length > 0 ? tools : ["the gear"];
    const toolLines = describedTools
      .map((tool) => this.toolReasons[tool]?.length
        ? pickRandom(this.toolReasons[tool])
        : undefined)
      .filter((line): line is string => Boolean(line));

    const excuseCore = toolLines.length > 0
      ? toolLines.join("; ")
      : pickRandom(this.genericExcuses);

    const toolList = describedTools.join(", ");
    const npcNote = npc.catchphrases.length
      ? pickRandom(npc.catchphrases)
      : `${npc.name} shrugs.`;

    return `${npc.name} says the ${toolList} stays because ${excuseCore}. ${npcNote}`;
  }
}
