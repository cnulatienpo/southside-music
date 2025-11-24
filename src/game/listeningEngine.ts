import { nanoid } from "nanoid";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import type { ListeningAnalysisResult } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import { MediaSync } from "../lib/mediaSync";
import type { MediaStateSnapshot } from "../lib/mediaSync";

export type ListeningMode = "freestyle" | "focus";

export interface ListeningEntry {
  id: string;
  userId: string;
  mode: ListeningMode;
  clipDescription?: string;
  userText: string;
  createdAt: string;
}

export interface FocusPrompt {
  id: string;
  label: string;
  question: string;
}

export interface ListeningEngineOptions {
  userId: string;
  userDataStore: UserDataStore;
  deepSeek: DeepSeekEngine;
  mediaSync: MediaSync;
}

/**
 * ListeningEngine orchestrates freestyle and focus listening modes, mirroring the
 * player's language, logging activity, and delegating reflective prompts to the
 * DeepSeek engine without ever grading responses.
 */
export class ListeningEngine {
  private userId: string;

  private userDataStore: UserDataStore;

  private deepSeek: DeepSeekEngine;

  private mediaSync: MediaSync;

  private mode: ListeningMode;

  private currentFocusPrompt: FocusPrompt | null;

  private focusPromptPool: FocusPrompt[];

  constructor(options: ListeningEngineOptions) {
    this.userId = options.userId;
    this.userDataStore = options.userDataStore;
    this.deepSeek = options.deepSeek;
    this.mediaSync = options.mediaSync;
    this.mode = "freestyle";
    this.currentFocusPrompt = null;

    this.focusPromptPool = [
      { id: "intro", label: "Intro", question: "What did the opening feel like?" },
      { id: "chorus", label: "Chorus", question: "Did anything change before the chorus hit?" },
      { id: "bridge", label: "Bridge", question: "Did the mood shift in the middle?" },
      { id: "dynamics", label: "Dynamics", question: "Did anything suddenly get louder or softer?" },
      { id: "bass", label: "Bassline", question: "What is the bass doing under everything else?" },
      { id: "texture", label: "Texture", question: "Does the sound feel thick or thin?" },
      { id: "vocals", label: "Vocals", question: "Did the voice crack, bend, whisper, or growl?" },
      { id: "drums", label: "Drums", question: "What pattern did you feel in the drums?" },
      { id: "rhythm", label: "Rhythm", question: "Did you feel anything repeating or looping?" },
      { id: "contrast", label: "Contrast", question: "Did anything jump out unexpectedly?" },
    ];
  }

  public setMode(mode: ListeningMode): void {
    this.mode = mode;

    if (mode === "focus") {
      const randomIndex = Math.floor(Math.random() * this.focusPromptPool.length);
      this.currentFocusPrompt = this.focusPromptPool[randomIndex] ?? null;
    } else {
      this.currentFocusPrompt = null;
    }
  }

  public getCurrentPrompt(): FocusPrompt | null {
    if (this.mode === "freestyle") {
      return null;
    }

    return this.currentFocusPrompt;
  }

  public async recordUserListening(text: string): Promise<ListeningAnalysisResult> {
    try {
      const snapshot = await this.mediaSync.getStateSnapshot();
      const clipDescription = this.describeClip(snapshot);
      const entry: ListeningEntry = {
        id: nanoid(),
        userId: this.userId,
        mode: this.mode,
        clipDescription,
        userText: text,
        createdAt: new Date().toISOString(),
      };

      await this.userDataStore.logEarTraining({
        userId: entry.userId,
        exerciseType: "listening_note",
        userResponse: entry.userText,
        systemContext: {
          mode: entry.mode,
          clipDescription,
          mediaState: snapshot,
        },
      });

      const analysis = await this.deepSeek.analyzeListeningNote({
        userId: this.userId,
        text,
        context: {
          mode: this.mode,
          clipDescription,
        },
      });

      return analysis;
    } catch (error) {
      console.error("Failed to record user listening", error);
      return {
        tags: [],
        summary: text,
        followUpQuestion: null,
      };
    }
  }

  public async askFollowUp(): Promise<string | null> {
    if (this.mode === "focus") {
      return this.currentFocusPrompt?.question ?? null;
    }

    try {
      const prompt = await this.deepSeek.generateTestFreeTestPrompt({
        userId: this.userId,
        roughLevel: "beginner",
        focusArea: "listening",
      });

      return prompt.promptText;
    } catch (error) {
      console.error("Failed to generate follow-up question", error);
      return "What else are you hearing?";
    }
  }

  public acknowledgeUserResponse(): string {
    const acknowledgments = [
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

    const randomIndex = Math.floor(Math.random() * acknowledgments.length);
    return acknowledgments[randomIndex] ?? "ok";
  }

  public async handleComplaint(userMessage: string): Promise<string> {
    try {
      return await this.deepSeek.generateNoGradingResponse({ userId: this.userId, userMessage });
    } catch (error) {
      console.error("Failed to handle complaint", error);
      return "Not for nothin’, but this game ain’t like that. Just play and see what you notice.";
    }
  }

  public getStateSnapshot(): Promise<MediaStateSnapshot> {
    return this.mediaSync.getStateSnapshot();
  }

  public destroy(): void {
    this.currentFocusPrompt = null;
    this.focusPromptPool = [];
    this.mode = "freestyle";
    this.userId = "";
    this.userDataStore = null as unknown as UserDataStore;
    this.deepSeek = null as unknown as DeepSeekEngine;
    this.mediaSync = null as unknown as MediaSync;
  }

  private describeClip(snapshot: MediaStateSnapshot): string | undefined {
    if (!snapshot.sourceType) {
      return undefined;
    }

    const timeSeconds = Math.max(0, Math.floor(snapshot.currentTime ?? 0));
    const timePart = `${timeSeconds}s`;

    if (snapshot.sourceType === "youtube") {
      return `YouTube clip at ${timePart}`;
    }

    if (snapshot.sourceType === "html5") {
      return `HTML5 media at ${timePart}`;
    }

    return undefined;
  }
}

/*
Example usage:

import { ListeningEngine } from "./listeningEngine";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import { MediaSync } from "../lib/mediaSync";

const engine = new ListeningEngine({
  userId: "user-123",
  userDataStore: new UserDataStore(),
  deepSeek: new DeepSeekEngine(),
  mediaSync: new MediaSync(),
});
engine.setMode("freestyle");
engine.recordUserListening("I like the bass going dum dum dumm");
engine.acknowledgeUserResponse();
*/
