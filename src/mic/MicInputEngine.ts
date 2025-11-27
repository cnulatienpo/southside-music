import { EventCaptureEngine } from "../events/EventCaptureEngine";
import { EventTimestamp } from "../events/EventTimestamp";
import { CommandRecognition, MicCommand } from "./CommandRecognition";
import { VADDetector } from "./VADDetector";

export class MicInputEngine {
  private detector = new VADDetector();

  private recognizer = new CommandRecognition();

  constructor(private capture: EventCaptureEngine) {}

  analyze(samples: Float32Array) {
    if (this.detector.detect(samples)) {
      const timestamp: EventTimestamp = { origin: "mic", value: performance.now() };
      this.capture.captureFromMic(timestamp);
    }
  }

  applyTranscript(transcript: string) {
    const command: MicCommand | null = this.recognizer.parse(transcript.toLowerCase());
    if (command === "mark") {
      this.capture.captureFromUi({ origin: "ui", value: performance.now() }, "lane-voice");
    }
  }
}
