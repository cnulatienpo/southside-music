/**
 * Central enforcement module for the Southside School of Music no-grading model.
 *
 * The {@link NoGradingEngine} acts as a safety valve between user input and the
 * rest of the ear-training experience. It strips grading language, blocks any
 * attempt to solicit correctness, and returns responses that keep the tone
 * exploratory and shame-free. All actions are logged in-memory so calling
 * services can inspect how and why text was altered.
 */
export class NoGradingEngine {
  /**
   * Represents a single decision made by the engine.
   */
  private readonly decisions: Array<{
    timestamp: Date;
    action: "sanitize" | "detected-correctness" | "pass-through";
    original: string;
    result: string;
    notes?: string;
  }> = [];

  /**
   * Words and concepts that should never pass through the system because
   * they imply grading, testing, or correctness.
   */
  public get forbiddenWords(): readonly string[] {
    return [
      "right",
      "wrong",
      "correct",
      "incorrect",
      "mistake",
      "grade",
      "fail",
      "test",
      "score",
    ];
  }

  /**
   * Replaces grading language with neutral, exploration-oriented alternatives.
   * The method respects word boundaries to avoid altering unrelated substrings
   * and preserves general casing by converting replacements to lowercase.
   *
   * @param text - Raw user or system text to sanitize.
   * @returns Sanitized text free of grading words.
   */
  public sanitizePrompt(text: string): string {
    if (!text) {
      return "";
    }

    const sanitized = this.forbiddenWords.reduce((current, word) => {
      const pattern = new RegExp(`\\b${word}\\b`, "gi");
      return current.replace(pattern, "explore");
    }, text);

    if (sanitized !== text) {
      this.recordDecision("sanitize", text, sanitized, "Removed grading language");
    } else {
      this.recordDecision("pass-through", text, sanitized, "No grading language detected");
    }

    return sanitized;
  }

  /**
   * Heuristically determines whether the user is requesting validation of
   * correctness. It checks for explicit grading words, direct correctness
   * questions, and subtle confirmations like "be honest" combined with a
   * result inquiry.
   *
   * @param text - The user input to evaluate.
   * @returns True when the engine should block with a no-grading response.
   */
  public detectCorrectnessRequest(text: string): boolean {
    if (!text) {
      return false;
    }

    const lowered = text.toLowerCase();
    const correctnessPatterns = [
      /did\s+i\s+get\s+it\s+(right|wrong|correct)/i,
      /is\s+this\s+(right|wrong|correct)/i,
      /(was|am|were|are)\s+i\s+(right|wrong|correct)/i,
      /(grade|score)\s+me/i,
      /tell\s+me\s+if\s+i\s+(nailed|missed)\s+it/i,
      /be\s+honest.*(right|wrong|correct)/i,
      /did\s+that\s+work\??/i,
    ];

    const containsForbidden = this.forbiddenWords.some((word) =>
      new RegExp(`\\b${word}\\b`, "i").test(lowered)
    );

    const matchesPattern = correctnessPatterns.some((pattern) => pattern.test(lowered));

    const detected = containsForbidden || matchesPattern;
    if (detected) {
      this.recordDecision(
        "detected-correctness",
        text,
        this.respondToCorrectnessRequest(),
        "Detected correctness-seeking language"
      );
    }

    return detected;
  }

  /**
   * Returns the standard boundary response for correctness requests.
   */
  public respondToCorrectnessRequest(): string {
    return "Not for nothin’, but this game ain’t like that. Just play.";
  }

  /**
   * Applies the no-grading rules in one pass. If the text seeks correctness,
   * the boundary phrase is returned. Otherwise the text is sanitized for
   * grading language.
   *
   * @param text - The raw text to enforce policies on.
   * @returns The safe text to use downstream.
   */
  public enforceNoGrading(text: string): string {
    if (this.detectCorrectnessRequest(text)) {
      return this.respondToCorrectnessRequest();
    }
    return this.sanitizePrompt(text);
  }

  /**
   * Returns an immutable view of the decision history for observability.
   */
  public get logs(): ReadonlyArray<{
    timestamp: Date;
    action: "sanitize" | "detected-correctness" | "pass-through";
    original: string;
    result: string;
    notes?: string;
  }> {
    return [...this.decisions];
  }

  private recordDecision(
    action: "sanitize" | "detected-correctness" | "pass-through",
    original: string,
    result: string,
    notes?: string
  ): void {
    this.decisions.push({
      timestamp: new Date(),
      action,
      original,
      result,
      notes,
    });
  }
}
