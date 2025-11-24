export class TapInput {
  private started = false;

  start(): void {
    this.started = true;
  }

  registerTap(): { timestamp: number } {
    if (!this.started) {
      this.start();
    }

    return { timestamp: Date.now() };
  }

  end(): void {
    this.started = false;
  }
}
