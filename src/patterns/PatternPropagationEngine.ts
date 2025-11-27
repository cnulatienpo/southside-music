import { nanoid } from "nanoid";
import { PachecoEvent } from "../events/EventTypes";
import { matchFingerprint } from "./PatternMatching";

export class PatternPropagationEngine {
  propagate(sourceEvents: PachecoEvent[], fingerprint: string): PachecoEvent[] {
    const matches = matchFingerprint(sourceEvents, fingerprint);
    return matches.map((event) => ({ ...event, id: nanoid() }));
  }
}
