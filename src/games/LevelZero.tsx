import { useEffect, useMemo, useState } from "react";

import { GameKey, useProgressTracker } from "../world/ProgressTracker";

type LevelZeroGameDefinition = {
  id: string;
  gameKey: GameKey;
  title: string;
  intro: string;
  actionLabel?: string;
  preview: string;
  instructions: string[];
  completionFlair: string[];
  warmupFlair?: string[];
};

type LevelZeroGameWithStatus = LevelZeroGameDefinition & {
  isUnlocked: boolean;
  isCompleted: boolean;
};

const LEVEL_ZERO_GAMES: LevelZeroGameDefinition[] = [
  {
    id: "stomp-loop",
    gameKey: "StompLoop",
    title: "Stomp Loop",
    intro: "Smack the glowing floor pad until your shoes memorize the floor.",
    preview: "Chela: \"If your stomp loops, the room loops you.\"",
    instructions: [
      "Tap the heavy pad. Let your heel and the pad make friends.",
      "Keep tapping until the room feels like it knows the pattern without thinking.",
      "Chela watches from the doorway, eyebrow up, waiting for the floor to purr.",
    ],
    completionFlair: [
      "Chela laughs: \"Loop locked. You just taught the hallway to walk itself.\"",
      "Chela snaps: \"That stomp could power the block.\"",
    ],
    warmupFlair: [
      "Chela side-eyes: \"The stomp needs seasoning. Give it another whirl.\"",
      "Chela shrugs: \"Close. Stir it again till it gels.\"",
    ],
  },
  {
    id: "blink-room",
    gameKey: "BlinkRoom",
    title: "Blink Room",
    intro: "A soft strobe blinks from the ceiling. You try to catch it with your fingertip.",
    preview: "Chela: \"Ride the blinkwave. Or become accidental jazz lightning.\"",
    instructions: [
      "Watch the flash pulse across the walls.",
      "Tap the giant glass button the moment the light flares.",
      "The room either hugs you in sync or teases you for jumping too soon.",
    ],
    completionFlair: [
      "You ride the blinkwave.",
      "Chela grins: \"Laser-finger legend.\"",
    ],
    warmupFlair: [
      "Chela: \"Too early! You’re jazz. Accidentally.\"",
      "Chela: \"Blink again. Let the light choose you first.\"",
    ],
  },
  {
    id: "cut-cut-cut",
    gameKey: "CutCutCut",
    title: "Cut Cut Cut",
    intro: "Quick clips blink on screen like your favorite montage. You guess the next slice.",
    preview: "Chela: \"Your brain is an edit bay. Let’s see if it’s got montage intuition.\"",
    instructions: [
      "Watch the video panels snap between scenes.",
      "Feel when the next cut is about to slam in, then click.",
      "If you nail it, the collage cheers. If you miss, the editor ghost giggles.",
    ],
    completionFlair: [
      "On cut.",
      "Chela: \"You got montage intuition.\"",
    ],
    warmupFlair: [
      "Late. The scene already sprinted away.",
      "Early. You chopped the air. Try again.",
    ],
  },
  {
    id: "bass-car",
    gameKey: "BassCar",
    title: "Bass Car",
    intro: "A low throb idles like a car door with the sub woofer rattling.",
    preview: "Chela: \"Nod on the thump till the whole ride trusts you with the wheel.\"",
    instructions: [
      "Feel the sub pulse rumble your ribcage.",
      "Nod, tap, or click in sync with the vibration until the dashboard smiles.",
      "The camera shakes on every hit to remind your spine where to land.",
    ],
    completionFlair: [
      "You felt it in the ribcage.",
      "Chela: \"You might be driving the beat now…\"",
    ],
    warmupFlair: [
      "You lost the throb.",
      "Chela: \"Gas it again, driver. Let the seat bounce tell you when.\"",
    ],
  },
  {
    id: "stroke-machine",
    gameKey: "StrokeMachine",
    title: "Stroke Machine",
    intro: "Paint strokes flicker with glitch sparks. You mimic the motion with your hand.",
    preview: "Chela: \"Paint like Sade is slow-dancing on your cursor.\"",
    instructions: [
      "Watch the paint bursts flow across the canvas.",
      "Drag your cursor or tap in the same shape the streak takes.",
      "Pair the motion with the sound burst until it feels like one move.",
    ],
    completionFlair: [
      "This line zags like Bauhaus.",
      "Chela: \"Try one smoother. Think Sade, not Slayer.\"",
    ],
    warmupFlair: [
      "Chela squints: \"The stroke is crunchy. Loosen your shoulder.\"",
      "Chela cackles: \"That line just moshed. Give it some velvet.\"",
    ],
  },
];

const pickRandom = (lines: string[] | undefined): string | undefined => {
  if (!lines || lines.length === 0) {
    return undefined;
  }
  const index = Math.floor(Math.random() * lines.length);
  return lines[index];
};

