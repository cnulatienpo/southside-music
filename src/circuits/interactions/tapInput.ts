export class TapInput {
  private active = false;

  start(): void {
    this.active = true;
  }

  registerTap(): { timestamp: number } {
    const timestamp = Date.now();
    return { timestamp };
  }

  end(): void {
    this.active = false;
  }
}
