export class PadGrid {
  private rows: number;
  private cols: number;

  constructor(rows: number, cols: number) {
    if (rows <= 0 || cols <= 0) {
      throw new Error("PadGrid dimensions must be positive");
    }

    this.rows = rows;
    this.cols = cols;
  }

  hitPad(row: number, col: number): { row: number; col: number; timestamp: number } {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error("PadGrid position out of range");
    }

    return { row, col, timestamp: Date.now() };
  }
}
