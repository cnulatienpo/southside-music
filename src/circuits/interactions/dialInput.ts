interface DialOptions {
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

  private clamp(n: number): number {
    return Math.min(this.max, Math.max(this.min, n));
  }
}
