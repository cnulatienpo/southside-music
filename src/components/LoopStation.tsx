import React, { useEffect, useMemo, useRef, useState } from "react";

const STEPS = 8;
const DEFAULT_PATTERNS: Record<string, number[]> = {
  Kick: [1, 0, 0, 0, 1, 0, 0, 0],
  Snare: [0, 0, 1, 0, 0, 0, 1, 0],
  Hat: [0, 1, 0, 1, 0, 1, 0, 1]
};

const createAudioContext = (): AudioContext => {
  if ((window as any).__SOUTHSIDE_AUDIO__) {
    return (window as any).__SOUTHSIDE_AUDIO__;
  }
  const context = new AudioContext();
  (window as any).__SOUTHSIDE_AUDIO__ = context;
  return context;
};

const triggerDrum = (context: AudioContext, type: string) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "triangle";
  const now = context.currentTime;
  switch (type) {
    case "Kick":
      oscillator.frequency.setValueAtTime(120, now);
      oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.2);
      break;
    case "Snare":
      oscillator.frequency.setValueAtTime(220, now);
      break;
    default:
      oscillator.frequency.setValueAtTime(440, now);
  }
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(now + 0.3);
};

const LoopStation: React.FC = () => {
  const [patterns, setPatterns] = useState(DEFAULT_PATTERNS);
  const [isPlaying, setIsPlaying] = useState(false);
  const stepRef = useRef(0);
  const contextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const activeStep = stepRef.current % STEPS;

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      return;
    }

    if (!contextRef.current) {
      contextRef.current = createAudioContext();
    }

    intervalRef.current = window.setInterval(() => {
      stepRef.current = (stepRef.current + 1) % STEPS;
      const context = contextRef.current;
      if (!context) return;
      Object.entries(patterns).forEach(([instrument, pattern]) => {
        if (pattern[stepRef.current]) {
          triggerDrum(context, instrument);
        }
      });
    }, 350);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, patterns]);

  const toggleStep = (instrument: string, index: number) => {
    setPatterns((prev) => ({
      ...prev,
      [instrument]: prev[instrument].map((value, idx) =>
        idx === index ? (value ? 0 : 1) : value
      )
    }));
  };

  const rows = useMemo(() => Object.keys(patterns), [patterns]);

  return (
    <section className="loop-station">
      <header className="loop-station__header">
        <h2>Rhythm Loop Station</h2>
        <p>
          Toggle steps to build grooves inspired by funk, salsa, goth, and
          industrial beats. Press play to feel the loop.
        </p>
        <button onClick={() => setIsPlaying((prev) => !prev)}>
          {isPlaying ? "Stop" : "Play"}
        </button>
      </header>
      <div className="loop-station__grid">
        {rows.map((instrument) => (
          <div className="loop-station__row" key={instrument}>
            <span className="loop-station__label">{instrument}</span>
            {patterns[instrument].map((value, index) => (
              <button
                key={`${instrument}-${index}`}
                className={`loop-station__step ${
                  value ? "loop-station__step--active" : ""
                } ${index === activeStep ? "loop-station__step--current" : ""}`}
                onClick={() => toggleStep(instrument, index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default LoopStation;
