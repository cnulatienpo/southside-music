import { DeepSeekEngine, ListeningAnalysisResult } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import { checkPlagiarismRisk } from "./labHeuristics";

export interface LabResponse {
  experimentPayload?: Record<string, any>;
  suggestions?: string[];
  followUp?: string;
  popup?: string;
  requiresDismiss?: boolean;
}

type LabEngineOptions = {
  userId: string;
  deepSeek: DeepSeekEngine;
  store: UserDataStore;
};

export class LabEngine {
  private readonly userId: string;
  private readonly deepSeek: DeepSeekEngine;
  private readonly store: UserDataStore;

  constructor(options: LabEngineOptions) {
    this.userId = options.userId;
    this.deepSeek = options.deepSeek;
    this.store = options.store;
  }

  public async exploreConcept(concept: string, userText: string): Promise<LabResponse> {
    const analysis = await this.deepSeek.analyzeListeningNote({
      userId: this.userId,
      text: userText,
      context: { mode: "lab", tags: [concept] },
    });

    const experimentPayload = this.buildExperimentPayload(concept, analysis, userText);

    if (checkPlagiarismRisk(userText)) {
      return {
        popup:
          "not for nothin, but that crosses the plagerism line. you do what you want, but i cant vouch for you on this one. we do aeshtetic theft, with style. not real theft, that would make you an asshole",
        requiresDismiss: true,
      };
    }

    const suggestions = this.buildSuggestions(analysis);
    const followUp = analysis.followUpQuestion ?? undefined;

    await this.store.logLearningRecord({
      userId: this.userId,
      rawText: userText,
      clipContext: concept,
      classification: {
        type: "lab_experiment",
        concept,
        tags: analysis.tags,
      },
      vocabularyMappings: analysis.vocabularyMappings ?? [],
      suggestedTheory: suggestions,
      suggestedExercises: analysis.suggestedConcepts ?? [],
    });

    return {
      experimentPayload,
      suggestions,
      followUp,
    };
  }

  public async generateTheoryNudge(concept: string): Promise<string> {
    const basePrompt = await this.deepSeek.generateNoGradingResponse({
      userId: this.userId,
      userMessage: `Create a reflective prompt and a concept bridge for the lab concept: ${concept}. Keep it short and curious.`,
    });

    const conceptBridge = this.composeConceptBridge(concept);
    return `${basePrompt} ${conceptBridge}`.trim();
  }

  private buildExperimentPayload(
    concept: string,
    analysis: ListeningAnalysisResult,
    userText: string
  ): Record<string, any> {
    const textures = this.extractTextures(userText, analysis.tags);
    const motions = this.extractMotions(userText, analysis.tags);
    const shapes = this.extractShapes(userText);
    const gestures = this.extractGestures(userText);
    const harmonicBehaviors = this.extractHarmonicBehaviors(userText);
    const rhythmicFrames = this.extractRhythmicFrames(userText);
    const melodicContours = this.extractMelodicContours(userText);

    return {
      concept,
      motions,
      shapes,
      gestures,
      textures,
      harmonicBehaviors,
      rhythmicFrames,
      melodicContours,
    };
  }

  private buildSuggestions(analysis: ListeningAnalysisResult): string[] {
    const cues: string[] = [];

    if (analysis.summary) {
      cues.push(`Try warping this idea: ${analysis.summary}`);
    }

    if (analysis.suggestedConcepts?.length) {
      cues.push(
        `Route a tangent toward: ${analysis.suggestedConcepts.map((concept) => concept.trim()).join(", ")}`
      );
    }

    if (analysis.followUpQuestion) {
      cues.push(`Stay curious: ${analysis.followUpQuestion}`);
    }

    return cues;
  }

  private extractTextures(userText: string, tags?: string[]): string[] {
    const textureWords = ["gritty", "glass", "velvet", "air", "haze", "spark", "dust"];
    const found = textureWords.filter((word) => new RegExp(word, "i").test(userText));
    const tagTextures = tags?.filter((tag) => /texture|timbre|tone/i.test(tag)) ?? [];
    return [...new Set([...found, ...tagTextures])];
  }

  private extractMotions(userText: string, tags?: string[]): string[] {
    const motionWords = ["push", "pull", "glide", "swing", "stumble", "snap", "spiral", "bounce"];
    const found = motionWords.filter((word) => new RegExp(word, "i").test(userText));
    const tagMotions = tags?.filter((tag) => /motion|movement|drive/i.test(tag)) ?? [];
    return [...new Set([...found, ...tagMotions])];
  }

  private extractShapes(userText: string): string[] {
    const shapeWords = ["arc", "curve", "spike", "plateau", "wave", "ladder", "loop"];
    return shapeWords.filter((word) => new RegExp(word, "i").test(userText));
  }

  private extractGestures(userText: string): string[] {
    const gestureWords = ["wink", "jab", "slide", "smear", "snap", "swell"];
    return gestureWords.filter((word) => new RegExp(word, "i").test(userText));
  }

  private extractHarmonicBehaviors(userText: string): string[] {
    const harmonicWords = ["sustain", "resolve", "suspend", "drone", "cluster", "spread"];
    return harmonicWords.filter((word) => new RegExp(word, "i").test(userText));
  }

  private extractRhythmicFrames(userText: string): string[] {
    const rhythmicWords = ["groove", "grid", "swing", "syncopate", "stutter", "breath"];
    return rhythmicWords.filter((word) => new RegExp(word, "i").test(userText));
  }

  private extractMelodicContours(userText: string): string[] {
    const contourWords = ["rising", "falling", "circular", "call", "response", "zigzag"];
    return contourWords.filter((word) => new RegExp(word, "i").test(userText));
  }

  private composeConceptBridge(concept: string): string {
    const bridges = [
      `Try thinning the texture of ${concept} until it feels translucent.`,
      `Shift the shape of ${concept}—arc it, bend it, then invert it.`,
      `Let the rhythm of ${concept} breathe, then snap it back with a tiny accent.`,
      `Swap the timbre of ${concept} for something raw and unexpected.`,
    ];

    const index = Math.floor(Math.random() * bridges.length);
    return bridges[index];
  }
}
