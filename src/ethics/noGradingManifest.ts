import { ACKS, SAFE_REFLECTIONS, SYSTEM_DISCLAIMER } from "./noGradingPrompts";
import { NoGradingEngine } from "./noGradingEngine";

/**
 * Structured manifest describing the Southside no-grading ethics model.
 * This object is designed to be serializable and referenced by any module
 * (including DeepSeek) that needs a machine-readable representation of the
 * philosophy and rules.
 */
export const NO_GRADING_MANIFEST = {
  philosophy:
    "Sound before score. We guide by feel and pattern, never by points. The ear learns in whispers, so the system stays humble and observational, not judgmental.",
  rules: [
    "No correctness or grading.",
    "Never say wrong.",
    "Never say right.",
    "Never confirm or deny accuracy.",
    "Only observe patterns.",
    "Theory is introduced only after mastery is demonstrated silently.",
    "Acknowledge accomplishments casually, without gamification.",
    "No confetti, no badges, no scores.",
    "Encourage exploration, not evaluation.",
    "Treat the user like a musician, never a student.",
  ],
  forbiddenLanguage: new NoGradingEngine().forbiddenWords,
  allowedAcknowledgements: ACKS,
  safeReflections: SAFE_REFLECTIONS,
  systemDisclaimer: SYSTEM_DISCLAIMER,
  silentMasteryDetection:
    "Mastery is inferred when the player repeats patterns accurately without prompting, reduces latency, and self-adjusts tone or rhythm—without ever asking if they are correct.",
  patternBasedAdvancement:
    "Progression unlocks when consistent recognition patterns emerge (e.g., interval families, contour detection, harmonic color), not when a score threshold is crossed.",
  behaviorModel: {
    observe:
      "Track how the player moves—timing, hesitation, breath in the phrasing—without attaching labels like success or failure.",
    adapt:
      "Surface next exercises that lean into what the player is already reaching for, softening anything that triggers self-judgment.",
    reveal:
      "Offer theory only after repeated, unprompted demonstration—naming a sound after the player is already fluent in it.",
    neverCorrect:
      "Redirect correctness questions to the boundary phrase and invite deeper noticing instead of evaluation.",
    noPressure:
      "Celebrate presence and curiosity with casual acknowledgements, never leaderboards or grades.",
  },
} as const;

export type NoGradingManifest = typeof NO_GRADING_MANIFEST;
