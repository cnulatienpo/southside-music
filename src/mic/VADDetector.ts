export class VADDetector {
  detect(samples: Float32Array): boolean {
    return samples.some((value) => Math.abs(value) > 0.2);
  }
}
