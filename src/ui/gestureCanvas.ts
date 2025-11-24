export interface GesturePoint {
  x: number;
  y: number;
  time: number;
}

export interface GestureCanvasOptions {
  onGestureComplete?: (points: GesturePoint[]) => void;
  onGestureProgress?: (points: GesturePoint[]) => void;
}

export class GestureCanvas {
  private points: GesturePoint[] = [];
  private readonly options: GestureCanvasOptions;

  constructor(options: GestureCanvasOptions = {}) {
    this.options = { ...options };
  }

  startCapture(): void {
    this.points = [];
  }

  recordPoint(x: number, y: number): void {
    const point: GesturePoint = { x, y, time: Date.now() };
    this.points.push(point);
    try {
      this.options.onGestureProgress?.([...this.points]);
    } catch (error) {
      console.error("GestureCanvas.recordPoint error", error);
    }
  }

  endCapture(): void {
    try {
      this.options.onGestureComplete?.([...this.points]);
    } catch (error) {
      console.error("GestureCanvas.endCapture error", error);
    }
  }

  clear(): void {
    this.points = [];
  }
}
