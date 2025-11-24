import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import audioEngine from "../audio/audioEngine";
import { MediaSync } from "../lib/mediaSync";
import dayjs from "dayjs";

export type LadderStage =
  | "stage1_octave_chunking"
  | "stage2_multi_octave"
  | "stage3_octave_border"
  | "stage4_note_color"
  | "stage5_note_names"
  | "stage6_instrument_invariance"
  | "stage7_real_song_pitch";

export interface LadderProgress {
  stage: LadderStage;
  stabilityScore: number;
  learnedNotes?: string[];
  octaveConfidence?: number;
}

export interface LadderAttempt {
  id: string;
  userId: string;
  stage: LadderStage;
  createdAt: string;
  userResponse: string;
  systemContext: Record<string, any>;
}

type OctavePitchLadderOptions = {
  userId: string;
  deepSeek: DeepSeekEngine;
  userDataStore: UserDataStore;
  mediaSync: MediaSync;
};

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

const NOTE_PROGRESSIONS = ["C", "G", "E", "D", "A", "F", "B"];
const BORDER_OCTAVES = [0, 1, 2, 3, 4, 5, 6, 7];
const MULTI_OCTAVE_BUCKETS = [0, 2, 4, 6, 8];
const CHUNK_OCTAVES = [0, 4, 8];
const TONE_COLOR_TERMS = ["octave", "tone color", "pitch", "register", "timbre"];
const INSTRUMENT_TYPES = ["sine", "square", "sawtooth", "triangle", "pulse"] as const;
const INSTRUMENT_LABELS = ["synth", "guitar", "bass", "strings", "voice"];

export class OctavePitchLadder {
  private userId: string;
  private deepSeek: DeepSeekEngine;
  private store: UserDataStore;
  private mediaSync: MediaSync;

  private currentStage: LadderStage;
  private stabilityScore: number;
  private learnedNotes: Set<string>;
  private octaveConfidence: number;

  private recentAttempts: LadderAttempt[];
  private introducedTerms: Set<string>;

  constructor(options: OctavePitchLadderOptions) {
    this.userId = options.userId;
    this.deepSeek = options.deepSeek;
    this.store = options.userDataStore;
    this.mediaSync = options.mediaSync;

    this.currentStage = "stage1_octave_chunking";
    this.stabilityScore = 0;
    this.octaveConfidence = 0;
    this.learnedNotes = new Set();
    this.recentAttempts = [];
    this.introducedTerms = new Set();
  }

  public getCurrentStage(): LadderStage {
    return this.currentStage;
  }

  public getProgress(): LadderProgress {
    return {
      stage: this.currentStage,
      stabilityScore: this.stabilityScore,
      learnedNotes: Array.from(this.learnedNotes),
      octaveConfidence: this.octaveConfidence,
    };
  }

  public resetLadder(): void {
    this.currentStage = "stage1_octave_chunking";
    this.stabilityScore = 0;
    this.octaveConfidence = 0;
    this.learnedNotes.clear();
    this.recentAttempts = [];
    this.introducedTerms.clear();
  }

  public async getNextPrompt(): Promise<string> {
    try {
      switch (this.currentStage) {
        case "stage1_octave_chunking":
          return this.handleStageOnePrompt();
        case "stage2_multi_octave":
          return this.handleStageTwoPrompt();
        case "stage3_octave_border":
          return this.handleStageThreePrompt();
        case "stage4_note_color":
          return this.handleStageFourPrompt();
        case "stage5_note_names":
          return this.handleStageFivePrompt();
        case "stage6_instrument_invariance":
          return this.handleStageSixPrompt();
        case "stage7_real_song_pitch":
          return this.handleStageSevenPrompt();
        default:
          return "Take a breath—listening game loading.";
      }
    } catch (error) {
      console.error("Failed to build next prompt", error);
      return "Something glitched; breathe for a sec and we’ll try again.";
    }
  }

