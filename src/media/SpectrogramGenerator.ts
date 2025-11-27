export const generateSpectrogram = (samples: Float32Array, binSize = 512): number[][] => {
  const bins: number[][] = [];
  for (let i = 0; i < samples.length; i += binSize) {
    bins.push([Math.abs(samples[i] || 0)]);
  }
  return bins;
};
