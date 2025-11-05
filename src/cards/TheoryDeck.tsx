import React, { useMemo, useState } from "react";

type CardFace = {
  lines: string[];
  chela?: string;
  joke?: string;
  tryIt?: string;
};

type TheoryCard = {
  title: string;
  front: CardFace & { chela: string };
  back: CardFace & { joke: string };
};

const theoryCards: TheoryCard[] = [
  {
    title: "What's a Beat?",
    front: {
      lines: [
        "In the beginning, there was a noise that repeated.",
        "The repeating moment is the beat.",
        "Hear it: every AC/DC song ever made.",
        "Feel it: your head nod when a car passes with bass.",
      ],
      chela: "That's the glue that makes heads nod.",
    },
    back: {
      lines: [
        "See it: the blink of a nightclub light.",
        "In film: the cut.",
        "In painting: the stroke that keeps returning.",
      ],
      tryIt: "Record your footsteps. Make a loop.",
      joke: "Chela whispers: \"If the beat stops, who told the lights to chill?\"",
    },
  },
  {
    title: "Meet the Rest",
    front: {
      lines: [
        "Silence isn't empty—it's a held breath.",
        "The rest is the pause that frames the groove.",
        "Hear it: the drop right before the chorus explodes.",
        "Feel it: the hush before you clap with everyone else.",
      ],
      chela: "Shhh. That's the suspense that makes the return hit harder.",
    },
    back: {
      lines: [
        "See it: traffic lights holding back the rush.",
        "In film: the close-up before the punchline.",
        "In painting: negative space hugging the subject.",
      ],
      tryIt: "Count to four and only move on the silent numbers.",
      joke: "Chela jokes: \"Even my tail knows when to freeze before the pounce.\"",
    },
  },
  {
    title: "Texture of Tone",
    front: {
      lines: [
        "Tone is the flavor of a sound.",
        "Bright, dark, fuzzy—it's the coat the note wears.",
        "Hear it: vinyl crackle vs. laser synth.",
        "Feel it: velvet sax against gravelly guitar.",
      ],
      chela: "That's the wardrobe that makes each note strut different.",
    },
    back: {
      lines: [
        "See it: chrome reflections versus denim matte.",
        "In film: soft focus romance vs. gritty noir.",
        "In painting: thick oil swirls against ink lines.",
      ],
      tryIt: "Name the texture of every sound in your kitchen for a day.",
      joke: "Chela muses: \"Give me a tone coat with pockets for riffs.\"",
    },
  },
];

const TheoryDeck: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = useMemo(() => theoryCards[currentIndex], [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex - 1 + theoryCards.length) % theoryCards.length;
      return nextIndex;
    });
    setIsFlipped(false);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % theoryCards.length;
      return nextIndex;
    });
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const face = isFlipped ? currentCard.back : currentCard.front;

  return (
    <section className="flex flex-col items-center gap-8">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Theory Deck</p>
        <h2 className="mt-2 text-3xl font-black uppercase text-white">
          {currentCard.title}
        </h2>
      </header>

      <article
        className="w-full max-w-2xl rounded-3xl border border-fuchsia-500/30 bg-zinc-900/80 p-10 text-left text-zinc-100 shadow-[0_0_45px_-20px_rgba(255,0,200,0.6)] transition-transform duration-300 ease-out hover:scale-[1.01] focus-within:scale-[1.01]"
        aria-live="polite"
      >
        <div className="space-y-6">
          <ul className="space-y-3 text-lg font-semibold">
            {face.lines.map((line) => (
              <li key={line} className="list-disc pl-4 marker:text-fuchsia-400">
                {line}
              </li>
            ))}
          </ul>

          {face.tryIt && (
            <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm uppercase tracking-wide text-amber-200">
              Try It: {face.tryIt}
            </p>
          )}

          {face.joke && (
            <p className="text-sm italic text-fuchsia-200">{face.joke}</p>
          )}

          {face.chela && (
            <p className="text-sm text-zinc-300">{face.chela}</p>
          )}
        </div>
      </article>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handlePrev}
          className="rounded-full border border-zinc-700 bg-zinc-800 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-zinc-100 transition hover:border-fuchsia-400 hover:text-fuchsia-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
        >
          ◀ Prev
        </button>
        <button
          type="button"
          onClick={handleFlip}
          className="rounded-full border border-fuchsia-500/40 bg-fuchsia-600/70 px-6 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-fuchsia-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
        >
          {isFlipped ? "Show Front" : "Flip Card"}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-full border border-zinc-700 bg-zinc-800 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-zinc-100 transition hover:border-fuchsia-400 hover:text-fuchsia-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
        >
          Next ▶
        </button>
      </div>
    </section>
  );
};

export default TheoryDeck;
