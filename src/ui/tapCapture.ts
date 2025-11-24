export interface TapCaptureOptions {
  onTap?: (time: number) => void;
  onSequenceComplete?: (taps: number[]) => void;
  timeoutMs?: number;
}

export class TapCapture {
  private taps: number[] = [];
  private readonly options: TapCaptureOptions;
  private timeoutHandle: any = null;

  constructor(options: TapCaptureOptions = {}) {
    this.options = { timeoutMs: 1500, ...options };
  }

  registerTap(): void {
    const now = Date.now();
    this.taps.push(now);
    try {
      this.options.onTap?.(now);
    } catch (error) {
      console.error("TapCapture.onTap callback error", error);
    }

    this.scheduleCompletion();
  }

  reset(): void {
    this.taps = [];
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }

  private scheduleCompletion(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    this.timeoutHandle = setTimeout(() => {
      try {
        this.options.onSequenceComplete?.([...this.taps]);
      } catch (error) {
        console.error("TapCapture.onSequenceComplete callback error", error);
      } finally {
        this.reset();
      }
    }, this.options.timeoutMs);
  }
}
