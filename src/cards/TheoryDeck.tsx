import React, { useEffect, useMemo, useState } from "react";

import CharacterBox from "../characters/CharacterBox";
import { useProgressTracker } from "../world/ProgressTracker";
import {
  TheoryCard,
  theoryLevelTwoCards,
  THEORY_LEVEL_TWO_CARD_COUNT,
} from "./TheoryLevelTwo";

const theoryLevelOneCards: TheoryCard[] = [
  {
    id: "L1:pulse",
    level: 1,
    title: "Pulse",
    front: {
      lines: [
        "The heartbeat that never checks if you're listening.",
        "It's the escalator the melody rides no matter who gets on.",
        "Feel it in: your heart, the end credits of a movie, factory lights.",
      ],
      chela: "Chela: \"The part of music that doesn't care if you show up. It's already started.\"",
    },
    back: {
      lines: [
        "Hear it in: LCD Soundsystem, Kraftwerk, Blondie.",
        "In design: marquee lights blinking in perfect lockstep.",
        "In film: action scenes cut to every third beat to keep your breath captive.",
      ],
      tryIt: "Walk around your space and tap your hand to an imagined loop. Try not to stop.",
    },
  },
  {
    id: "L1:silence",
    level: 1,
    title: "Silence",
    front: {
      lines: [
        "The pause that sharpens the sound.",
        "It's the breath before a scream and the smirk before a punchline.",
        "In film: the cut before the gunshot. In art: the white around a brutalist poster.",
      ],
      chela: "Chela: \"Silence is where the ghosts live. Respect it.\"",
    },
    back: {
      lines: [
        "Hear it in: Portishead, Nine Inch Nails, Johnny Cash's \"Hurt\".",
        "In life: the air just before a rollercoaster drops.",
        "In photography: negative space that makes the subject glare louder.",
      ],
      tryIt: "Make a loop with three hits and one rest. Make the rest feel heavy.",
    },
  },
  {
    id: "L1:call-response",
    level: 1,
    title: "Call and Response",
    front: {
      lines: [
        "Like a bad date that turns into a duet.",
        "One voice shouts, another answers, repeats, or mocks.",
        "In life: stairwell echoes, protest chants, comedy timing.",
      ],
      chela: "Chela: \"Some songs flirt. Some songs fight.\"",
    },
    back: {
      lines: [
        "Hear it in: blues guitar lines, DMX ad-libs, Talking Heads verses.",
        "In design: bold headlines replied to by snarky subtext.",
        "In film: banter scenes that snap like paddles.",
      ],
      tryIt: "Record a sound. Then respond to it. Keep trading lines for thirty seconds.",
    },
  },
];

const THEORY_LEVEL_ONE_CARD_COUNT = theoryLevelOneCards.length;

type TheoryLevelState = {
  1: number;
  2: number;
};

const cardCounts: TheoryLevelState = {
  1: THEORY_LEVEL_ONE_CARD_COUNT,
  2: THEORY_LEVEL_TWO_CARD_COUNT,
};

