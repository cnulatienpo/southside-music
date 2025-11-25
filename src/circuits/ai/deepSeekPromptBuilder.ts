import { AIPersona } from "./aiPersona";
import { loadPersonaVocabulary } from "./personaVocabulary";

interface BuilderOptions {
  persona: AIPersona;
}

function sample<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function joinWithFlavor(base: string, flavor: string): string {
  return `${base} ${flavor}`.trim();
}

export class DeepSeekPromptBuilder {
  private persona: AIPersona;
  private vocabulary = loadPersonaVocabulary();

  constructor(options: BuilderOptions) {
    this.persona = options.persona;
  }

  buildGreeting(npcName: string): string {
    const base = sample(this.vocabulary.greetings);
    return joinWithFlavor(base, `I’m ${npcName}. Take your time, no rush.`);
  }

  buildReflection(userAction: unknown): string {
    const base = sample(this.vocabulary.reflections);
    const tail = "See what happens if you lean into that.";
    return joinWithFlavor(base, tail);
  }

  buildSuggestion(context: unknown): string {
    const nudge = sample(this.vocabulary.nudges);
    const sensory = sample(this.persona.getConfig().sensoryRefs);
    return joinWithFlavor(nudge, sensory);
  }

  buildBoundaryLine(): string {
    return "Not for nothin’, but this game ain’t like that.";
  }

  buildAmbientChatter(): string {
    return sample(this.vocabulary.chatter);
  }
}
