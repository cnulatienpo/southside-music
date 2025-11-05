import { useMemo, useState } from "react";

const MIN_INTERVAL = 300;
const MAX_INTERVAL = 1500;
const MAX_PULSES = 12;

const formatFeedback = (times: number[]): string => {
  if (times.length === 0) {
    return "Give Chela a stomp to start the loop.";
  }

  if (times.length === 1) {
    return "Feel that first pulse. Keep it going.";
  }

  const lastInterval = times[times.length - 1] - times[times.length - 2];

  if (lastInterval < MIN_INTERVAL) {
    return "Too fast";
  }

  if (lastInterval > MAX_INTERVAL) {
    return "Too slow";
  }

  if (times.length >= 4) {
    const intervals = times
      .slice(1)
      .map((time, index) => time - times[index]);
    const recentIntervals = intervals.slice(-3);

    const isSteady =
      recentIntervals.length === 3 &&
      recentIntervals.every(
        (interval) => interval >= MIN_INTERVAL && interval <= MAX_INTERVAL,
      );

    if (isSteady) {
      return "Now that's a loop";
    }
  }

  return "Keep that stomp breathing.";
};

const StompLoop = () => {
  const [stomps, setStomps] = useState<number[]>([]);

  const trimmedStomps = useMemo(
    () => stomps.slice(-MAX_PULSES),
    [stomps],
  );

  const feedback = useMemo(() => formatFeedback(stomps), [stomps]);

  const handleStomp = () => {
    const now = Date.now();
    setStomps((previous) => [...previous, now]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl text-center space-y-8">
        <p className="text-2xl font-semibold font-serif leading-relaxed">
          Welcome to school. Not the kind with chalkboards and sit-still energy.
          <br />
          This is the <span className="italic">feel-it-in-your-ribs</span> kind.
          <br />
          You learn to hear with your neck. With your gut. With your spine.
          <br />
          That’s how music works down here. On the Southside.
        </p>

        <button
          type="button"
          onClick={handleStomp}
          className="mt-6 inline-flex items-center justify-center px-12 py-6 text-xl font-bold rounded-full bg-white text-black shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105 transition-transform"
        >
          STOMP
        </button>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {trimmedStomps.map((time, index) => {
            const intensity = (index + 1) / trimmedStomps.length;
            const size = index === trimmedStomps.length - 1 ? "w-16 h-16" : "w-12 h-12";
            const opacity = (0.4 + intensity * 0.6).toFixed(2);

            return (
              <div
                key={time}
                className={`${size} rounded-full border-4 border-emerald-400/80 flex items-center justify-center transition-transform duration-300`}
                style={{
                  boxShadow: `0 0 25px rgba(16, 185, 129, ${opacity})`,
                }}
              >
                <div
                  className="w-3/4 h-3/4 rounded-full bg-emerald-300"
                  style={{ opacity }}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-lg font-mono text-emerald-200 tracking-wide uppercase">
          {feedback}
        </div>

        <button
          type="button"
          className="mt-12 inline-flex items-center justify-center px-8 py-3 border border-white/20 rounded-full text-sm tracking-[0.3em] uppercase hover:bg-white hover:text-black transition"
        >
          Advance to Next Game
        </button>
      </div>
    </div>
  );
};

export default StompLoop;
