export const generateWaveform = (samples: Float32Array, step = 256): number[] => {
  const result: number[] = [];
  for (let i = 0; i < samples.length; i += step) {
    result.push(samples[i]);
  }
  return result;
};
