import dayjs from "dayjs";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import { MediaSync } from "../lib/mediaSync";
import type { EarTrainingArchitecture } from "./earTrainingArchitecture";
import { EarExercise } from "./earExercises";

interface EarTrainingSessionOptions {
  userId: string;
  architecture: EarTrainingArchitecture;
  deepSeek: DeepSeekEngine;
  userDataStore: UserDataStore;
  mediaSync: MediaSync;
}

export class EarTrainingSession {
  private userId: string;

  private architecture: EarTrainingArchitecture;

  private deepSeek: DeepSeekEngine;

  private userDataStore: UserDataStore;

  private mediaSync: MediaSync;

  private currentExercise: EarExercise | null;

  constructor(options: EarTrainingSessionOptions) {
    this.userId = options.userId;
    this.architecture = options.architecture;
    this.deepSeek = options.deepSeek;
    this.userDataStore = options.userDataStore;
    this.mediaSync = options.mediaSync;
    this.currentExercise = null;
  }

  public async startNewExercise(): Promise<EarExercise> {
    this.currentExercise = await this.architecture.buildExercise();
    return this.currentExercise;
  }

  public getPrompt(): string {
    return this.currentExercise?.prompt ?? "Take a breath—new sound coming up.";
  }

  public async submitResponse(
    userResponse: string
  ): Promise<{ acknowledgement: string; followUp: string; termIntro?: string | null }> {
    if (!this.currentExercise) {
      await this.startNewExercise();
    }

    const exercise = this.currentExercise as EarExercise;
    const createdAt = dayjs().toISOString();

    const systemContext = {
      ...exercise.systemContext,
      mode: exercise.meta.mode,
      pillar: exercise.meta.pillar,
      difficulty: exercise.meta.difficulty,
      timestamp: createdAt,
      mediaSnapshot: await this.mediaSync.getStateSnapshot(),
    };

    await this.userDataStore.logEarTraining({
      userId: this.userId,
      exerciseType: exercise.type,
      difficultyLevel: exercise.meta.difficulty,
      userResponse,
      systemContext,
    });

    this.architecture.recordResponse(userResponse);

    const acknowledgement = await this.deepSeek.generateNoGradingResponse({
      userId: this.userId,
      userMessage: "give a casual nod without grading",
    });

    const reflectivePrompt = await this.deepSeek.generateTestFreeTestPrompt({
      userId: this.userId,
      roughLevel:
        exercise.meta.difficulty > 7
          ? "advanced"
          : exercise.meta.difficulty > 4
          ? "intermediate"
          : "beginner",
      focusArea: `${exercise.meta.mode}-${exercise.meta.pillar}`,
    });

    const followUp =
      reflectivePrompt?.promptText ||
      (await this.deepSeek.generateNoGradingResponse({
        userId: this.userId,
        userMessage: "offer a reflective follow-up without grading",
      })) ||
      "What else did you notice?";

    const correctnessCheck = /(correct|right|wrong|score|grade)/i.test(userResponse);
    const acknowledgementSafe = correctnessCheck
      ? "Not for nothin’, but this game ain’t like that."
      : acknowledgement ?? "ok";

    const deepSeekAnalysis = await this.deepSeek.analyzeEarTrainingEvent({
      userId: this.userId,
      exerciseType: exercise.type,
      responseText: userResponse,
      systemContext,
    });

    const termIntro = deepSeekAnalysis.reflectivePrompt ?? null;

    this.currentExercise = await this.architecture.buildExercise();

    return {
      acknowledgement: acknowledgementSafe,
      followUp,
      termIntro,
    };
  }

  public endSession(): void {
    this.currentExercise = null;
  }
}
