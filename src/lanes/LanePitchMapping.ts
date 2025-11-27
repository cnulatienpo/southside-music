export class LanePitchMapping {
  private mapping: Record<string, string> = {};

  setMapping(pitchRange: string, laneId: string) {
    this.mapping[pitchRange] = laneId;
  }

  getLaneForPitch(pitch: number): string {
    if (pitch > 72) return this.mapping.high || "lane-high";
    if (pitch > 48) return this.mapping.mid || "lane-mid";
    if (pitch > 24) return this.mapping.low || "lane-low";
    return this.mapping.bass || "lane-bass";
  }
}
