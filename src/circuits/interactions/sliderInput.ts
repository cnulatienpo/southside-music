export interface SliderOptions {
  min: number;
  max: number;
  initial: number;
}

export class SliderInput {
  private min: number;
  private max: number;
  private value: number;

  constructor(options: SliderOptions) {
    this.min = options.min;
    this.max = options.max;
    this.value = this.clamp(options.initial);
  }

  setValue(n: number): void {
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
