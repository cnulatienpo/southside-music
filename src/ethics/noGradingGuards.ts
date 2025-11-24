import { NoGradingEngine } from "./noGradingEngine";

/**
 * Sanitizes incoming text according to the no-grading rules using the provided engine.
 * If the engine detects correctness-seeking language, the boundary phrase is returned.
 *
 * @param input - Raw user or system text.
 * @param engine - Shared {@link NoGradingEngine} instance.
 * @returns Safe text that can flow to downstream modules without grading concerns.
 */
export function enforceNoGradingRules(input: string, engine: NoGradingEngine): string {
  return engine.enforceNoGrading(input);
}

/**
 * Determines whether a specific piece of text requires a no-grading response.
 *
 * @param input - Raw user text.
 * @param engine - Shared {@link NoGradingEngine} instance.
 * @returns True when the text seeks correctness and should be short-circuited.
 */
export function requiresNoGradingResponse(input: string, engine: NoGradingEngine): boolean {
  return engine.detectCorrectnessRequest(input);
}