  public async submitResponse(
    text: string
  ): Promise<{ acknowledgement: string; followUp: string; newTerm?: string | null }> {
    const acknowledgement = ACKS[Math.floor(Math.random() * ACKS.length)] ?? "ok";
    const createdAt = dayjs().toISOString();

    try {
      const mediaState = await this.mediaSync.getStateSnapshot();
      const systemContext: Record<string, any> = {
        stage: this.currentStage,
        stabilityScore: this.stabilityScore,
        mediaState,
        audioReady: Boolean((audioEngine as { toneReady?: boolean }).toneReady),
      };

      const logged = await this.store.logEarTraining({
        userId: this.userId,
        exerciseType: "octave_pitch_ladder",
        userResponse: text,
        systemContext,
        createdAt,
      });

      const attempt: LadderAttempt = {
        id: logged.id,
        userId: this.userId,
        stage: this.currentStage,
        createdAt: logged.createdAt,
        userResponse: text,
        systemContext,
      };

      this.recentAttempts.unshift(attempt);
      if (this.recentAttempts.length > 100) {
        this.recentAttempts.pop();
      }

      this.adjustStability(text);
      this.maybeAdvanceStage();

      const reflective = await this.deepSeek.analyzeEarTrainingEvent({
        userId: this.userId,
        exerciseType: this.currentStage,
        responseText: text,
        systemContext,
      });

      const newTerm = this.maybeIntroduceTerminology();
      const followUp =
        reflective?.reflectivePrompt ??
        "Log how it felt—textures, colors, shapes—so we can vibe on the next one.";

      if (newTerm) {
        return { acknowledgement, followUp, newTerm };
      }

      return { acknowledgement, followUp };
    } catch (error) {
      console.error("Failed to submit ladder response", error);
      return {
        acknowledgement,
        followUp: "Taking a beat—something hiccuped. Tell me how it felt once more?",
      };
    }
  }

  private handleStageOnePrompt(): string {
    const octave = CHUNK_OCTAVES[Math.floor(Math.random() * CHUNK_OCTAVES.length)] ?? 0;
    const noteName = this.pickNoteName(octave);
    this.safePlayNote(noteName, { durationMs: 800 });

    return "Is this LOW, MID, or HIGH? Which world does this note live in?";
  }

  private handleStageTwoPrompt(): string {
    const octave =
      MULTI_OCTAVE_BUCKETS[Math.floor(Math.random() * MULTI_OCTAVE_BUCKETS.length)] ?? 0;
    const noteName = this.pickNoteName(octave);
    this.safePlayNote(noteName, { durationMs: 800 });

    return "Tap the region this sound came from—lean into the space it sits in.";
  }

  private handleStageThreePrompt(): string {
    const baseOctave = BORDER_OCTAVES[Math.floor(Math.random() * BORDER_OCTAVES.length)] ?? 0;
    const choice = Math.random() > 0.5 ? baseOctave : baseOctave + 1;
    const noteName = this.pickNoteName(choice);
    this.safePlayNote(noteName, { durationMs: 850 });

    return "Does this feel like the lower layer or the upper layer?";
  }

  private handleStageFourPrompt(): string {
    const octave = 3 + Math.floor(Math.random() * 3);
    const noteName = this.pickNoteName(octave);
    this.safePlayNote(noteName, { durationMs: 1200, repeat: true });

    return "How does this one feel? Heavy? Bright? Sharp? Warm?";
  }

  private handleStageFivePrompt(): string {
    const target = this.getNextNoteNameTarget();
    const octave = 4;
    const noteName = `${target}${octave}`;
    this.safePlayNote(noteName, { durationMs: 1000, repeat: true });

    if (this.stabilityScore < 40) {
      return "Sit with this one note—describe the color or weight before we start tossing names around.";
    }

    if (this.learnedNotes.size === 0) {
      return "Does this feel like C or Not-C? Trust the vibe.";
    }

    const activeNames = Array.from(this.learnedNotes.values());
    const options = [...new Set([target, ...activeNames])];

    if (options.length <= 2) {
      return `Does this feel like ${target} or something else?`;
    }

    return `Does this feel like ${options.slice(0, 2).join(" or ")}, or something else?`;
  }

  private handleStageSixPrompt(): string {
    const target = this.getNextNoteNameTarget();
    const octave = 4;
    const instrumentIndex = Math.floor(Math.random() * INSTRUMENT_TYPES.length);
    const instrumentType = INSTRUMENT_TYPES[instrumentIndex] ?? "sine";
    const label = INSTRUMENT_LABELS[instrumentIndex] ?? "synth";
    const noteName = `${target}${octave}`;

    this.safePlayNote(noteName, { durationMs: 1000, oscillatorType: instrumentType });

    return `Same note, new outfit (${label}). What do you think it is?`;
  }

  private handleStageSevenPrompt(): string {
    this.mediaSync.getStateSnapshot().catch((error) => {
      console.error("Failed to grab media snapshot for stage 7", error);
    });

    return "Where did that line land? Which note did that run settle on?";
  }

