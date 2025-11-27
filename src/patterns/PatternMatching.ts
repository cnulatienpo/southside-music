import { PachecoEvent } from "../events/EventTypes";

export const matchFingerprint = (events: PachecoEvent[], fingerprint: string): PachecoEvent[] =>
  events.filter((event) => event.patternFingerprint === fingerprint);
