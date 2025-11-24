import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import { MediaSync } from "../lib/mediaSync";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

export interface TimestampedNote {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
  createdAt: string;
}

export interface SpeechToTextResult {
  text: string;
  confidence?: number | null;
}

export interface TranslateMeResult {
  original: string;
  explained: string;
}

export interface SocialEchoEntry {
  id: string;
  text: string;
  tags?: string[];
  timestamp: string;
}

export interface AddOnToolsOptions {
  userId: string;
  deepSeek: DeepSeekEngine;
  userDataStore: UserDataStore;
  mediaSync: MediaSync;
}

/**
 * AddOnToolsEngine provides speech-to-text capture, timestamped notes, replay utilities,
 * beginner-friendly theory translations, and anonymized social echoes from the community.
 */
export class AddOnToolsEngine {
  private userId: string;

  private deepSeek: DeepSeekEngine;

  private userDataStore: UserDataStore;

  private mediaSync: MediaSync;

  private recognition: SpeechRecognition | null;

  private isRecognizing: boolean;

  private replayBuffer: TimestampedNote[];

  private recognitionResult: SpeechToTextResult | null;

  constructor(options: AddOnToolsOptions) {
    this.userId = options.userId;
    this.deepSeek = options.deepSeek;
    this.userDataStore = options.userDataStore;
    this.mediaSync = options.mediaSync;
    this.replayBuffer = [];
    this.recognitionResult = null;
    this.isRecognizing = false;
    this.recognition = this.createSpeechRecognitionInstance();
  }

