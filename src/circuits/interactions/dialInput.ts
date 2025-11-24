export interface DialOptions {
  min: number;
  max: number;
  initial: number;
}

export class DialInput {
  private min: number;
  private max: number;
  private value: number;

  constructor(options: DialOptions) {
    this.min = options.min;
    this.max = options.max;
    this.value = this.clamp(options.initial);
  }

  rotateTo(n: number): void {
    this.value = this.clamp(n);
  }

  getValue(): number {
    return this.value;
  }

  private clamp(value: number): number {
    if (value < this.min) return this.min;
    if (value > this.max) return this.max;
    return value;
  }
}
