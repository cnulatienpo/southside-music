import { nanoid } from "nanoid";
import { DeepSeekEngine, TestFreeTestPrompt } from "../lib/deepSeekEngine";
import { EarTrainingFlow } from "./earTrainingFlow";
import { EarTrainingEngine, EarTrainingExerciseType } from "./earTrainingEngine";
import { UserDataStore } from "../data/userDataStore";

export interface NoGradingEngine {
  generateResponse(input: { userId: string; userMessage: string }): Promise<string>;
}

export interface ForwardShadowOptions {
  userId: string;
  deepSeek: DeepSeekEngine;
  earTrainingFlow: EarTrainingFlow;
  earTrainingEngine: EarTrainingEngine;
  userDataStore: UserDataStore;
  noGradingEngine?: NoGradingEngine;
  blockDurationMs?: number;
}

export interface ForwardShadowQuestion {
  id: string;
  prompt: string;
  tags: string[];
  createdAt: string;
  exerciseType: EarTrainingExerciseType | "mixed";
  source: "forward_shadow";
}

export interface SecretMasterySignal {
  tag: string;
  confidence: number;
  note?: string;
}

export interface ForwardShadowResponse {
  acknowledgement: string;
  masterySignals: SecretMasterySignal[];
  followUp?: string | null;
}

/**
 * ForwardShadowEngine injects "test-free" prompts that quietly sample a player's
 * mastery while honoring the game's anti-shame rules. It only schedules one
 * forward-shadow question per block and refuses to grade or expose answers.
 */
export class ForwardShadowEngine {
  private readonly userId: string;

  private readonly deepSeek: DeepSeekEngine;

  private readonly earTrainingFlow: EarTrainingFlow;

  private readonly earTrainingEngine: EarTrainingEngine;

  private readonly userDataStore: UserDataStore;

  private readonly noGradingEngine?: NoGradingEngine;

  private readonly blockDurationMs: number;

  private currentBlockId: string;

  private blockStartedAt: number;

  private currentQuestion: ForwardShadowQuestion | null;

  constructor(options: ForwardShadowOptions) {
    this.userId = options.userId;
    this.deepSeek = options.deepSeek;
    this.earTrainingFlow = options.earTrainingFlow;
    this.earTrainingEngine = options.earTrainingEngine;
    this.userDataStore = options.userDataStore;
    this.noGradingEngine = options.noGradingEngine;
    this.blockDurationMs = options.blockDurationMs ?? 6 * 60 * 1000; // default: 6 minutes per block

    this.currentBlockId = nanoid();
    this.blockStartedAt = Date.now();
    this.currentQuestion = null;
  }

  /**
   * Resets the block cursor so a new forward-shadow question can be scheduled.
   * Should be called when a session or UI block begins.
   */
  public startNewBlock(): void {
    this.currentBlockId = nanoid();
    this.blockStartedAt = Date.now();
    this.currentQuestion = null;
  }

  /**
   * Returns true when a forward-shadow question may be scheduled for the current block.
   */
  public canScheduleQuestion(): boolean {
    const withinBlock = Date.now() - this.blockStartedAt < this.blockDurationMs;
    return withinBlock && !this.currentQuestion;
  }

  /**
   * Generates (or returns) the single forward-shadow question for this block.
   * The prompt is anti-shame by design and never asks for correctness.
   */
  public async getOrCreateQuestion(): Promise<ForwardShadowQuestion> {
    if (!this.canScheduleQuestion() && this.currentQuestion) {
      return this.currentQuestion;
    }

    const [testFreePrompt, exerciseType] = await Promise.all([
      this.buildTestFreePrompt(),
      this.peekExerciseType(),
    ]);

    const question: ForwardShadowQuestion = {
      id: nanoid(),
      prompt: this.decoratePrompt(testFreePrompt.promptText),
      tags: testFreePrompt.internalTags ?? [],
      createdAt: new Date().toISOString(),
      exerciseType,
      source: "forward_shadow",
    };

    this.currentQuestion = question;
    await this.logQuestion(question);
    return question;
  }

  /**
   * Accepts a user reflection for the current block's forward-shadow prompt.
   * The reply always keeps the anti-shame personality and never grades.
   */
  public async recordReflection(userText: string): Promise<ForwardShadowResponse> {
    if (!this.currentQuestion) {
      await this.getOrCreateQuestion();
    }

    const activeQuestion = this.currentQuestion as ForwardShadowQuestion;

    const responseText = userText?.trim() ?? "";
    const antiGradingAck = await this.handleNoGrading(responseText);

    const masterySignals = await this.detectSecretMastery(responseText, activeQuestion);

    await this.userDataStore.logEarTraining({
      userId: this.userId,
      exerciseType: activeQuestion.exerciseType,
      userResponse: responseText,
      systemContext: {
        source: "forwardShadowEngine",
        blockId: this.currentBlockId,
        questionTags: activeQuestion.tags,
        antiGrading: Boolean(antiGradingAck),
      },
    });

    const acknowledgement = antiGradingAck || this.buildAntiShameAcknowledgement();
    const followUp = this.buildFollowUpPrompt(activeQuestion);

    return { acknowledgement, masterySignals, followUp };
  }

