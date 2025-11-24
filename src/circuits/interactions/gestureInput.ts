export interface GesturePoint {
  x: number;
  y: number;
  timestamp: number;
}

export class GestureInput {
  private points: GesturePoint[] = [];
  private active = false;

  start(): void {
    this.points = [];
    this.active = true;
  }

  addPoint(x: number, y: number, timestamp: number): void {
    if (!this.active) {
      this.start();
    }

    this.points.push({ x, y, timestamp });
  }

  end(): { points: GesturePoint[] } {
    const recorded = [...this.points];
    this.active = false;
    this.points = [];
    return { points: recorded };
  }
}
