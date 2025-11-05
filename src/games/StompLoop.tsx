import { useMemo, useState } from "react";

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

const StompLoop = () => {
  const [stomps, setStomps] = useState<number[]>([]);

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

  const handleStomp = () => {
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

        <div className="h-6 flex items-center justify-center text-lg font-mono">
          {feedbackMessage}
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