const TheoryDeck: React.FC = () => {
  const { progress, markTheoryCard } = useProgressTracker();
  const [activeLevel, setActiveLevel] = useState<1 | 2>(1);
  const [indices, setIndices] = useState<TheoryLevelState>({ 1: 0, 2: 0 });
  const [isFlipped, setIsFlipped] = useState(false);

  const levelTwoUnlocked = useMemo(() => {
    return (
      progress.unlocks.theoryLevel2 ||
      progress.theory.level >= 2 ||
      progress.games.LevelZero?.completed === true
    );
  }, [progress]);

  const cardsForLevel = useMemo(
    () => (activeLevel === 1 ? theoryLevelOneCards : theoryLevelTwoCards),
    [activeLevel]
  );

  const currentIndex = indices[activeLevel];

  const currentCard = useMemo(
    () => cardsForLevel[currentIndex] ?? cardsForLevel[0],
    [cardsForLevel, currentIndex]
  );

  useEffect(() => {
    setIsFlipped(false);
  }, [activeLevel, currentIndex]);

  useEffect(() => {
    if (isFlipped && currentCard) {
      markTheoryCard(currentCard.id, currentCard.level, cardCounts[currentCard.level]);
    }
  }, [isFlipped, currentCard, markTheoryCard]);

  const handlePrev = () => {
    setIndices((previous) => {
      const cards = activeLevel === 1 ? theoryLevelOneCards : theoryLevelTwoCards;
      const nextIndex = (previous[activeLevel] - 1 + cards.length) % cards.length;
      return { ...previous, [activeLevel]: nextIndex } as TheoryLevelState;
    });
    setIsFlipped(false);
  };

  const handleNext = () => {
    setIndices((previous) => {
      const cards = activeLevel === 1 ? theoryLevelOneCards : theoryLevelTwoCards;
      const nextIndex = (previous[activeLevel] + 1) % cards.length;
      return { ...previous, [activeLevel]: nextIndex } as TheoryLevelState;
    });
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleSelectLevel = (level: 1 | 2) => {
    setActiveLevel(level);
  };

  const face = isFlipped ? currentCard.back : currentCard.front;
  const levelLocked = activeLevel === 2 && !levelTwoUnlocked;
  const showLockedNotice = !levelTwoUnlocked;

  return (
    <section className="flex flex-col items-center gap-8">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Theory Deck</p>
        <h2 className="mt-2 text-3xl font-black uppercase text-white">{currentCard?.title}</h2>
      </header>

      <div className="flex items-center gap-3 rounded-full border border-fuchsia-500/30 bg-zinc-900/80 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-fuchsia-200">
        <button
          type="button"
          onClick={() => handleSelectLevel(1)}
          className={`rounded-full px-4 py-1 transition ${
            activeLevel === 1 ? "bg-fuchsia-500 text-white" : "text-fuchsia-200 hover:text-white"
          }`}
        >
          Level 1
        </button>
        <button
          type="button"
          onClick={() => handleSelectLevel(2)}
          disabled={!levelTwoUnlocked}
          className={`rounded-full px-4 py-1 transition ${
            activeLevel === 2
              ? "bg-amber-400 text-slate-900"
              : levelTwoUnlocked
              ? "text-amber-300 hover:text-amber-100"
              : "text-amber-300/40"
          }`}
        >
          Level 2
        </button>
      </div>

      {showLockedNotice && (
        <p className="max-w-xl rounded-2xl border border-amber-400/40 bg-amber-400/10 px-6 py-4 text-center text-sm text-amber-200">
          Unlock Level 2 by finishing Level Zero or reading five Level 1 cards. Chela is guarding the gilded deck.
        </p>
      )}

      <article
        className={`relative w-full max-w-2xl rounded-3xl border bg-zinc-900/80 p-10 text-left text-zinc-100 shadow-[0_0_45px_-20px_rgba(255,0,200,0.6)] transition-transform duration-300 ease-out ${
          activeLevel === 2
            ? "border-amber-400/60 bg-gradient-to-b from-zinc-950/90 to-zinc-900/60 shadow-[0_0_55px_-15px_rgba(255,191,0,0.5)]"
            : "border-fuchsia-500/30"
        } ${
          levelLocked ? "opacity-60" : "hover:scale-[1.01] focus-within:scale-[1.01]"
        }`}
        aria-live="polite"
      >
        <div className="space-y-6">
          <ul className="space-y-3 text-lg font-semibold">
            {face?.lines.map((line) => (
              <li key={line} className="list-disc pl-4 marker:text-fuchsia-400">
                {line}
              </li>
            ))}
          </ul>

          {face?.tryIt && (
            <p
              className={`rounded-xl border p-4 text-sm uppercase tracking-wide ${
                activeLevel === 2
                  ? "border-amber-400/60 bg-amber-400/10 text-amber-200"
                  : "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-200"
              }`}
            >
              Try This: {face.tryIt}
            </p>
          )}

          {face?.joke && (
            <p className="text-sm italic text-fuchsia-200">{face.joke}</p>
          )}

          {face?.chela && (
            <p className="text-sm text-zinc-300">{face.chela}</p>
          )}
        </div>
      </article>

      {!levelLocked && !isFlipped && currentCard?.level === 1 && currentCard.id === "L1:pulse" && (
        <CharacterBox
          name="Spark"
          mood="jazz"
          line="That beat swings, even when it’s straight."
          delay={180}
        />
      )}

      {!levelLocked && !isFlipped && currentCard?.level === 2 && currentCard.id === "L2:home-magnet" && (
        <CharacterBox
          name="Chela"
          mood="sage"
          line="Gold cards mean gold ears. Follow the magnet."
          delay={180}
        />
      )}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={levelLocked}
          className="rounded-full border border-zinc-700 bg-zinc-800 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-zinc-100 transition hover:border-fuchsia-400 hover:text-fuchsia-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-500"
        >
          ◀ Prev
        </button>
        <button
          type="button"
          onClick={handleFlip}
          disabled={levelLocked}
          className={`rounded-full border px-6 py-2 text-sm font-bold uppercase tracking-wide text-white transition focus:outline-none focus-visible:ring-2 ${
            activeLevel === 2
              ? "border-amber-400/60 bg-amber-400/80 text-slate-900 hover:bg-amber-300 focus-visible:ring-amber-300"
              : "border-fuchsia-500/40 bg-fuchsia-600/70 hover:bg-fuchsia-500 focus-visible:ring-fuchsia-300"
          } disabled:cursor-not-allowed disabled:border-zinc-800 disabled:bg-zinc-700 disabled:text-zinc-400`}
        >
          {isFlipped ? "Show Front" : "Flip Card"}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={levelLocked}
          className="rounded-full border border-zinc-700 bg-zinc-800 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-zinc-100 transition hover:border-fuchsia-400 hover:text-fuchsia-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-500"
        >
          Next ▶
        </button>
      </div>
    </section>
  );
};

export default TheoryDeck;
