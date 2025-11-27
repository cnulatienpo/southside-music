export interface EventTimestamp {
  origin: "spacebar" | "mic" | "ui" | "propagation";
  value: number;
}

export const nowTimestamp = (origin: EventTimestamp["origin"] = "ui"): EventTimestamp => ({
  origin,
  value: performance.now(),
});
