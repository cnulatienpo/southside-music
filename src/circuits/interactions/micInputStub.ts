interface VolumeReading {
  timestamp: number;
  level: number;
}

export class MicInputStub {
  private startedAt: number | null = null;
  private volumeReadings: VolumeReading[] = [];

  start(): void {
    this.startedAt = Date.now();
    this.volumeReadings = [];
  }

  recordLevel(level: number): void {
    if (this.startedAt === null) {
      this.start();
    }

    this.volumeReadings.push({ timestamp: Date.now(), level });
  }

  stop(): { duration: number; placeholderShape: { readings: VolumeReading[]; summary: string } } {
    const endTime = Date.now();
    const startTime = this.startedAt ?? endTime;
    const duration = endTime - startTime;

    const placeholderShape = {
      readings: [...this.volumeReadings],
      summary: "placeholder-envelope",
    };

    this.startedAt = null;
    this.volumeReadings = [];

    return { duration, placeholderShape };
  }
}
