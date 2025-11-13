const ensureContext = (): AudioContext => {
  if ((window as any).__SOUTHSIDE_PAD__) {
    return (window as any).__SOUTHSIDE_PAD__;
  }
  const context = new AudioContext();
  (window as any).__SOUTHSIDE_PAD__ = context;
  return context;
};

export const playTone = (frequency: number, duration = 0.6) => {
  const context = ensureContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + duration + 0.1);
};

export const NOTES = [
  { name: "C", frequency: 261.63 },
  { name: "D", frequency: 293.66 },
  { name: "E", frequency: 329.63 },
  { name: "F", frequency: 349.23 },
  { name: "G", frequency: 392.0 },
  { name: "A", frequency: 440.0 },
  { name: "B", frequency: 493.88 }
];
