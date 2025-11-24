export interface GesturePoint {
  x: number;
  y: number;
  timestamp: number;
}

export class GestureInput {
  private points: GesturePoint[] = [];
  private recording = false;

  start(): void {
    this.points = [];
    this.recording = true;
  }

  addPoint(x: number, y: number, timestamp: number): void {
    if (!this.recording) return;
    this.points.push({ x, y, timestamp });
  }

  end(): { points: GesturePoint[] } {
    this.recording = false;
    return { points: [...this.points] };
  }
}