  private async buildTestFreePrompt(): Promise<TestFreeTestPrompt> {
    try {
      return await this.deepSeek.generateTestFreeTestPrompt({
        userId: this.userId,
        roughLevel: "beginner",
        focusArea: "ear_training",
      });
    } catch (error) {
      console.error("Failed to generate forward-shadow prompt", error);
      return { promptText: "What did you notice just now?", internalTags: ["fallback"] };
    }
  }

  private decoratePrompt(basePrompt: string): string {
    const reminder = " Not for nothin’, but this game ain’t like that—no grades, just vibes.";
    if (basePrompt.includes("Not for nothin’")) {
      return basePrompt;
    }

    return `${basePrompt.trim()}${reminder}`;
  }

  private async peekExerciseType(): Promise<EarTrainingExerciseType | "mixed"> {
    try {
      await this.earTrainingEngine.getExercisePrompt();
      const potentialType = (this.earTrainingEngine as unknown as { currentExercise?: EarTrainingExerciseType }).currentExercise;
      return potentialType ?? "mixed";
    } catch (error) {
      console.error("Unable to peek exercise type for forward-shadow", error);
      return "mixed";
    }
  }

  private async logQuestion(question: ForwardShadowQuestion): Promise<void> {
    try {
      await this.userDataStore.logEarTraining({
        userId: this.userId,
        exerciseType: question.exerciseType,
        userResponse: question.prompt,
        systemContext: {
          source: "forwardShadowEngine",
          blockId: this.currentBlockId,
          questionTags: question.tags,
          createdAt: question.createdAt,
          mode: "forward_shadow",
        },
      });
    } catch (error) {
      console.error("Failed to log forward-shadow question", error);
    }
  }

  private buildAntiShameAcknowledgement(): string {
    const acknowledgements = [
      "ok", "word", "cool", "thanks for rolling through", "preciate you", "aight", "nice"
    ];
    const vibe = acknowledgements[Math.floor(Math.random() * acknowledgements.length)] ?? "word";
    return `${vibe}. No grades here—just keep noticing.`;
  }

  private buildFollowUpPrompt(question: ForwardShadowQuestion): string {
    const antiShameTail = "No right or wrong, just say what shifted for you.";
    const probe = this.earTrainingFlow ? "Anything else jump out while you played?" : "What else did you notice?";
    if (question.exerciseType === "pulse_tap" || question.exerciseType === "rhythm_echo") {
      return `${probe} ${antiShameTail}`;
    }

    return `${probe} ${antiShameTail}`;
  }

  private detectGradingLanguage(text: string): boolean {
    if (!text) return false;
    return /correct|right|wrong|score|grade|did i (get|do) (it )?right/i.test(text);
  }

  private async handleNoGrading(userText: string): Promise<string> {
    if (!this.detectGradingLanguage(userText)) {
      return "";
    }

    try {
      if (this.noGradingEngine) {
        return await this.noGradingEngine.generateResponse({ userId: this.userId, userMessage: userText });
      }

      return await this.deepSeek.generateNoGradingResponse({
        userId: this.userId,
        userMessage: userText,
      });
    } catch (error) {
      console.error("No-grading response failed", error);
      return "Not for nothin’, but this game ain’t like that. Just tell me what you heard.";
    }
  }

  private async detectSecretMastery(
    userText: string,
    question: ForwardShadowQuestion
  ): Promise<SecretMasterySignal[]> {
    try {
      const analysis = await this.deepSeek.analyzeEarTrainingEvent({
        userId: this.userId,
        exerciseType: question.exerciseType,
        responseText: userText,
        systemContext: {
          blockId: this.currentBlockId,
          questionTags: question.tags,
          source: "forwardShadowEngine",
        },
      });

      const signals = (analysis.skillSignals ?? []).map((tag) => ({
        tag,
        confidence: 0.7,
        note: "Stealth mastery hint detected",
      }));

      if (analysis.difficultyHint) {
        signals.push({
          tag: analysis.difficultyHint,
          confidence: 0.6,
          note: "Difficulty suggestion from DeepSeek",
        });
      }

      return signals;
    } catch (error) {
      console.error("Failed to detect secret mastery", error);
      return [];
    }
  }
}