const LevelZero = () => {
  const { progress, completeGame } = useProgressTracker();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [lastChelaLine, setLastChelaLine] = useState<string | null>(null);

  const gamesWithStatus = useMemo<LevelZeroGameWithStatus[]>(() => {
    const completedMap = new Map<GameKey, boolean>();
    Object.entries(progress.games).forEach(([key, value]) => {
      completedMap.set(key as GameKey, Boolean(value?.completed));
    });

    return LEVEL_ZERO_GAMES.map((game, index) => {
      const isCompleted = completedMap.get(game.gameKey) ?? false;
      const prerequisiteCompleted = LEVEL_ZERO_GAMES.slice(0, index).every((entry) => {
        const status = completedMap.get(entry.gameKey);
        return status ?? false;
      });
      const isUnlocked = index === 0 || prerequisiteCompleted;
      return { ...game, isCompleted, isUnlocked };
    });
  }, [progress.games]);

  const totalCompleted = useMemo(
    () => gamesWithStatus.filter((game) => game.isCompleted).length,
    [gamesWithStatus],
  );

  const allCompleted = gamesWithStatus.every((game) => game.isCompleted);
  const levelZeroComplete = progress.games.LevelZero?.completed ?? false;

  useEffect(() => {
    if (allCompleted && !levelZeroComplete) {
      completeGame("LevelZero", "Level Zero embodied orientation complete.");
      setLastChelaLine("Chela whispers: \"Wax Town’s gates swing open.\"");
    }
  }, [allCompleted, levelZeroComplete, completeGame]);

  const activeGame = gamesWithStatus.find((game) => game.id === activeGameId) ?? null;

  const handlePractice = (game: LevelZeroGameWithStatus) => {
    setLastChelaLine(pickRandom(game.warmupFlair) ?? "Chela nods: \"Keep feeling it.\"");
  };

  const handleCompleteGame = (game: LevelZeroGameWithStatus) => {
    if (!game.isCompleted) {
      completeGame(game.gameKey, `Level Zero: ${game.title}`);
    }
    setLastChelaLine(pickRandom(game.completionFlair) ?? "Chela beams.");
    setActiveGameId(null);
  };

  const progressPercent = Math.round((totalCompleted / LEVEL_ZERO_GAMES.length) * 100);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
        <header className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-amber-400">Level Zero</p>
          <h1 className="text-4xl font-bold md:text-5xl">Southside Sensory Lab</h1>
          <p className="mx-auto max-w-3xl text-lg text-zinc-300">
            No jargon. No chalkboards. Just you, your body, and Chela egging you on. Finish
            every microgame to sneak your way into Wax Town.
          </p>

          <div className="mx-auto flex w-full max-w-md flex-col gap-2">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>
                {totalCompleted} / {LEVEL_ZERO_GAMES.length} felt
              </span>
              <span>{progressPercent}% embodied</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {lastChelaLine ? (
            <p className="text-base font-semibold text-amber-300">{lastChelaLine}</p>
          ) : null}
        </header>

        <section className="grid gap-8">
          {gamesWithStatus.map((game) => (
            <article
              key={game.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-lg shadow-amber-500/10"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-white">{game.title}</h2>
                    {game.isCompleted ? (
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
                        felt
                      </span>
                    ) : null}
                    {!game.isUnlocked ? (
                      <span className="rounded-full bg-zinc-700/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        locked
                      </span>
                    ) : null}
                  </div>
                  <p className="max-w-2xl text-base text-zinc-300">{game.intro}</p>
                </div>
                <p className="max-w-xs text-sm italic text-amber-200">{game.preview}</p>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  disabled={!game.isUnlocked}
                  onClick={() => setActiveGameId(game.id)}
                  className="w-full rounded-full bg-amber-500 px-8 py-4 text-lg font-bold text-zinc-950 transition-transform duration-200 hover:scale-[1.02] hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 sm:w-auto"
                >
                  {game.isCompleted ? "Play again" : game.actionLabel ?? "Play"}
                </button>
                {!game.isUnlocked ? (
                  <p className="text-sm text-zinc-500">Finish the previous game to unlock this one.</p>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </div>

      {activeGame ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-950/80 px-6 py-10 backdrop-blur">
          <div className="w-full max-w-xl space-y-6 rounded-3xl border border-amber-500/30 bg-zinc-900 p-8 text-left shadow-2xl shadow-amber-500/30">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-3xl font-semibold text-white">{activeGame.title}</h3>
              <button
                type="button"
                onClick={() => setActiveGameId(null)}
                className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-zinc-300 hover:bg-zinc-700"
              >
                Close
              </button>
            </div>
            <p className="text-base text-zinc-300">{activeGame.intro}</p>
            <ul className="list-disc space-y-2 pl-6 text-sm text-zinc-400">
              {activeGame.instructions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={() => handlePractice(activeGame)}
                className="w-full rounded-full border border-amber-500/50 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-200 transition-colors hover:border-amber-400 hover:text-amber-100 sm:w-1/2"
              >
                Practice Again
              </button>
              <button
                type="button"
                onClick={() => handleCompleteGame(activeGame)}
                className="w-full rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-zinc-950 transition-transform hover:scale-[1.01] hover:bg-amber-400 sm:w-1/2"
              >
                I Felt It
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LevelZero;
