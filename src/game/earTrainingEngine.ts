import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import audioEngine from "../audio/audioEngine";
import { MediaSync } from "../lib/mediaSync";
import dayjs from "dayjs";

export type EarTrainingExerciseType =
  | "same_different"
  | "up_down"
  | "near_far"
  | "pulse_tap"
  | "rhythm_echo"
  | "gesture_match"
  | "which_first"
  | "what_changed";

export interface EarTrainingAttempt {
  id: string;
  userId: string;
  exerciseType: EarTrainingExerciseType;
  createdAt: string;
  // IMPORTANT: NEVER store correctness
  userResponse: string; // raw text or gesture
  systemContext: Record<string, any>; // difficulty state, source clip, parameters
}

export interface PillarConfig {
  active: boolean;
  weight: number; // used internally for adaptive cycling
}

export interface EarTrainingEngineOptions {
  userId: string;
  userDataStore: UserDataStore;
  deepSeek: DeepSeekEngine;
  mediaSync: MediaSync;
}

const PILLAR_EXERCISES: Record<
  "attention" | "body" | "memory",
  EarTrainingExerciseType[]
> = {
  attention: ["same_different", "up_down", "near_far"],
  body: ["pulse_tap", "rhythm_echo", "gesture_match"],
  memory: ["which_first", "what_changed"],
};

const EXERCISE_PROMPTS: Record<EarTrainingExerciseType, string> = {
  same_different: "These two sounds happen. Did the second one change?",
  up_down: "Did that sound rise, fall, or stay put?",
  near_far: "Do these feel close together or far apart?",
  pulse_tap: "Tap anywhere on the screen to ride the pulse.",
  rhythm_echo: "Echo this pattern back: tap… tap-tap… tap.",
  gesture_match: "Trace the shape this line makes.",
  which_first: "Which one did you hear first?",
  what_changed: "What changed from A to B?",
};

const TERMINOLOGY_HINTS: Array<{
  matcher: (text: string, tags: string[]) => boolean;
  term: string;
}> = [
  {
    matcher: (text, tags) => /shape|curve|line|arc/i.test(text) || tags.includes("contour"),
    term: "contour",
  },
  {
    matcher: (text, tags) => /pulse|beat|thump|tempo/i.test(text) || tags.includes("pulse"),
    term: "downbeat",
  },
  {
    matcher: (text, tags) => /tense|release|pull|push/i.test(text) || tags.includes("tension"),
    term: "tension",
  },
];

const ACKS = [
  "ok",
  "word",
  "cool",
  "gracia",
  "grazi",
  "thanks for playing",
  "preciate you",
  "mmmhm",
  "aight",
  "bet",
  "nice",
];

export class EarTrainingEngine {
  private userId: string;

  private store: UserDataStore;

  private deepSeek: DeepSeekEngine;

  private mediaSync: MediaSync;

  private currentExercise: EarTrainingExerciseType | null;

  private difficultyLevel: number;

  private pillarWeights: Record<string, PillarConfig>;

  private recentHistory: EarTrainingAttempt[];

  private lastClassificationTags: string[];

  private introducedTerms: Set<string>;

  constructor(options: EarTrainingEngineOptions) {
    this.userId = options.userId;
    this.store = options.userDataStore;
    this.deepSeek = options.deepSeek;
    this.mediaSync = options.mediaSync;

    this.currentExercise = null;
    this.difficultyLevel = 1;
    this.pillarWeights = {
      attention: { active: true, weight: 1 },
      body: { active: true, weight: 1 },
      memory: { active: true, weight: 1 },
    };
    this.recentHistory = [];
    this.lastClassificationTags = [];
    this.introducedTerms = new Set();
  }

  public async generateNextExercise(): Promise<EarTrainingExerciseType> {
    this.rebalancePillarWeights();

    const activePillars = Object.entries(this.pillarWeights).filter(
      ([, config]) => config.active && config.weight > 0
    );

    const chosenPillar = this.pickWeightedPillar(activePillars);
    const exercises = PILLAR_EXERCISES[chosenPillar];
    const randomIndex = Math.floor(Math.random() * exercises.length);
    const chosenExercise = exercises[randomIndex] ?? exercises[0];

    this.currentExercise = chosenExercise;
    return chosenExercise;
  }

