import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import { MediaSync } from "../lib/mediaSync";
import dayjs from "dayjs";
import {
  EarExercise,
  EarTrainingExerciseType,
  ExerciseGeneratorContext,
  buildAdaptiveExercise,
  buildContourExercise,
  buildGestureMatchExercise,
  buildNearFarExercise,
  buildPulseTapExercise,
  buildRealWorldListeningExercise,
  buildRhythmEchoExercise,
  buildSameDifferentExercise,
  buildUpDownExercise,
  buildUserLanguageExercise,
  buildWhatChangedExercise,
  buildWhichFirstExercise,
} from "./earExercises";
import { EarTrainingSession } from "./earTrainingSession";

export type EarTrainingMode =
  | "classic_conservatory"
  | "user_language"
  | "adaptive_challenge"
  | "real_world_listening";

export type EarTrainingPillar = "attention" | "body" | "memory";

export interface EarTrainingArchitectureOptions {
  userId: string;
  userDataStore: UserDataStore;
  deepSeek: DeepSeekEngine;
  mediaSync: MediaSync;
}

interface ModePlan {
  mode: EarTrainingMode;
  pillar: EarTrainingPillar;
  exerciseType: EarTrainingExerciseType;
}

export class EarTrainingArchitecture {
  private userId: string;

  private userDataStore: UserDataStore;

  private deepSeek: DeepSeekEngine;

  private mediaSync: MediaSync;

  private difficultyLevel: number;

  private modeCursor: number;

  private recentResponses: string[];

  private session: EarTrainingSession | null;

  constructor(options: EarTrainingArchitectureOptions) {
    this.userId = options.userId;
    this.userDataStore = options.userDataStore;
    this.deepSeek = options.deepSeek;
    this.mediaSync = options.mediaSync;
    this.difficultyLevel = 1;
    this.modeCursor = 0;
    this.recentResponses = [];
    this.session = null;
  }

  public createSession(): EarTrainingSession {
    this.session = new EarTrainingSession({
      userId: this.userId,
      architecture: this,
      deepSeek: this.deepSeek,
      userDataStore: this.userDataStore,
      mediaSync: this.mediaSync,
    });

    return this.session;
  }

  public async generateExercisePlan(): Promise<ModePlan> {
    const modes: EarTrainingMode[] = [
      "classic_conservatory",
      "user_language",
      "adaptive_challenge",
      "real_world_listening",
    ];
    const mode = modes[this.modeCursor % modes.length];
    this.modeCursor += 1;

    const pillar = this.pickPillar(mode);
    const exerciseType = this.pickExerciseForMode(mode, pillar);

    return { mode, pillar, exerciseType };
  }

  public async buildExercise(plan?: ModePlan): Promise<EarExercise> {
    const resolvedPlan = plan ?? (await this.generateExercisePlan());
    const generatorContext: ExerciseGeneratorContext = {
      userId: this.userId,
      mode: resolvedPlan.mode,
      pillar: resolvedPlan.pillar,
      difficulty: this.difficultyLevel,
      mediaSync: this.mediaSync,
      deepSeek: this.deepSeek,
      timestamp: dayjs().toISOString(),
    };

    const builderMap: Record<EarTrainingExerciseType, (ctx: ExerciseGeneratorContext) => Promise<EarExercise>> = {
      same_different: buildSameDifferentExercise,
      up_down: buildUpDownExercise,
      near_far: buildNearFarExercise,
      contour: buildContourExercise,
      pulse_tap: buildPulseTapExercise,
      rhythm_echo: buildRhythmEchoExercise,
      gesture_match: buildGestureMatchExercise,
      which_first: buildWhichFirstExercise,
      what_changed: buildWhatChangedExercise,
      user_language: buildUserLanguageExercise,
      adaptive_contrast: buildAdaptiveExercise,
      real_world: buildRealWorldListeningExercise,
    };

    const builder = builderMap[resolvedPlan.exerciseType];
    const exercise = await builder(generatorContext);
    return exercise;
  }

  public recordResponse(response: string): void {
    this.recentResponses.unshift(response);
    if (this.recentResponses.length > 50) {
      this.recentResponses.pop();
    }

    this.updateDifficulty();
  }

  public getDifficultyLevel(): number {
    return this.difficultyLevel;
  }

  public getDeepSeek(): DeepSeekEngine {
    return this.deepSeek;
  }

  public getUserDataStore(): UserDataStore {
    return this.userDataStore;
  }

  public getMediaSync(): MediaSync {
    return this.mediaSync;
  }

  private pickPillar(mode: EarTrainingMode): EarTrainingPillar {
    if (mode === "classic_conservatory") {
      const pillars: EarTrainingPillar[] = ["attention", "attention", "body", "memory"];
      return pillars[Math.floor(Math.random() * pillars.length)] ?? "attention";
    }

    if (mode === "adaptive_challenge") {
      const variation = Math.abs(Math.sin(this.difficultyLevel));
      if (variation > 0.7) {
        return "body";
      }
      return variation > 0.35 ? "memory" : "attention";
    }

    return "attention";
  }

  private pickExerciseForMode(
    mode: EarTrainingMode,
    pillar: EarTrainingPillar
  ): EarTrainingExerciseType {
    if (mode === "classic_conservatory") {
      const attentionExercises: EarTrainingExerciseType[] = [
        "same_different",
        "up_down",
        "near_far",
        "contour",
      ];
      return attentionExercises[Math.floor(Math.random() * attentionExercises.length)] ?? "same_different";
    }

    if (mode === "user_language") {
      return "user_language";
    }

    if (mode === "adaptive_challenge") {
      const pillarMap: Record<EarTrainingPillar, EarTrainingExerciseType> = {
        attention: "adaptive_contrast",
        body: "pulse_tap",
        memory: "which_first",
      };
      return pillarMap[pillar];
    }

    return "real_world";
  }

  private updateDifficulty(): void {
    if (this.recentResponses.length < 3) {
      return;
    }

    const vocabularyScore = this.recentResponses
      .slice(0, 6)
      .map((resp) => resp.split(/\s+/).length)
      .reduce((sum, words) => sum + words, 0);
    const hesitations = this.recentResponses.slice(0, 6).filter((resp) => /(idk|unsure|no clue|not sure|\?)/i.test(resp)).length;

    if (hesitations >= 3) {
      this.difficultyLevel = Math.max(1, this.difficultyLevel - 1);
      return;
    }

    if (vocabularyScore > 60) {
      this.difficultyLevel = Math.min(10, this.difficultyLevel + 1);
    } else if (vocabularyScore > 30 && hesitations === 0) {
      this.difficultyLevel = Math.min(10, this.difficultyLevel + 1);
    }
  }
}
