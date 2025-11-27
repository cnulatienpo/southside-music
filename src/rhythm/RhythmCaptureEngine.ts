import { fingerprintRhythm, normalizeIntervals } from "./RhythmPatterns";
import { TapRecorder } from "./TapRecorder";

export class RhythmCaptureEngine {
  private recorder = new TapRecorder();

  recordTap(timestamp: number) {
    this.recorder.recordTap(timestamp);
  }

  completeRecording() {
    const intervals = this.recorder.getIntervals();
    const normalized = normalizeIntervals(intervals);
    const fingerprint = fingerprintRhythm(normalized);
    this.recorder.reset();
    return { intervals, normalized, fingerprint };
  }
}