  public async startSpeechToText(): Promise<void> {
    try {
      const recognition = this.recognition ?? this.createSpeechRecognitionInstance();
      this.recognition = recognition;

      if (!recognition || this.isRecognizing) {
        return;
      }

      recognition.interimResults = true;
      recognition.continuous = true;
      this.recognitionResult = null;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const { finalText, confidence } = this.extractFinalSpeechResult(event);
        this.recognitionResult = finalText ? { text: finalText, confidence } : null;
      };

      recognition.onerror = (error: Event) => {
        console.error("Speech recognition error", error);
        this.isRecognizing = false;
      };

      recognition.onend = () => {
        this.isRecognizing = false;
      };

      this.isRecognizing = true;
      recognition.start();
    } catch (error) {
      console.error("Failed to start speech-to-text", error);
    }
  }

  public async stopSpeechToText(): Promise<SpeechToTextResult | null> {
    try {
      if (!this.recognition) {
        return this.recognitionResult;
      }

      if (!this.isRecognizing) {
        return this.recognitionResult;
      }

      return await new Promise<SpeechToTextResult | null>((resolve) => {
        const recognition = this.recognition as SpeechRecognition;

        const finalize = () => {
          const result = this.recognitionResult ?? null;
          this.cleanupRecognitionListeners(recognition);
          this.recognition = this.createSpeechRecognitionInstance();
          this.isRecognizing = false;
          resolve(result);
        };

        recognition.onerror = (event: Event) => {
          console.error("Speech recognition stop error", event);
          finalize();
        };

        recognition.onend = () => {
          finalize();
        };

        try {
          recognition.stop();
        } catch (error) {
          console.error("Failed to stop speech recognition", error);
          finalize();
        }
      });
    } catch (error) {
      console.error("Failed to stop speech-to-text", error);
      return this.recognitionResult ?? null;
    }
  }

  public async addTimestampedNote(text: string): Promise<TimestampedNote> {
    try {
      const snapshot = await this.mediaSync.getStateSnapshot();
      const timestamp = Math.max(0, snapshot.currentTime ?? 0);
      const createdAt = dayjs().toISOString();

      const note: TimestampedNote = {
        id: nanoid(),
        userId: this.userId,
        text,
        timestamp,
        createdAt,
      };

      await this.userDataStore.logEarTraining({
        userId: note.userId,
        exerciseType: "timestamped_note",
        userResponse: note.text,
        systemContext: {
          timestampSeconds: note.timestamp,
          mediaState: snapshot,
        },
        difficultyLevel: undefined,
      });

      this.replayBuffer.push(note);
      return note;
    } catch (error) {
      console.error("Failed to add timestamped note", error);
      return {
        id: nanoid(),
        userId: this.userId,
        text,
        timestamp: 0,
        createdAt: dayjs().toISOString(),
      };
    }
  }

  public async getTimestampedHistory(limit = 100): Promise<TimestampedNote[]> {
    try {
      const entries = await this.userDataStore.getEarTrainingHistory(this.userId, limit);
      return entries
        .filter((entry) => entry.exerciseType === "timestamped_note")
        .map((entry) => {
          const contextTimestamp = typeof entry.systemContext?.timestampSeconds === "number"
            ? entry.systemContext.timestampSeconds
            : 0;

          return {
            id: entry.id,
            userId: entry.userId,
            text: entry.userResponse,
            timestamp: contextTimestamp,
            createdAt: entry.createdAt,
          };
        });
    } catch (error) {
      console.error("Failed to fetch timestamped history", error);
      return [];
    }
  }

  public getReplayBuffer(): TimestampedNote[] {
    try {
      return this.replayBuffer;
    } catch (error) {
      console.error("Failed to return replay buffer", error);
      return [];
    }
  }

  public clearReplayBuffer(): void {
    try {
      this.replayBuffer = [];
    } catch (error) {
      console.error("Failed to clear replay buffer", error);
    }
  }

  public buildReplayScript(): string {
    try {
      const lines = this.replayBuffer.map((note) => {
        const formattedTime = this.formatTime(note.timestamp);
        return `${formattedTime}: ${note.text}`;
      });

      return lines.join("\n");
    } catch (error) {
      console.error("Failed to build replay script", error);
      return "";
    }
  }

  public async translateToBeginnerTheory(inputText: string): Promise<TranslateMeResult> {
    try {
      const analysis = await this.deepSeek.analyzeListeningNote({
        userId: this.userId,
        text: inputText,
        context: {
          tags: ["translate_me"],
        },
      });

      const vocab = analysis.vocabularyMappings ?? [];
      const vocabLines = vocab.map(
        (mapping) => `- ${mapping.phrase}: think "${mapping.internalConcept}"`
      );

      const explainedParts = [analysis.summary ?? inputText];
      if (vocabLines.length > 0) {
        explainedParts.push("Vocabulary to keep in mind:\n" + vocabLines.join("\n"));
      }

      return {
        original: inputText,
        explained: explainedParts.join("\n\n"),
      };
    } catch (error) {
      console.error("Failed to translate to beginner theory", error);
      return {
        original: inputText,
        explained: inputText,
      };
    }
  }

  public async getSocialEchoSample(limit = 20): Promise<SocialEchoEntry[]> {
    try {
      const dbHandle = (this.userDataStore as unknown as { db?: { prepare: Function } }).db;
      if (!dbHandle?.prepare) {
        return [];
      }

      const stmt = dbHandle.prepare(
        `SELECT id, user_id, user_response, system_context, created_at
         FROM ear_training_logs
         WHERE user_id != ?
         ORDER BY created_at DESC
         LIMIT ?`
      );

      const rows = stmt.all(this.userId, Math.max(limit * 3, limit)) as Array<{
        id: string;
        user_id: string;
        user_response: string;
        system_context: string | null;
        created_at: string;
      }>;

      const anonymized = rows
        .map((row) => {
          const parsedContext = row.system_context ? this.safeJsonParse(row.system_context) : undefined;
          const tags = Array.isArray(parsedContext?.tags)
            ? parsedContext.tags.map((tag: unknown) => String(tag))
            : undefined;

          return {
            id: row.id,
            text: row.user_response,
            tags,
            timestamp: row.created_at,
          } as SocialEchoEntry;
        })
        .filter((entry) => Boolean(entry.text));

      const shuffled = this.shuffleArray(anonymized);
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error("Failed to load social echo sample", error);
      return [];
    }
  }

  private createSpeechRecognitionInstance(): SpeechRecognition | null {
    if (typeof window === "undefined") {
      return null;
    }

    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      return null;
    }

    try {
      return new SpeechRecognitionCtor();
    } catch (error) {
      console.error("Failed to initialize speech recognition", error);
      return null;
    }
  }

  private extractFinalSpeechResult(event: SpeechRecognitionEvent): {
    finalText: string;
    confidence: number | null;
  } {
    let finalText = "";
    let confidenceTotal = 0;
    let confidenceCount = 0;

    for (let i = 0; i < event.results.length; i += 1) {
      const result = event.results[i];
      const transcript = result[0]?.transcript ?? "";
      if (result.isFinal) {
        finalText += `${transcript} `;
        if (typeof result[0]?.confidence === "number") {
          confidenceTotal += result[0].confidence;
          confidenceCount += 1;
        }
      } else {
        finalText += `${transcript} `;
      }
    }

    const confidence = confidenceCount > 0 ? confidenceTotal / confidenceCount : null;
    return {
      finalText: finalText.trim(),
      confidence,
    };
  }

  private formatTime(seconds: number): string {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safeSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (safeSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  private shuffleArray<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  private safeJsonParse(raw: string): any {
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("Failed to parse JSON context", error);
      return undefined;
    }
  }

  private cleanupRecognitionListeners(recognition: SpeechRecognition): void {
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
  }
}

/*
Example usage:

import { AddOnToolsEngine } from "./addOnTools";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import { MediaSync } from "../lib/mediaSync";

const tools = new AddOnToolsEngine({ userId, deepSeek, userDataStore, mediaSync });
await tools.addTimestampedNote("bass goes dum dum dumm");
const theory = await tools.translateToBeginnerTheory("bass goes dum dum dumm");
console.log(theory.explained);
*/
