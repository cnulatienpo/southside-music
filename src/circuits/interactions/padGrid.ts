export class PadGrid {
  private rows: number;
  private cols: number;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
  }

  hitPad(row: number, col: number): { row: number; col: number; timestamp: number } {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error('Pad coordinates out of range');
    }
    return { row, col, timestamp: Date.now() };
  }
}
