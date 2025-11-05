import React from "react";

const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white font-mono">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-zinc-400">
            Welcome to the halls of
          </p>
          <h1 className="text-5xl font-black uppercase sm:text-6xl md:text-7xl">
            Southside School of Music
          </h1>
          <p className="max-w-2xl text-lg text-zinc-300">
            A punk-forward sonic playground where rhythm rebels, melody misfits,
            and sensory seekers groove together in the dark.
          </p>
        </header>

        <section className="grid gap-6 rounded-lg border border-zinc-800 bg-zinc-900/40 p-8 shadow-[0_0_35px_-15px_rgba(0,0,0,0.8)]">
          <h2 className="text-3xl font-extrabold uppercase text-sky-300">
            Meet the Mascot
          </h2>
          <p className="text-zinc-200">
            Chela the Blue Heeler is our rhythm scout—ears perked, tail wagging,
            and always ready to sniff out the next beat. She herds ideas like
            synth arpeggios, keeps the halls safe, and loves nothing more than a
            backstage nap on top of an amplifier.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-extrabold uppercase text-amber-300">
            Level Zero Games
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-2xl font-bold text-white">Echo Chase</h3>
              <p className="text-sm text-zinc-300">
                Hunt down neon echoes by matching call-and-response riffs before
                they fade into the static.
              </p>
            </article>
            <article className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-2xl font-bold text-white">Pulse Puzzles</h3>
              <p className="text-sm text-zinc-300">
                Snap rhythms into place like magnetic polaroids, building a beat
                collage you can feel in your sneakers.
              </p>
            </article>
            <article className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-2xl font-bold text-white">Siren Steps</h3>
              <p className="text-sm text-zinc-300">
                Step through glowing floor tiles to map a melody path, dodging
                feedback flares and spotlight swirls.
              </p>
            </article>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-extrabold uppercase text-fuchsia-300">
            Theory Cards
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-fuchsia-500/30 bg-zinc-900/60 p-6 shadow-[0_0_25px_-10px_rgba(255,0,200,0.4)]">
              <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-400">
                Card 01
              </p>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Sonic Shapes
              </h3>
              <p className="mt-2 text-sm text-zinc-300">
                Trace waveforms with your fingertips to feel the curves of
                basslines, bell-tones, and glitchy swells.
              </p>
            </div>
            <div className="rounded-xl border border-fuchsia-500/30 bg-zinc-900/60 p-6 shadow-[0_0_25px_-10px_rgba(255,0,200,0.4)]">
              <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-400">
                Card 02
              </p>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Rhythm Recipes
              </h3>
              <p className="mt-2 text-sm text-zinc-300">
                Mix beats like a kitchen alchemist—three claps, a stomp, and a
                whispered hiss make a crunchy groove.
              </p>
            </div>
            <div className="rounded-xl border border-fuchsia-500/30 bg-zinc-900/60 p-6 shadow-[0_0_25px_-10px_rgba(255,0,200,0.4)]">
              <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-400">
                Card 03
              </p>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Texture Tags
              </h3>
              <p className="mt-2 text-sm text-zinc-300">
                Match instruments to textures—velvet trumpets, sandpaper snares,
                and chrome chimes.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-extrabold uppercase text-lime-300">
            Core Crew
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-lime-500/20 bg-zinc-900/40 p-6">
              <h3 className="text-2xl font-bold text-white">DJ Volt</h3>
              <p className="text-sm text-zinc-300">
                A turntable tactician with a lightning braid and a knack for
                scratching thunder into every mix.
              </p>
            </article>
            <article className="rounded-lg border border-lime-500/20 bg-zinc-900/40 p-6">
              <h3 className="text-2xl font-bold text-white">Synth Sage</h3>
              <p className="text-sm text-zinc-300">
                Floating through the halls with glowing keys, translating
                feelings into shimmering chord clouds.
              </p>
            </article>
            <article className="rounded-lg border border-lime-500/20 bg-zinc-900/40 p-6">
              <h3 className="text-2xl font-bold text-white">Beat Builder</h3>
              <p className="text-sm text-zinc-300">
                Crafts beats out of scrapyard relics—oil drums, bicycle spokes,
                and cassette tape loops.
              </p>
            </article>
            <article className="rounded-lg border border-lime-500/20 bg-zinc-900/40 p-6">
              <h3 className="text-2xl font-bold text-white">Harmony Hacker</h3>
              <p className="text-sm text-zinc-300">
                Codes chord progressions like neon graffiti, making harmonies
                that glitch and glow.
              </p>
            </article>
            <article className="rounded-lg border border-lime-500/20 bg-zinc-900/40 p-6 md:col-span-2">
              <h3 className="text-2xl font-bold text-white">Percussion Pixie</h3>
              <p className="text-sm text-zinc-300">
                A tiny shaker-wielding spark with wings that sound like hi-hats,
                sprinkling syncopation everywhere.
              </p>
            </article>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-extrabold uppercase text-cyan-300">
            Tour Zones (Future Levels)
          </h2>
          <ul className="space-y-3 text-sm text-zinc-300">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
              <span>
                <strong className="text-white">Neon Skyline:</strong> Rooftop rave
                routes where drones carry the basslines across the city.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
              <span>
                <strong className="text-white">Subterranean Pulse:</strong> Tunnel
                labyrinths pulsing with ultraviolet drums and echoing choirs.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
              <span>
                <strong className="text-white">Galactic Greenroom:</strong> A
                zero-gravity jam session orbiting a glittering disco moon.
              </span>
            </li>
          </ul>
        </section>

        <footer className="border-t border-zinc-800 pt-8 text-sm text-zinc-500">
          Step 5 awaits: interactivity and audio stubs. Keep the amps warm.
        </footer>
      </div>
    </main>
  );
};

export default App;