  public setManualExercise(exerciseType: EarTrainingExerciseType): void {
    this.currentExercise = exerciseType;
  }

  public async getExercisePrompt(): Promise<string> {
    if (!this.currentExercise) {
      await this.generateNextExercise();
    }

    const exercise = this.currentExercise ?? "same_different";
    const basePrompt = EXERCISE_PROMPTS[exercise];

    if (this.difficultyLevel >= 8 && exercise === "same_different") {
      return `${basePrompt} Not for nothin’, but this game ain’t like that.`;
    }

    return basePrompt;
  }

  public async recordAttempt(
    userResponse: string,
    extra?: Record<string, any>
  ): Promise<EarTrainingAttempt> {
    if (!this.currentExercise) {
      await this.generateNextExercise();
    }

    const exerciseType = this.currentExercise ?? "same_different";
    const createdAt = dayjs().toISOString();
    const mediaState = await this.mediaSync.getStateSnapshot();

    const systemContext: Record<string, any> = {
      difficultyLevel: this.difficultyLevel,
      mediaState,
      exercisePillar: this.getPillarForExercise(exerciseType),
      audioReady: Boolean((audioEngine as { toneReady?: boolean }).toneReady),
      ...(extra ?? {}),
    };

    const logged = await this.store.logEarTraining({
      userId: this.userId,
      exerciseType,
      difficultyLevel: this.difficultyLevel,
      userResponse,
      systemContext,
      createdAt,
    });

    const attempt: EarTrainingAttempt = {
      id: logged.id,
      userId: this.userId,
      exerciseType,
      createdAt: logged.createdAt,
      userResponse,
      systemContext,
    };

    this.recentHistory.unshift(attempt);
    if (this.recentHistory.length > 50) {
      this.recentHistory.length = 50;
    }

    this.adjustDifficulty();

    return attempt;
  }

  public async getFollowUpPrompt(): Promise<string> {
    const lastAttempt = this.recentHistory[0];

    if (!lastAttempt) {
      return "What else did you notice?";
    }

    try {
      const analysis = await this.deepSeek.analyzeEarTrainingEvent({
        userId: this.userId,
        exerciseType: lastAttempt.exerciseType,
        responseText: lastAttempt.userResponse,
        systemContext: lastAttempt.systemContext,
      });

      this.lastClassificationTags = analysis.skillSignals ?? [];

      if (analysis.reflectivePrompt) {
        return analysis.reflectivePrompt;
      }
    } catch (error) {
      console.error("Failed to get follow-up prompt", error);
    }

    return "What else did you notice?";
  }

  public async runExerciseCycle(
    userResponse: string,
    extraContext?: Record<string, any>
  ): Promise<{
    acknowledgement: string;
    followUp: string;
    newTerm?: string | null;
  }> {
    await this.recordAttempt(userResponse, extraContext);
    const acknowledgement = this.randomAck();
    const followUp = await this.getFollowUpPrompt();
    const newTerm = this.maybeIntroduceTerminology(this.lastClassificationTags);

    return {
      acknowledgement,
      followUp,
      newTerm,
    };
  }

  private adjustDifficulty(): void {
    const recentWindow = this.recentHistory.slice(0, 8);
    if (recentWindow.length === 0) {
      return;
    }

    const confusionCount = recentWindow.filter((attempt) =>
      this.isConfusedResponse(attempt.userResponse)
    ).length;
    const expressivenessScore = this.computeExpressivenessScore(recentWindow);
    const confusionRatio = confusionCount / recentWindow.length;

    if (confusionRatio > 0.4) {
      this.difficultyLevel = Math.max(1, this.difficultyLevel - 1);
    } else if (expressivenessScore > 0.6 && confusionRatio < 0.2) {
      this.difficultyLevel = Math.min(10, this.difficultyLevel + 1);
    }
  }

