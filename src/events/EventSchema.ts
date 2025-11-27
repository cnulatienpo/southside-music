import { nanoid } from "nanoid";
import { PachecoEvent } from "./EventTypes";

export const createEmptyEvent = (timestamp: number, laneId: string): PachecoEvent => ({
  id: nanoid(),
  timestamp,
  laneId,
});

export const addProfilesToEvent = (
  event: PachecoEvent,
  profiles: Partial<Pick<PachecoEvent, "rhythmProfile" | "pitchProfile" | "textureProfile" | "symbolId" | "patternFingerprint">>,
): PachecoEvent => ({
  ...event,
  ...profiles,
});
