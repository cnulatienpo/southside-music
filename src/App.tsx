const sections = [
  {
    title: 'Level Zero Games',
    description:
      'Warm-up rituals with neon traffic signs, noise pedals, and rhythm quests that smell like late-night asphalt after rain.'
  },
  {
    title: 'Theory Cards',
    description:
      'Pocket-sized lore drops about modes, intervals, and shadowy chord conspiracies—collect them like trading gossip backstage.'
  },
  {
    title: 'Characters',
    description:
      'Meet Chela and the backstage cryptids: synth gremlins, avant-garde pigeons, and the janitor who speaks only in polyrhythms.'
  },
  {
    title: 'Tour Map',
    description:
      'Choose your route through the industrial playground—from echo tunnels to rooftop amp gardens, each with hidden riffs.'
  },
  {
    title: 'Coming Soon: Audio + Band Builder',
    description:
      'Assemble a spectral ensemble, dial in custom textures, and let Tone.js breathe life into your postpunk daydreams.'
  }
];

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-white px-6 py-10">
      <header className="max-w-4xl mx-auto text-center space-y-4">
        <p className="tracking-[0.35em] uppercase text-sm text-neon">Southside School of Music</p>
        <h1 className="text-4xl md:text-6xl font-mono font-semibold">
          Welcome to Chela&apos;s Crosswalk Conservatory
        </h1>
        <p className="text-slate-200 max-w-2xl mx-auto">
          A modular, sensory-first, humor-rich music playground for creative mischief-makers. Grab your
          traffic-sign guitar, press the pedestrian button, and step into the groove.
        </p>
      </header>

      <main className="max-w-5xl mx-auto mt-16 grid gap-10">
        {sections.map((section) => (
          <section
            key={section.title}
            className="border border-slate-800 bg-black/60 rounded-3xl p-8 shadow-glow hover:border-neon transition"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-neon mb-4">{section.title}</h2>
            <p className="text-slate-200 leading-relaxed">{section.description}</p>
          </section>
        ))}
      </main>

      <footer className="max-w-4xl mx-auto mt-20 text-center text-sm text-slate-400">
        <p>
          Mascot-in-residence: <strong>Chela</strong>, blue heeler and patron saint of perfectly timed crosswalk solos.
        </p>
        <p className="mt-3">
          Built with React, TailwindCSS, and a dry sense of humor tuned to drop-D.
        </p>
      </footer>
    </div>
  );
}
