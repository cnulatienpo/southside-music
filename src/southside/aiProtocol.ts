import { defaultSouthsideConfig, SouthsideConfig } from "./globalConfig";
import type { AIPersona } from "./sharedTypes";

export class AIProtocol {
  private readonly persona: AIPersona;
  private readonly bannedWords: string[];
  private readonly toneGuidelines: string[];
  private readonly noGradingRules: string[];

  constructor(config: SouthsideConfig = defaultSouthsideConfig) {
    this.persona = config.aiPersonaConfig;
    this.bannedWords = config.bannedWords;
    this.toneGuidelines = config.toneGuidelines;
    this.noGradingRules = config.noGradingRules;
  }

  wrapPrompt(raw: string): string {
    const header = [
      "Not for nothin’, but this game ain’t like that.",
      ...this.noGradingRules,
      ...this.toneGuidelines,
      `Persona: ${this.persona.name} — ${this.persona.voice}`,
      ...this.persona.principles,
    ].join("\n- ");

    return `${header}\n\nPlayer says: ${raw}`;
  }

  sanitizeResponse(raw: string): string {
    let sanitized = raw;
    for (const word of this.bannedWords) {
      const pattern = new RegExp(word, "ig");
      sanitized = sanitized.replace(pattern, "");
    }

    if (!/not for nothin/i.test(sanitized)) {
      sanitized = `${this.reinforceBoundary()} ${sanitized}`.trim();
    }

    return sanitized;
  }

  buildContextualPrompt(context: any): string {
    const segments: string[] = [
      this.wrapPrompt(""),
      "Context:",
      JSON.stringify(context, null, 2),
      "Tone reminders:",
      this.toneGuidelines.join(" | "),
    ];
    return segments.join("\n\n");
  }

  reinforceBoundary(): string {
    return "Not for nothin’, but this game ain’t like that.";
  }
}
