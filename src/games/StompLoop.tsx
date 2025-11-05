import { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";

import CharacterBox from "../characters/CharacterBox";

const CONSISTENCY_THRESHOLD = 150;

const formatMessage = (averageSpacing: number | null, isConsistent: boolean) => {
  if (averageSpacing === null) {
    return "Start stomping";
  }

  if (averageSpacing < 300) {
    return "Too fast";
  }

  if (averageSpacing > 1500) {
    return "Too slow";
  }

  if (isConsistent) {
    return "Now that’s a loop";
  }

  return "Keep stomping";
};

type CharacterDialogue = {
  name: string;
  mood: string;
  line: string;
  delay?: number;
};

const StompLoop = () => {
  const [stomps, setStomps] = useState<number[]>([]);
  const [characterDialogue, setCharacterDialogue] = useState<CharacterDialogue | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const toneStartedRef = useRef(false);

  useEffect(() => {
    const synth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.15 },
    }).toDestination();

    synth.volume.value = -6;
    synthRef.current = synth;

    return () => {
      synth.dispose();
    };
  }, []);

  const intervals = useMemo(() => {
    if (stomps.length < 2) {
      return [];
    }

    const diffs: number[] = [];
    for (let i = 1; i < stomps.length; i += 1) {
      diffs.push(stomps[i] - stomps[i - 1]);
    }
    return diffs;
  }, [stomps]);

  const averageSpacing = useMemo(() => {
    if (intervals.length === 0) {
      return null;
    }

    const total = intervals.reduce((sum, value) => sum + value, 0);
    return total / intervals.length;
  }, [intervals]);

  const isConsistent = useMemo(() => {
    if (stomps.length < 3 || intervals.length < 2) {
      return false;
    }

    const minInterval = Math.min(...intervals);
    const maxInterval = Math.max(...intervals);
    return maxInterval - minInterval <= CONSISTENCY_THRESHOLD;
  }, [intervals, stomps.length]);

  const feedbackMessage = useMemo(
    () => formatMessage(averageSpacing, isConsistent),
    [averageSpacing, isConsistent],
  );

  useEffect(() => {
    if (stomps.length === 0) {
      setCharacterDialogue(null);
      return;
    }

    const voiceMap: Record<string, CharacterDialogue | undefined> = {
      "Too fast": {
        name: "Buzz",
        mood: "roast",
        line: "Whoa there, speed demon.",
        delay: 80,
      },
      "Too slow": {
        name: "Mouth",
        mood: "coach",
        line: "That’s not doom. That’s a nap.",
        delay: 120,
      },
      "Now that’s a loop": {
        name: "Thump",
        mood: "hype",
        line: "Now that’s a loop!",
        delay: 150,
      },
    };

    const dialogue = voiceMap[feedbackMessage];
    setCharacterDialogue(dialogue ?? null);
  }, [feedbackMessage, stomps.length]);

  const handleStomp = async () => {
    if (!toneStartedRef.current) {
      await Tone.start();
      toneStartedRef.current = true;
    }

    const now = Tone.now();
    const synth = synthRef.current;
    if (synth) {
      synth.triggerAttackRelease("C2", 0.1, now);
    }

    setStomps((prev) => [...prev, Date.now()]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between items-center py-12 px-4">
      <div className="max-w-3xl text-center font-serif text-lg md:text-xl space-y-4">
        <p>
          “Welcome to school. Not the kind with chalkboards and sit-still energy.
          <br />
          This is the <em>feel-it-in-your-ribs</em> kind.
          <br />
          You learn to hear with your neck. With your gut. With your spine.
          <br />
          That’s how music works down here. On the Southside.”
        </p>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <button
          type="button"
          onClick={handleStomp}
          className="px-16 py-10 text-4xl font-bold rounded-full bg-white text-zinc-900 transition-transform duration-200 hover:scale-105 hover:bg-zinc-200"
        >
          STOMP
        </button>

        <div className="flex flex-col items-center justify-center text-lg font-mono space-y-3">
          <span>{feedbackMessage}</span>
          {characterDialogue && (
            <CharacterBox
              name={characterDialogue.name}
              mood={characterDialogue.mood}
              line={characterDialogue.line}
              delay={characterDialogue.delay}
            />
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-xl">
          {stomps.map((stomp, index) => (
            <span
              key={`${stomp}-${index}`}
              className="w-4 h-4 rounded-full bg-white animate-ping"
              style={{ animationDuration: "1s" }}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        className="px-6 py-3 border border-white/40 rounded-full text-sm uppercase tracking-widest hover:bg-white/10 transition"
      >
        Advance to Next Game
      </button>
    </div>
  );
};

export default StompLoop;
