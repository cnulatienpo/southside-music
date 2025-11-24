import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

export interface ConceptClassification {
  concepts: string[];
  confidence?: number | null;
  emotionalTone?: string | null;
  metaphorStyle?: string | null;
  rawTags?: string[];
}

export interface VocabularyMapping {
  phrase: string;
  concept: string;
  createdAt: string;
}

export interface LearningRecord {
  id: string;
  userId: string;
  createdAt: string;
  rawText: string;
  clipContext?: string | null;
  classification: ConceptClassification;
  vocabularyMappings: VocabularyMapping[];
  suggestedTheory?: string[];
  suggestedExercises?: string[];
}

export interface LearningModelEngineOptions {
  userId: string;
  userDataStore: UserDataStore;
  deepSeek: DeepSeekEngine;
}

/**
 * LearningModelEngine translates user phrasing into internal music-theory concepts
 * while respecting the game's no-grading culture. It keeps an in-memory glossary
 * and writes a durable log of every interaction.
 */
export class LearningModelEngine {
  private userId: string;

  private userDataStore: UserDataStore;

  private deepSeek: DeepSeekEngine;

  private vocabularyMap: VocabularyMapping[];

  private learningHistory: LearningRecord[];

  constructor(options: LearningModelEngineOptions) {
    this.userId = options.userId;
    this.userDataStore = options.userDataStore;
    this.deepSeek = options.deepSeek;
    this.vocabularyMap = [];
    this.learningHistory = [];
  }

  public async analyzeUserSentence(input: {
    text: string;
    clipDescription?: string;
  }): Promise<LearningRecord> {
    const createdAt = dayjs().toISOString();
    const baseRecord: LearningRecord = {
      id: nanoid(),
      userId: this.userId,
      createdAt,
      rawText: input.text,
      clipContext: input.clipDescription ?? null,
      classification: {
        concepts: [],
        confidence: null,
        emotionalTone: null,
        metaphorStyle: null,
        rawTags: [],
      },
      vocabularyMappings: [],
      suggestedTheory: [],
      suggestedExercises: [],
    };

    try {
      const analysis = await this.deepSeek.analyzeListeningNote({
        userId: this.userId,
        text: input.text,
        context: {
          clipDescription: input.clipDescription,
        },
      });

      const concepts = Array.from(
        new Set([...(analysis.suggestedConcepts ?? []), ...(analysis.tags ?? [])])
      );

      const mappedVocabulary: VocabularyMapping[] = (analysis.vocabularyMappings ?? []).map((mapping) => ({
        phrase: mapping.phrase,
        concept: mapping.internalConcept,
        createdAt,
      }));

      baseRecord.classification = {
        concepts,
        confidence: null,
        emotionalTone: null,
        metaphorStyle: null,
        rawTags: analysis.tags ?? [],
      };

      baseRecord.vocabularyMappings = mappedVocabulary;
      baseRecord.suggestedTheory = (analysis.suggestedConcepts ?? []).slice(0, 3);
      baseRecord.suggestedExercises = this.deriveExerciseSuggestions(concepts);
    } catch (error) {
      console.error("Failed to analyze user sentence", error);
      baseRecord.classification = {
        concepts: [],
        confidence: null,
        emotionalTone: null,
        metaphorStyle: null,
        rawTags: [],
      };
      baseRecord.vocabularyMappings = [];
      baseRecord.suggestedTheory = [];
      baseRecord.suggestedExercises = [];
    }

    this.updateVocabularyMap(baseRecord.vocabularyMappings);
    this.learningHistory.unshift(baseRecord);

    try {
      await this.userDataStore.logLearningRecord({
        userId: this.userId,
        rawText: input.text,
        clipContext: input.clipDescription ?? null,
        classification: baseRecord.classification,
        vocabularyMappings: baseRecord.vocabularyMappings,
        suggestedTheory: baseRecord.suggestedTheory,
        suggestedExercises: baseRecord.suggestedExercises,
        createdAt,
      });
    } catch (logError) {
      console.error("Failed to log learning record", logError);
    }

    return baseRecord;
  }

  public buildPersonalGlossary(): Record<string, string> {
    const sorted = [...this.vocabularyMap].sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));
    const glossary: Record<string, string> = {};

    for (const mapping of sorted) {
      if (!glossary[mapping.phrase]) {
        glossary[mapping.phrase] = mapping.concept;
      }
    }

    return glossary;
  }

  public suggestNextTheory(): string[] {
    const frequencyMap = new Map<string, number>();

    for (const record of this.learningHistory) {
      for (const concept of record.classification.concepts) {
        const current = frequencyMap.get(concept) ?? 0;
        frequencyMap.set(concept, current + 1);
      }
    }

    for (const mapping of this.vocabularyMap) {
      const current = frequencyMap.get(mapping.concept) ?? 0;
      frequencyMap.set(mapping.concept, current + 1);
    }

    const sortedConcepts = [...frequencyMap.entries()].sort((a, b) => b[1] - a[1]);
    return sortedConcepts.slice(0, 3).map(([concept]) => concept);
  }

  public suggestNextExercises(): string[] {
    const conceptSuggestions = this.suggestNextTheory();
    const latestConcepts = this.learningHistory[0]?.classification.concepts ?? [];
    const combined = Array.from(new Set([...latestConcepts, ...conceptSuggestions]));

    if (combined.length === 0) {
      return ["Explore a new texture study", "Try layering rhythms with silence"];
    }

    return combined.map((concept) => `Lean into ${concept} with a quick sketch or loop`);
  }

  private updateVocabularyMap(mappings: VocabularyMapping[]): void {
    const existing = new Set(this.vocabularyMap.map((item) => `${item.phrase}::${item.concept}`));

    for (const mapping of mappings) {
      const key = `${mapping.phrase}::${mapping.concept}`;
      if (!existing.has(key)) {
        this.vocabularyMap.push(mapping);
        existing.add(key);
      }
    }
  }

  private deriveExerciseSuggestions(concepts: string[]): string[] {
    const prioritizedConcepts = concepts.length > 0 ? [...concepts] : [];
    for (const concept of this.suggestNextTheory()) {
      if (!prioritizedConcepts.includes(concept)) {
        prioritizedConcepts.push(concept);
      }
    }

    if (prioritizedConcepts.length === 0) {
      return ["Follow the groove and describe what shifts next"];
    }

    return prioritizedConcepts.map((concept) => `Play with ${concept} and jot the moves you notice`);
  }
}

/*
Example usage:

const engine = new LearningModelEngine({
  userId: profile.id,
  userDataStore: store,
  deepSeek
});

const rec = await engine.analyzeUserSentence({
  text: "I like when the bass goes dum dum dumm and then drops out."
});

console.log("Glossary:", engine.buildPersonalGlossary());
*/
