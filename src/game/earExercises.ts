import { MediaSync } from "../lib/mediaSync";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { EarTrainingMode, EarTrainingPillar } from "./earTrainingArchitecture";

export type EarTrainingExerciseType =
  | "same_different"
  | "up_down"
  | "near_far"
  | "contour"
  | "pulse_tap"
  | "rhythm_echo"
  | "gesture_match"
  | "which_first"
  | "what_changed"
  | "user_language"
  | "adaptive_contrast"
  | "real_world";

export interface ExerciseGeneratorContext {
  userId: string;
  mode: EarTrainingMode;
  pillar: EarTrainingPillar;
  difficulty: number;
  mediaSync: MediaSync;
  deepSeek: DeepSeekEngine;
  timestamp: string;
}

export interface EarExercise {
  id: string;
  type: EarTrainingExerciseType;
  prompt: string;
  payload: Record<string, any>;
  meta: Record<string, any>;
  systemContext: Record<string, any>;
}

const BASE_ACKS = [
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

const promptTone = (text: string): string => `${text} ${BASE_ACKS[Math.floor(Math.random() * BASE_ACKS.length)] ?? "ok"}.`;

const buildPayloadWithContrast = (
  base: Record<string, any>,
  difficulty: number,
  contrastField = "contrastLevel"
): Record<string, any> => ({
  ...base,
  [contrastField]: Math.max(0.1, 1 - difficulty * 0.08),
});

export async function buildSameDifferentExercise(
  ctx: ExerciseGeneratorContext
): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  return {
    id: `same_different-${Date.now()}`,
    type: "same_different",
    prompt: promptTone("Listen up: these two sounds are back-to-back. How'd the second one vibe?"),
    payload: buildPayloadWithContrast({ audioClips: ["clipA", "clipB"], mediaState }, ctx.difficulty),
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}

export async function buildUpDownExercise(ctx: ExerciseGeneratorContext): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  return {
    id: `up_down-${Date.now()}`,
    type: "up_down",
    prompt: promptTone("Heads up: did that slide up, drift down, or just chill?"),
    payload: buildPayloadWithContrast({
      motion: "melodic",
      hint: ctx.difficulty > 6 ? "longer glide" : "gentle bump",
      mediaState,
    }, ctx.difficulty),
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}

export async function buildNearFarExercise(ctx: ExerciseGeneratorContext): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  return {
    id: `near_far-${Date.now()}`,
    type: "near_far",
    prompt: promptTone("Two notes hang out. Feel tight together or spaced out?"),
    payload: buildPayloadWithContrast({ intervalShape: "stacked", mediaState }, ctx.difficulty),
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}

export async function buildContourExercise(ctx: ExerciseGeneratorContext): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  return {
    id: `contour-${Date.now()}`,
    type: "contour",
    prompt: promptTone("Trace this line in your head—what shape did it drift into?"),
    payload: buildPayloadWithContrast({ contour: "arch", mediaState }, ctx.difficulty),
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}

export async function buildPulseTapExercise(ctx: ExerciseGeneratorContext): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  return {
    id: `pulse_tap-${Date.now()}`,
    type: "pulse_tap",
    prompt: promptTone("Catch this pulse and tap wherever—ride it how you feel."),
    payload: {
      tapWindowMs: Math.max(1200 - ctx.difficulty * 60, 400),
      gesture: "tap",
      mediaState,
    },
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}

export async function buildRhythmEchoExercise(ctx: ExerciseGeneratorContext): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  return {
    id: `rhythm_echo-${Date.now()}`,
    type: "rhythm_echo",
    prompt: promptTone("Hear this pattern, then give it back with taps or snaps."),
    payload: {
      pattern: ctx.difficulty > 7 ? [1, 0.5, 0.5, 1, 1.5] : [1, 1, 0.5, 1],
      mediaState,
    },
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}

export async function buildGestureMatchExercise(ctx: ExerciseGeneratorContext): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  return {
    id: `gesture_match-${Date.now()}`,
    type: "gesture_match",
    prompt: promptTone("Match this swoop with your hand or device—let it flow."),
    payload: {
      gestureShape: ctx.difficulty > 5 ? "zigzag" : "swoop",
      requireGyro: true,
      mediaState,
    },
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}

export async function buildWhichFirstExercise(ctx: ExerciseGeneratorContext): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  return {
    id: `which_first-${Date.now()}`,
    type: "which_first",
    prompt: promptTone("Two moments happened. Which one reached you first?"),
    payload: {
      snapshots: ["moment_a", "moment_b"],
      spacingMs: Math.max(1200 - ctx.difficulty * 80, 300),
      mediaState,
    },
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}

export async function buildWhatChangedExercise(ctx: ExerciseGeneratorContext): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  return {
    id: `what_changed-${Date.now()}`,
    type: "what_changed",
    prompt: promptTone("Part A to part B—what shifted for you?"),
    payload: buildPayloadWithContrast({ clips: ["a", "b"], mediaState }, ctx.difficulty, "changeAmount"),
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}

export async function buildUserLanguageExercise(ctx: ExerciseGeneratorContext): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  const reflectivePrompt = await ctx.deepSeek.generateNoGradingResponse({
    userId: ctx.userId,
    userMessage: `Invite open description for ${ctx.mode} at level ${ctx.difficulty}`,
  });

  return {
    id: `user_language-${Date.now()}`,
    type: "user_language",
    prompt: promptTone(reflectivePrompt ?? "Tell me what you’re hearing in your own words."),
    payload: {
      mediaState,
      guide: "open_description",
    },
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}

export async function buildAdaptiveExercise(ctx: ExerciseGeneratorContext): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  return {
    id: `adaptive-${Date.now()}`,
    type: "adaptive_contrast",
    prompt: promptTone("Let’s tighten the contrast—what stands out now?"),
    payload: buildPayloadWithContrast(
      {
        focus: ctx.pillar,
        mediaState,
      },
      ctx.difficulty
    ),
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}

export async function buildRealWorldListeningExercise(ctx: ExerciseGeneratorContext): Promise<EarExercise> {
  const mediaState = await ctx.mediaSync.getStateSnapshot();
  const snapshot = mediaState?.currentTrack ?? "real-world clip";
  return {
    id: `real_world-${Date.now()}`,
    type: "real_world",
    prompt: promptTone("Peep this mix—did you feel the bass wander or the drums shift?"),
    payload: {
      mediaSnapshot: snapshot,
      markers: ctx.mediaSync.getTimestamps?.() ?? [],
      mediaState,
    },
    meta: { difficulty: ctx.difficulty, pillar: ctx.pillar, mode: ctx.mode },
    systemContext: { timestamp: ctx.timestamp, mediaState, pillar: ctx.pillar, difficulty: ctx.difficulty },
  };
}
