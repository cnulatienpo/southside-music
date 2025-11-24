import { FlavorTextLib } from "./flavorText";
import { NPCProfile } from "./npcProfiles";
import { CircuitChoice, CircuitToolId, ExcuseGenerator } from "./excuseGenerator";

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

interface DialogueOptions {
  npcProfiles: NPCProfile[];
  flavor: FlavorTextLib;
  excuses: ExcuseGenerator;
}

export class NPCDialogueEngine {
  private npcProfiles: NPCProfile[];
  private flavor: FlavorTextLib;
  private excuses: ExcuseGenerator;

  constructor(options: DialogueOptions) {
    this.npcProfiles = options.npcProfiles;
    this.flavor = options.flavor;
    this.excuses = options.excuses;
  }

  getNPCProfile(npcId: string): NPCProfile {
    return this.npcProfiles.find((npc) => npc.id === npcId) ?? this.npcProfiles[0];
  }

  generateGreeting(npc: NPCProfile): string {
    const base = pickRandom(this.flavor.greetings);
    const tag = npc.catchphrases.length ? pickRandom(npc.catchphrases) : npc.description;
    return `${base} ${tag}`;
  }

  generateEncouragement(npc: NPCProfile): string {
    const base = pickRandom(this.flavor.encouragements);
    const side = npc.catchphrases.length ? pickRandom(npc.catchphrases) : "Keep the hum going.";
    return `${base} ${side}`;
  }

  generateConstraintExplanation(npc: NPCProfile, tools: CircuitToolId[]): string {
    const excuseLine = this.excuses.generateExcuse(tools, npc);
    const frame = pickRandom(this.flavor.constraints);
    return `${frame} ${excuseLine}`;
  }

  generateReaction(npc: NPCProfile, action: string): string {
    const reaction = pickRandom(this.flavor.reactions);
    const vibeNote = npc.catchphrases.length ? pickRandom(npc.catchphrases) : npc.vibe;
    return `${reaction} ${npc.name} watches you ${action} and just nods. ${vibeNote}`;
  }

  generateExitLine(npc: NPCProfile, choice: CircuitChoice): string {
    const exit = pickRandom(this.flavor.exits);
    const choiceLabel = choice.label ?? choice.id;
    const softNudge = npc.catchphrases.length
      ? pickRandom(npc.catchphrases)
      : `${npc.name} waves from the ${npc.role}.`;
    return `${exit} ${softNudge} Maybe check out ${choiceLabel} next.`;
  }
}
