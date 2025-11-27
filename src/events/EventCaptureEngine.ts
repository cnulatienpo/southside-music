import { nanoid } from "nanoid";
import { createEmptyEvent } from "./EventSchema";
import { PachecoEvent } from "./EventTypes";
import { EventTimestamp } from "./EventTimestamp";

export type EventSink = (event: PachecoEvent) => void;

export class EventCaptureEngine {
  private sink: EventSink;

  constructor(sink: EventSink) {
    this.sink = sink;
  }

  captureFromSpacebar(timestamp: EventTimestamp) {
    const event = createEmptyEvent(timestamp.value, "lane-1");
    this.sink(event);
  }

  captureFromMic(timestamp: EventTimestamp, laneId = "lane-voice") {
    const event = createEmptyEvent(timestamp.value, laneId);
    this.sink(event);
  }

  captureFromUi(timestamp: EventTimestamp, laneId: string, payload: Partial<PachecoEvent> = {}) {
    const event = { ...createEmptyEvent(timestamp.value, laneId), ...payload };
    this.sink(event);
  }

  createPlaceholderEvent(laneId: string): PachecoEvent {
    return {
      id: nanoid(),
      timestamp: performance.now(),
      laneId,
    };
  }
}
