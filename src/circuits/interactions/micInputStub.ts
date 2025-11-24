export class MicInputStub {
  private startTime: number | null = null;

  start(): void {
    this.startTime = Date.now();
  }

  stop(): { duration: number; placeholderShape: any } {
    const endTime = Date.now();
    const duration = this.startTime ? endTime - this.startTime : 0;
    const placeholderShape = {
      type: 'waveform-placeholder',
      points: [0, 0.5, 1, 0.5, 0],
    };
    this.startTime = null;
    return { duration, placeholderShape };
  }
}
