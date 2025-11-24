import { EarTrainingEngine } from "./earTrainingEngine";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";

export type EarTrainingFlowState =
  | "idle"
  | "entering_dojo"
  | "generating_exercise"
  | "awaiting_user_input"
  | "processing_input"
  | "follow_up"
  | "session_end";

export interface EarTrainingFlowOptions {
  userId: string;
  engine: EarTrainingEngine;
  userDataStore: UserDataStore;
  deepSeek: DeepSeekEngine;
}

export class EarTrainingFlow {
  private state: EarTrainingFlowState;

  private readonly userId: string;

  private readonly engine: EarTrainingEngine;

  private readonly userDataStore: UserDataStore;

  private readonly deepSeek: DeepSeekEngine;

  private currentPrompt: string | null;

  private pendingResponse: string | null;

  private lastAcknowledgement: string | null;

  private lastFollowUp: string | null;

  private lastTermIntro: string | null;

  private lastExerciseType: string | null;

  constructor(options: EarTrainingFlowOptions) {
    this.userId = options.userId;
    this.engine = options.engine;
    this.userDataStore = options.userDataStore;
    this.deepSeek = options.deepSeek;

    this.state = "idle";
    this.currentPrompt = null;
    this.pendingResponse = null;
    this.lastAcknowledgement = null;
    this.lastFollowUp = null;
    this.lastTermIntro = null;
    this.lastExerciseType = null;
  }

  public async startSession(): Promise<void> {
    try {
      this.state = "entering_dojo";
      this.currentPrompt = await this.showSessionIntro();
      this.state = "generating_exercise";
    } catch (error) {
      console.error("Failed to start ear training session", error);
    }
  }

  private async showSessionIntro(): Promise<string> {
    try {
      return "Not for nothin’, just play. I’m not gonna tell you if you got it wrong or right. Don’t be like that.";
    } catch (error) {
      console.error("Failed to show session intro", error);
      return "Not for nothin’, but this game ain’t like that.";
    }
  }

  public async next(): Promise<void> {
    try {
      switch (this.state) {
        case "generating_exercise":
          await this.generateNextExercise();
          break;
        case "awaiting_user_input":
          await this.waitForUserInput();
          break;
        case "processing_input":
          await this.processUserInput();
          break;
        case "follow_up":
          await this.produceFollowUp();
          break;
        case "idle":
        case "entering_dojo":
        case "session_end":
        default:
          break;
      }
    } catch (error) {
      console.error("Ear training flow next() failed", error);
    }
  }

  private async generateNextExercise(): Promise<void> {
    try {
      this.state = "generating_exercise";
      this.lastAcknowledgement = null;
      this.lastFollowUp = null;
      this.lastTermIntro = null;
      this.pendingResponse = null;

      this.lastExerciseType = await this.engine.generateNextExercise();
      this.currentPrompt = await this.engine.getExercisePrompt();

      this.state = "awaiting_user_input";
    } catch (error) {
      console.error("Failed to generate next ear training exercise", error);
      this.currentPrompt =
        "Take a breath. Not for nothin’, but this game ain’t like that. Tell me what you notice when you’re ready.";
      this.state = "awaiting_user_input";
    }
  }

  private async waitForUserInput(): Promise<void> {
    try {
      // Intentionally left blank; UI should call submitUserResponse.
    } catch (error) {
      console.error("Error while waiting for user input", error);
    }
  }

  public async submitUserResponse(text: string): Promise<void> {
    try {
      if (this.state !== "awaiting_user_input") {
        return;
      }

      this.pendingResponse = text;
      this.state = "processing_input";
      await this.next();
    } catch (error) {
      console.error("Failed to submit user response", error);
    }
  }

  private async processUserInput(): Promise<void> {
    try {
      if (!this.pendingResponse) {
        this.state = "awaiting_user_input";
        return;
      }

      const userText = this.pendingResponse;
      let acknowledgement = "word";
      let followUp = "What else did you notice?";
      let termIntro: string | null = null;

      try {
        const cycleResult = await this.engine.runExerciseCycle(userText);
        acknowledgement = cycleResult.acknowledgement ?? acknowledgement;
        followUp = cycleResult.followUp ?? followUp;
        termIntro = (cycleResult as { newTerm?: string | null }).newTerm ??
          (cycleResult as { termIntro?: string | null }).termIntro ??
          null;
      } catch (error) {
        console.error("Engine cycle failed", error);
      }

      if (this.isGradingQuestion(userText)) {
        try {
          acknowledgement = await this.deepSeek.generateNoGradingResponse({
            userId: this.userId,
            userMessage: userText,
          });
        } catch (error) {
          console.error("Failed to generate no-grading response", error);
          acknowledgement =
            "Not for nothin’, but this game ain’t like that. Just tell me what you heard.";
        }
      }

      try {
        await this.userDataStore.logEarTraining({
          userId: this.userId,
          exerciseType: this.lastExerciseType ?? "unknown",
          userResponse: userText,
          systemContext: { source: "earTrainingFlow" },
        });
      } catch (error) {
        console.error("Failed to log ear training response from flow", error);
      }

      this.lastAcknowledgement = acknowledgement;
      this.lastFollowUp = followUp;
      this.lastTermIntro = termIntro;
      this.pendingResponse = null;
      this.state = "follow_up";
    } catch (error) {
      console.error("Failed to process user input", error);
    }
  }

  private async produceFollowUp(): Promise<void> {
    try {
      // The UI layer should read acknowledgement/followUp/termIntro via getters.
      this.state = "generating_exercise";
    } catch (error) {
      console.error("Failed to produce follow-up", error);
    }
  }

  public async endSession(): Promise<void> {
    try {
      this.state = "session_end";
      await this.userDataStore.logSessionEvent({
        userId: this.userId,
        type: "session_end",
      });
      this.currentPrompt = null;
      this.pendingResponse = null;
      this.lastAcknowledgement = null;
      this.lastFollowUp = null;
      this.lastTermIntro = null;
      this.lastExerciseType = null;
    } catch (error) {
      console.error("Failed to end ear training session", error);
    }
  }

  public getCurrentPrompt(): string | null {
    return this.currentPrompt;
  }

  public getLastAcknowledgement(): string | null {
    return this.lastAcknowledgement;
  }

  public getLastFollowUp(): string | null {
    return this.lastFollowUp;
  }

  public getLastTermIntro(): string | null {
    return this.lastTermIntro;
  }

  private isGradingQuestion(text: string): boolean {
    const normalized = text.toLowerCase();
    return /did i (get it )?(right|correct)/i.test(normalized) ||
      /was that (right|correct)/i.test(normalized) ||
      /is that (right|correct)/i.test(normalized) ||
      /did i pass/i.test(normalized) ||
      /did this work/i.test(normalized) ||
      /how did i do/i.test(normalized);
  }
}

/*
Example usage:

import { EarTrainingEngine } from "./earTrainingEngine";
import { EarTrainingFlow } from "./earTrainingFlow";

const flow = new EarTrainingFlow({
  userId: profile.id,
  engine,
  userDataStore: store,
  deepSeek,
});

await flow.startSession();
await flow.next(); // generates exercise
flow.getCurrentPrompt(); // UI shows this
await flow.submitUserResponse("felt like it rose a little");
flow.getLastFollowUp();
*/