  private adjustStability(userText: string): void {
    const expressivePatterns = /(heavy|light|warm|bright|spark|color|muddy|clear|chewy|floaty)/i;
    const lengthScore = userText.trim().length;

    if (expressivePatterns.test(userText)) {
      this.stabilityScore += 5;
      this.octaveConfidence += 2;
    }

    if (lengthScore > 40) {
      this.stabilityScore += 3;
    } else if (lengthScore < 6) {
      this.stabilityScore -= 5;
    } else if (lengthScore < 15) {
      this.stabilityScore -= 2;
    }

    if (/low|down|deep/i.test(userText)) {
      this.octaveConfidence += 1;
    }
    if (/high|up|float/i.test(userText)) {
      this.octaveConfidence += 1;
    }
    if (/mid|middle|center/i.test(userText)) {
      this.octaveConfidence += 1;
    }

    this.stabilityScore = this.clamp(this.stabilityScore, 0, 100);
    this.octaveConfidence = this.clamp(this.octaveConfidence, 0, 100);

    if (this.currentStage === "stage5_note_names") {
      const target = this.getNextNoteNameTarget();
      if (new RegExp(target, "i").test(userText)) {
        this.learnedNotes.add(target);
      }
    }

    if (this.currentStage === "stage6_instrument_invariance" && userText.trim().length > 10) {
      this.stabilityScore += 2;
    }
  }

  private maybeAdvanceStage(): void {
    if (this.currentStage === "stage1_octave_chunking" && this.stabilityScore > 30) {
      this.currentStage = "stage2_multi_octave";
      return;
    }

    if (
      this.currentStage === "stage2_multi_octave" &&
      this.octaveConfidence > 25 &&
      this.recentAttempts.length >= 5
    ) {
      this.currentStage = "stage3_octave_border";
      return;
    }

    if (
      this.currentStage === "stage3_octave_border" &&
      this.recentAttempts.filter((a) => /lower|upper|layer/i.test(a.userResponse)).length >= 4
    ) {
      this.currentStage = "stage4_note_color";
      return;
    }

    if (
      this.currentStage === "stage4_note_color" &&
      this.recentAttempts.filter((a) => a.stage === "stage4_note_color").length >= 12
    ) {
      this.currentStage = "stage5_note_names";
      return;
    }

    if (
      this.currentStage === "stage5_note_names" &&
      this.learnedNotes.size >= 3
    ) {
      this.currentStage = "stage6_instrument_invariance";
      return;
    }

    if (
      this.currentStage === "stage6_instrument_invariance" &&
      this.recentAttempts.filter((a) => a.stage === "stage6_instrument_invariance").length >= 10
    ) {
      this.currentStage = "stage7_real_song_pitch";
    }
  }

  private maybeIntroduceTerminology(): string | null {
    const eligibleStages: LadderStage[] = [
      "stage4_note_color",
      "stage5_note_names",
      "stage6_instrument_invariance",
      "stage7_real_song_pitch",
    ];

    if (!eligibleStages.includes(this.currentStage)) {
      return null;
    }

    const nextTerm = TONE_COLOR_TERMS.find((term) => !this.introducedTerms.has(term));
    if (!nextTerm || Math.random() < 0.6) {
      return null;
    }

    this.introducedTerms.add(nextTerm);
    return `You're kinda describing what musicians call “${nextTerm}”, btw.`;
  }

  private pickNoteName(octave: number): string {
    const letters = ["C", "D", "E", "F", "G", "A", "B"];
    const letter = letters[Math.floor(Math.random() * letters.length)] ?? "C";
    return `${letter}${octave}`;
  }

  private getNextNoteNameTarget(): string {
    for (const note of NOTE_PROGRESSIONS) {
      if (!this.learnedNotes.has(note)) {
        return note;
      }
    }

    return NOTE_PROGRESSIONS[NOTE_PROGRESSIONS.length - 1] ?? "C";
  }

  private safePlayNote(
    noteName: string,
    options?: { durationMs?: number; repeat?: boolean; oscillatorType?: string }
  ): void {
    try {
      const durationMs = options?.durationMs ?? 800;
      const oscillatorType = options?.oscillatorType;

      if (oscillatorType) {
        audioEngine.playNote(noteName, durationMs, { type: oscillatorType });
      } else {
        audioEngine.playNote(noteName, durationMs);
      }

      if (options?.repeat) {
        setTimeout(() => {
          if (oscillatorType) {
            audioEngine.playNote(noteName, durationMs, { type: oscillatorType });
          } else {
            audioEngine.playNote(noteName, durationMs);
          }
        }, durationMs + 200);
      }
    } catch (error) {
      console.warn("Audio playback unavailable", error);
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}

/*
Example usage:

  const ladder = new OctavePitchLadder({
    userId: profile.id,
    deepSeek,
    userDataStore: store,
    mediaSync,
  });

  const prompt = await ladder.getNextPrompt();
  console.log(prompt);

  const res = await ladder.submitResponse("felt heavy, like low");
  console.log(res);
*/
