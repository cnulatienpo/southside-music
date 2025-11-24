import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import { EarTrainingEngine } from "../game/earTrainingEngine";
import { OctavePitchLadder } from "../game/octavePitchLadder";
import { DojoDrill, getDrillDefinition } from "./dojoDrills";

type ConstructorOptions = {
  userId: string;
  deepSeek: DeepSeekEngine;
  store: UserDataStore;
  earTrainingEngine: EarTrainingEngine;
  ladder: OctavePitchLadder;
};

const ACKS = ["ok", "word", "cool", "aight", "nice", "solid", "all good", "rolling"];

export type DojoDrillResult = {
  prompt: string;
  drill: DojoDrill;
  acknowledgement: string;
  systemContext: Record<string, any>;
};

export type DojoDrillFollowUp = {
  acknowledgement: string;
  followUp: string;
  newTerm?: string | null;
  drill: DojoDrill;
};

export class DojoEngine {
  private userId: string;
  private deepSeek: DeepSeekEngine;
  private store: UserDataStore;
  private earTrainingEngine: EarTrainingEngine;
  private ladder: OctavePitchLadder;
  private currentDrill: DojoDrill | null;

  constructor(options: ConstructorOptions) {
    this.userId = options.userId;
    this.deepSeek = options.deepSeek;
    this.store = options.store;
    this.earTrainingEngine = options.earTrainingEngine;
    this.ladder = options.ladder;
    this.currentDrill = null;
  }

  public async startDrill(drillName: string): Promise<DojoDrillResult> {
    const drill = getDrillDefinition(drillName);
    this.currentDrill = drill;

    const ladderPrompt =
      drill.category === "pitch_training" ? await this.ladder.getNextPrompt() : null;
    const prompt = ladderPrompt ? `${drill.prompt} ${ladderPrompt}` : drill.prompt;

    const systemContext = {
      dojoMode: true,
      userId: this.userId,
      drillName: drill.name,
      category: drill.category,
      baseContext: drill.systemContext,
      ladderPrompt,
    };

    return {
      prompt,
      drill,
      acknowledgement: this.randomAck(),
      systemContext,
    };
  }

  public async submitResponse(text: string): Promise<DojoDrillFollowUp> {
    if (!this.currentDrill) {
      throw new Error("No active dojo drill");
    }

    const drill = this.currentDrill;
    const context = {
      dojoDrill: drill.name,
      dojoCategory: drill.category,
      dojoContext: drill.systemContext,
    };

    if (drill.category === "pitch_training") {
      const ladderResult = await this.ladder.submitResponse(text);
      await this.store.logDojoEvent({
        userId: this.userId,
        drillName: drill.name,
        category: drill.category,
        userResponse: text,
        prompt: drill.prompt,
        followUp: ladderResult.followUp,
        metadata: context,
      });

      return {
        acknowledgement: ladderResult.acknowledgement,
        followUp: ladderResult.followUp,
        newTerm: ladderResult.newTerm,
        drill,
      };
    }

    if (drill.earExerciseType) {
      this.earTrainingEngine.setManualExercise(drill.earExerciseType);
    }

    const earResult = await this.earTrainingEngine.runExerciseCycle(text, context);

    const followUp =
      earResult.followUp ??
      (await this.buildReflectiveFollowUp(text, drill.prompt, drill.category));

    await this.store.logDojoEvent({
      userId: this.userId,
      drillName: drill.name,
      category: drill.category,
      userResponse: text,
      prompt: drill.prompt,
      followUp,
      metadata: context,
    });

    return {
      acknowledgement: earResult.acknowledgement ?? this.randomAck(),
      followUp,
      newTerm: earResult.newTerm,
      drill,
    };
  }

  public async requestNextStep(): Promise<string> {
    const suggestion = await this.deepSeek.analyzeListeningNote({
      userId: this.userId,
      text: "Need a tiny next-step coaching line for dojo mode.",
      context: {
        mode: "dojo",
        tags: this.currentDrill ? [this.currentDrill.category, this.currentDrill.name] : ["dojo"],
      },
    });

    if (suggestion.followUpQuestion) {
      return suggestion.followUpQuestion;
    }

    const hints = [
      "try slowing that down",
      "try aiming higher",
      "try adding softness",
      "try shifting timing",
      "let it breathe, then try again",
      "loop it once more with less force",
    ];

    return hints[Math.floor(Math.random() * hints.length)] ?? "take another calm pass";
  }

  private randomAck(): string {
    return ACKS[Math.floor(Math.random() * ACKS.length)] ?? "ok";
  }

  private async buildReflectiveFollowUp(
    userText: string,
    prompt: string,
    category: string
  ): Promise<string> {
    const analysis = await this.deepSeek.analyzeListeningNote({
      userId: this.userId,
      text: userText,
      context: { mode: "dojo", prompt, tags: [category] },
    });

    if (analysis.followUpQuestion) {
      return analysis.followUpQuestion;
    }

    return analysis.summary
      ? `${analysis.summary} What would you tweak next?`
      : "Log how that felt and try another pass.";
  }
}
