import axios, { AxiosInstance } from "axios";

type VocabularyMapping = {
  phrase: string;
  internalConcept: string;
};

export type ListeningAnalysisResult = {
  tags: string[];
  summary: string;
  followUpQuestion?: string | null;
  suggestedConcepts?: string[];
  vocabularyMappings?: VocabularyMapping[];
};

export type EarTrainingAnalysisResult = {
  exerciseType: string;
  difficultyHint?: string | null;
  skillSignals?: string[];
  reflectivePrompt?: string | null;
};

export type TestFreeTestPrompt = {
  promptText: string;
  internalTags?: string[];
};

const SYSTEM_PROMPT = `You are the DeepSeek-style engine for the Southside School of Music game. Follow these cultural rules strictly:
- NEVER grade the user or say anything is correct or incorrect.
- NEVER reveal answers.
- Never encourage obsession with getting things right.
- Use the player's language, metaphors, and vibe.
- Act casual and kind, but firm about "no testing".
- Respect the game's culture: no shame, no perfectionism.
- Occasionally drop phrases like:
  - "There are tons of games that will test you. This isn’t one of them."
  - "Not for nothin’, but this game ain’t like that."

Return ONLY JSON that matches the requested schema for the task. Do not include any other text.`;

export class DeepSeekEngine {
  private client: AxiosInstance;
  private model: string;

  constructor(options?: { apiKey?: string; baseUrl?: string; model?: string }) {
    const apiKey = options?.apiKey ?? process.env.DEEPSEEK_API_KEY;
    const baseUrl = options?.baseUrl ?? process.env.DEEPSEEK_API_URL ?? "https://api.deepseek.fake/v1";

    this.model = options?.model ?? "deepseek-music-tutor-1";
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        "Content-Type": "application/json",
      },
    });
  }

  async analyzeListeningNote(input: {
    userId: string;
    text: string;
    context?: {
      clipDescription?: string;
      mode?: string;
      tags?: string[];
    };
  }): Promise<ListeningAnalysisResult> {
    const payload = {
      model: this.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify({ task: "analyzeListeningNote", input }) },
      ],
    };

    try {
      const response = await this.client.post("/chat/completions", payload);
      const content = response?.data?.choices?.[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content) as ListeningAnalysisResult;
        } catch (parseError) {
          console.error("Failed to parse listening analysis response", parseError);
        }
      }
    } catch (error) {
      console.error("Listening analysis request failed", error);
    }

    return {
      tags: [],
      summary: input.text,
      followUpQuestion: null,
    };
  }

  async analyzeEarTrainingEvent(input: {
    userId: string;
    exerciseType: string;
    responseText: string;
    systemContext?: Record<string, any>;
  }): Promise<EarTrainingAnalysisResult> {
    const payload = {
      model: this.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify({ task: "analyzeEarTrainingEvent", input }) },
      ],
    };

    try {
      const response = await this.client.post("/chat/completions", payload);
      const content = response?.data?.choices?.[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content) as EarTrainingAnalysisResult;
        } catch (parseError) {
          console.error("Failed to parse ear training response", parseError);
        }
      }
    } catch (error) {
      console.error("Ear training request failed", error);
    }

    return {
      exerciseType: input.exerciseType,
      difficultyHint: null,
      skillSignals: [],
      reflectivePrompt: null,
    };
  }

  async generateTestFreeTestPrompt(input: {
    userId: string;
    roughLevel?: "beginner" | "intermediate" | "advanced";
    focusArea?: string | null;
  }): Promise<TestFreeTestPrompt> {
    const payload = {
      model: this.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify({ task: "generateTestFreeTestPrompt", input }) },
      ],
    };

    try {
      const response = await this.client.post("/chat/completions", payload);
      const content = response?.data?.choices?.[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content) as TestFreeTestPrompt;
        } catch (parseError) {
          console.error("Failed to parse test-free test prompt", parseError);
        }
      }
    } catch (error) {
      console.error("Test-free test prompt request failed", error);
    }

    return {
      promptText: "What did you notice?",
      internalTags: [],
    };
  }

  async generateNoGradingResponse(input: { userId: string; userMessage: string }): Promise<string> {
    const payload = {
      model: this.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify({ task: "generateNoGradingResponse", input }) },
      ],
    };

    try {
      const response = await this.client.post("/chat/completions", payload);
      const content = response?.data?.choices?.[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content) as string;
        } catch (parseError) {
          console.error("Failed to parse no-grading response", parseError);
        }
      }
    } catch (error) {
      console.error("No-grading response request failed", error);
    }

    return "Not for nothin’, but this game ain’t like that. Just play and see what you notice.";
  }
}

/*
Example usage:

const engine = new DeepSeekEngine();
const listeningResult = await engine.analyzeListeningNote({
  userId: "user-123",
  text: "I like the way the bass goes dum dum dumm and then stops before the chorus.",
});
const testPrompt = await engine.generateTestFreeTestPrompt({ userId: "user-123", roughLevel: "beginner" });
*/
