export class TapRecorder {
  private taps: number[] = [];

  recordTap(timestamp: number) {
    this.taps.push(timestamp);
  }

  getIntervals(): number[] {
    if (this.taps.length < 2) return [];
    const intervals: number[] = [];
    for (let i = 1; i < this.taps.length; i += 1) {
      intervals.push(this.taps[i] - this.taps[i - 1]);
    }
    return intervals;
  }

  reset() {
    this.taps = [];
  }
}