  private isConfusedResponse(response: string): boolean {
    const trimmed = response.trim();
    if (trimmed.length < 2) {
      return true;
    }

    if (/^\?+$/.test(trimmed)) {
      return true;
    }

    return /(idk|don't know|no clue|unsure|huh)/i.test(trimmed);
  }

  private computeExpressivenessScore(attempts: EarTrainingAttempt[]): number {
    if (attempts.length === 0) {
      return 0;
    }

    const lengths = attempts.map((attempt) => attempt.userResponse.trim().length);
    const avgLength = lengths.reduce((sum, len) => sum + len, 0) / attempts.length;
    const variedLanguage = attempts.some((attempt) => /because|so|felt|like|then/i.test(attempt.userResponse));

    let score = Math.min(avgLength / 80, 1);
    if (variedLanguage) {
      score = Math.min(1, score + 0.15);
    }

    return score;
  }

  private rebalancePillarWeights(): void {
    const recentWindow = this.recentHistory.slice(0, 15);
    if (recentWindow.length === 0) {
      return;
    }

    const pillarStats = new Map<string, { confusion: number; total: number }>();

    for (const attempt of recentWindow) {
      const pillar = this.getPillarForExercise(attempt.exerciseType);
      const current = pillarStats.get(pillar) ?? { confusion: 0, total: 0 };
      current.total += 1;
      if (this.isConfusedResponse(attempt.userResponse)) {
        current.confusion += 1;
      }
      pillarStats.set(pillar, current);
    }

    for (const [pillar, config] of Object.entries(this.pillarWeights)) {
      const stats = pillarStats.get(pillar);
      if (!stats || stats.total < 3) {
        continue;
      }

      const confusionRatio = stats.confusion / stats.total;
      if (confusionRatio > 0.45) {
        config.weight = Math.max(0.4, config.weight - 0.1);
      } else if (confusionRatio < 0.2) {
        config.weight = Math.min(2.5, config.weight + 0.1);
      }
    }
  }

  private pickWeightedPillar(
    pillars: Array<[string, PillarConfig]>
  ): "attention" | "body" | "memory" {
    if (pillars.length === 0) {
      return "attention";
    }

    const totalWeight = pillars.reduce((sum, [, config]) => sum + config.weight, 0);
    let threshold = Math.random() * totalWeight;

    for (const [pillar, config] of pillars) {
      threshold -= config.weight;
      if (threshold <= 0) {
        return pillar as "attention" | "body" | "memory";
      }
    }

    return pillars[0]?.[0] as "attention" | "body" | "memory";
  }

  private maybeIntroduceTerminology(classificationTags: string[]): string | null {
    if (this.recentHistory.length <= 30) {
      return null;
    }

    const recentWindow = this.recentHistory.slice(0, 12);
    const combinedResponses = recentWindow.map((attempt) => attempt.userResponse).join(" ");

    for (const hint of TERMINOLOGY_HINTS) {
      if (this.introducedTerms.has(hint.term)) {
        continue;
      }

      if (hint.matcher(combinedResponses, classificationTags)) {
        this.introducedTerms.add(hint.term);
        return `You’re kinda describing what musicians call ‘${hint.term}’, btw.`;
      }
    }

    return null;
  }

  private getPillarForExercise(
    exercise: EarTrainingExerciseType
  ): "attention" | "body" | "memory" {
    if (PILLAR_EXERCISES.attention.includes(exercise)) {
      return "attention";
    }
    if (PILLAR_EXERCISES.body.includes(exercise)) {
      return "body";
    }
    return "memory";
  }

  private randomAck(): string {
    const index = Math.floor(Math.random() * ACKS.length);
    return ACKS[index] ?? "ok";
  }
}

/*
Example usage:

const ear = new EarTrainingEngine({
  userId,
  userDataStore,
  deepSeek,
  mediaSync,
});
const type = await ear.generateNextExercise();
const prompt = await ear.getExercisePrompt();
const result = await ear.runExerciseCycle("felt like it went up");
console.log(result);
*/
