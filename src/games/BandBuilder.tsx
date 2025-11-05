import { useMemo, useState } from "react";

type CharacterPalette = {
  panel: string;
  accent: string;
  quote: string;
  border: string;
  iconBackground: string;
};

type CharacterProfile = {
  id: string;
  name: string;
  role: string;
  description: string;
  quote: string;
  icon: string;
  defaultInstrumentId: string;
  palette: CharacterPalette;
};

type Instrument = {
  id: string;
  name: string;
  toneFamily: string;
  origin: string;
  detail: string;
  icon: string;
};

type BandSlot = {
  characterId: string;
  instrumentId: string;
};

const characterCast: CharacterProfile[] = [
  {
    id: "mouth",
    name: "Mouth",
    role: "Lyric conduit",
    description: "Poet laureate of the lunchroom cipher.",
    quote: "Talks in prosody.",
    icon: "🗣️",
    defaultInstrumentId: "tape-sampler",
    palette: {
      panel: "bg-gradient-to-br from-amber-100/30 via-amber-200/20 to-stone-900/40",
      accent: "text-amber-200",
      quote: "text-amber-100/90",
      border: "border-amber-400/50",
      iconBackground: "bg-amber-500/30",
    },
  },
  {
    id: "thump",
    name: "Thump",
    role: "Rhythm engine",
    description: "Keeps the freight train heartbeat steady.",
    quote: "Rides on groove and diesel.",
    icon: "🥁",
    defaultInstrumentId: "ghost-drum-machine",
    palette: {
      panel: "bg-gradient-to-br from-amber-900/60 via-zinc-900/80 to-black/70",
      accent: "text-amber-300",
      quote: "text-amber-100/90",
      border: "border-amber-500/40",
      iconBackground: "bg-amber-600/40",
    },
  },
  {
    id: "spark",
    name: "Spark",
    role: "Spectral keys",
    description: "Harmonies drift in from the after-hours piano bar.",
    quote: "Ghost of a burned-down jazz club.",
    icon: "🎹",
    defaultInstrumentId: "phantom-organ",
    palette: {
      panel: "bg-gradient-to-br from-slate-900/70 via-blue-900/50 to-black/60",
      accent: "text-sky-300",
      quote: "text-sky-200/90",
      border: "border-sky-500/40",
      iconBackground: "bg-sky-500/30",
    },
  },
  {
    id: "chela",
    name: "Chela",
    role: "Wildcard guitarist",
    description: "Strings howl like alleyway sirens at midnight.",
    quote: "Barks in D minor.",
    icon: "🐕‍🦺",
    defaultInstrumentId: "traffic-guitar",
    palette: {
      panel: "bg-gradient-to-br from-rose-900/70 via-orange-900/60 to-black/70",
      accent: "text-rose-200",
      quote: "text-rose-100/80",
      border: "border-rose-500/40",
      iconBackground: "bg-rose-500/30",
    },
  },
  {
    id: "outlaw",
    name: "Outlaw",
    role: "Dusty storyteller",
    description: "Bootheels strike sparks off desert tin.",
    quote: "Plays cards with the echo and always wins.",
    icon: "🤠",
    defaultInstrumentId: "spoke-banjo",
    palette: {
      panel: "bg-gradient-to-br from-stone-800/80 via-amber-800/60 to-zinc-900/70",
      accent: "text-amber-200",
      quote: "text-amber-100/80",
      border: "border-amber-600/40",
      iconBackground: "bg-amber-500/30",
    },
  },
  {
    id: "rivethead",
    name: "Rivethead",
    role: "Industrial pulse",
    description: "Feeding BPM straight from the assembly line.",
    quote: "Hears the factory as a cathedral.",
    icon: "⚙️",
    defaultInstrumentId: "anvil-bass",
    palette: {
      panel: "bg-gradient-to-br from-slate-900/80 via-zinc-800/70 to-black/70",
      accent: "text-lime-200",
      quote: "text-lime-100/80",
      border: "border-lime-500/40",
      iconBackground: "bg-lime-500/20",
    },
  },
  {
    id: "crooner",
    name: "Crooner",
    role: "Noir vocalist",
    description: "Velvet phrasing soaked in midnight rain.",
    quote: "Sings torch songs to flickering street lamps.",
    icon: "🎙️",
    defaultInstrumentId: "noir-mic",
    palette: {
      panel: "bg-gradient-to-br from-indigo-900/70 via-purple-900/60 to-black/70",
      accent: "text-violet-200",
      quote: "text-violet-100/80",
      border: "border-violet-500/40",
      iconBackground: "bg-violet-500/30",
    },
  },
  {
    id: "dubmage",
    name: "Dub Mage",
    role: "Echo sorcerer",
    description: "Conjures basslines that hover like fog.",
    quote: "Faders are wands, delay is prophecy.",
    icon: "🪄",
    defaultInstrumentId: "echo-cauldron",
    palette: {
      panel: "bg-gradient-to-br from-emerald-900/70 via-cyan-900/60 to-black/70",
      accent: "text-emerald-200",
      quote: "text-emerald-100/80",
      border: "border-emerald-500/40",
      iconBackground: "bg-emerald-500/30",
    },
  },
];

const instruments: Instrument[] = [
  {
    id: "traffic-guitar",
    name: "Traffic Sign Guitar",
    toneFamily: "Clangy strings",
    origin: "Scrapped from city detours and bolted with copper wire.",
    detail: "Guitar made from traffic signs.",
    icon: "🚧",
  },
  {
    id: "tape-sampler",
    name: "VHS Tape Sampler",
    toneFamily: "Hiss-soaked collage",
    origin: "Loaded with found VHS tapes spliced from the media lab.",
    detail: "Sampler filled with found VHS tapes.",
    icon: "📼",
  },
  {
    id: "anvil-bass",
    name: "Anvil Drop Bass",
    toneFamily: "Submetal rumble",
    origin: "Forged from steel mill offcuts tuned to drop D forever.",
    detail: "Bass that only plays in drop D.",
    icon: "🔩",
  },
  {
    id: "ghost-drum-machine",
    name: "Haunted Drum Machine",
    toneFamily: "Spectral percussion",
    origin: "Possessed by the ghost of a '78 gig recorded to cassette.",
    detail: "Drum machine possessed by a ghost of a '78 gig.",
    icon: "👻",
  },
  {
    id: "phantom-organ",
    name: "Phantom Organ",
    toneFamily: "Ectoplasmic chords",
    origin: "Keys salvaged from a church after the great blackout.",
    detail: "Every note leaves a trail of cold mist.",
    icon: "🕯️",
  },
  {
    id: "spoke-banjo",
    name: "Bicycle Spoke Banjo",
    toneFamily: "Rustic twang",
    origin: "Pieced from scrapyard wheels and moonshine barrels.",
    detail: "Every pluck rattles a pocketful of gravel.",
    icon: "🚲",
  },
  {
    id: "noir-mic",
    name: "Smoke Curl Microphone",
    toneFamily: "Velvet croon",
    origin: "Rescued from a shuttered supper club.",
    detail: "Ribbon soaked in rainwater gin and neon.",
    icon: "💡",
  },
  {
    id: "echo-cauldron",
    name: "Echo Cauldron",
    toneFamily: "Dub alchemy",
    origin: "A mixing desk bubbling with reverb potions.",
    detail: "Stir it and the room doubles in size.",
    icon: "🌀",
  },
];

const adjectives = [
  "Cursed",
  "Drive Chain",
  "Neon",
  "Rusted",
  "Hallowed",
  "Back Alley",
  "Chrome",
  "Midnight",
  "Velvet",
  "Hauntologic",
];

const mashups = [
  "Mascara",
  "Gospel",
  "Yacht Ghoul",
  "Echo Wolf",
  "Throttle Choir",
  "Rooftop Kraken",
  "Circuit Lynx",
  "Lantern Engine",
  "Grime Parade",
  "Fader Serpent",
];

const BAND_SLOT_COUNT = 5;

const createEmptyBand = (): (BandSlot | null)[] => new Array(BAND_SLOT_COUNT).fill(null);

const BandBuilder = () => {
  const [bandSlots, setBandSlots] = useState<(BandSlot | null)[]>(createEmptyBand);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [bandName, setBandName] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const handleSelectSlot = (index: number) => {
    setSelectedSlot(index);
    setShowSummary(false);
  };

  const handleChooseCharacter = (characterId: string) => {
    if (selectedSlot === null) return;

    const character = characterCast.find((profile) => profile.id === characterId);
    if (!character) return;

    setBandSlots((prev) => {
      const next = [...prev];
      next[selectedSlot] = {
        characterId,
        instrumentId: character.defaultInstrumentId,
      };
      return next;
    });
  };

  const handleInstrumentChange = (slotIndex: number, instrumentId: string) => {
    setBandSlots((prev) => {
      const next = [...prev];
      const slot = next[slotIndex];
      if (!slot) return prev;
      next[slotIndex] = {
        ...slot,
        instrumentId,
      };
      return next;
    });
  };

  const handleRemove = (slotIndex: number) => {
    setBandSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  const generateBandName = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const mashup = mashups[Math.floor(Math.random() * mashups.length)];
    const generated = `${adjective} ${mashup}`;
    setBandName(generated);
    setShowSummary(false);
  };

  const handlePrintBand = () => {
    const summary = bandSlots
      .map((slot, index) => {
        if (!slot) {
          return `Slot ${index + 1}: Empty`;
        }
        const character = characterCast.find((profile) => profile.id === slot.characterId);
        const instrument = instruments.find((item) => item.id === slot.instrumentId);
        return `Slot ${index + 1}: ${character?.name ?? "Unknown"} on ${instrument?.name ?? "mystery"}`;
      })
      .join(" | ");

    // Future: export or print design
    // eslint-disable-next-line no-console
    console.log(`Band: ${bandName || "Untitled"} -> ${summary}`);
    setShowSummary(true);
  };

  const filledSlots = useMemo(
    () => bandSlots.filter((slot) => slot !== null).length,
    [bandSlots],
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#111827,_#09090b_65%,_#020202)] text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-400">Southside School of Music</p>
          <h1 className="max-w-3xl font-serif text-4xl sm:text-5xl">
            Build a band that sounds like neon graffiti and haunted vinyl.
          </h1>
          <p className="max-w-2xl text-zinc-300">
            Pick the misfits, assign their noisemakers, and name the outfit. Each slot in your lineup is a portal to a
            different corner of the Southside scene.
          </p>
          <div className="flex flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 shadow-[0_20px_60px_-40px_rgba(16,185,129,0.45)] sm:flex-row sm:items-center">
            <label className="flex flex-1 flex-col text-sm uppercase tracking-[0.35em] text-emerald-200">
              Band Name
              <input
                value={bandName}
                onChange={(event) => {
                  setBandName(event.target.value);
                  setShowSummary(false);
                }}
                placeholder="Type your legend..."
                className="mt-2 w-full rounded-xl border border-emerald-400/40 bg-black/40 px-4 py-3 text-base font-semibold tracking-normal text-emerald-100 placeholder:text-emerald-200/40 focus:border-emerald-300 focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={generateBandName}
              className="flex-shrink-0 rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-5 py-3 text-sm font-black uppercase tracking-[0.35em] text-emerald-100 transition hover:bg-emerald-400/30"
            >
              Roll Random
            </button>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl">Band Layout</h2>
              <span className="text-xs uppercase tracking-[0.4em] text-zinc-400">
                {filledSlots}/{BAND_SLOT_COUNT} slots filled
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {bandSlots.map((slot, index) => {
                const isSelected = selectedSlot === index;
                const character = slot ? characterCast.find((profile) => profile.id === slot.characterId) : null;
                const instrument = slot ? instruments.find((item) => item.id === slot.instrumentId) : null;
                const palette = character?.palette;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectSlot(index)}
                    className={`group relative flex flex-col rounded-3xl border px-5 py-6 text-left shadow-[0_25px_45px_-35px_rgba(0,0,0,0.8)] transition focus:outline-none focus:ring-4 focus:ring-emerald-400/40 ${
                      palette?.panel ?? "bg-zinc-900/70"
                    } ${palette?.border ?? "border-zinc-700/40"} ${
                      isSelected ? "ring-4 ring-emerald-400/50" : "hover:border-emerald-400/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={`text-xs uppercase tracking-[0.5em] ${palette?.accent ?? "text-zinc-400"}`}>
                          Slot {index + 1}
                        </p>
                        <h3 className="mt-2 font-serif text-2xl">
                          {character ? character.name : "Vacant silhouette"}
                        </h3>
                      </div>
                      <span
                        className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${
                          palette?.iconBackground ?? "bg-zinc-800/60"
                        }`}
                        aria-hidden
                      >
                        {character?.icon ?? "?"}
                      </span>
                    </div>

                    <div className="mt-5 space-y-4 text-sm text-zinc-200">
                      {character ? (
                        <>
                          <p className="text-base font-semibold leading-6 text-zinc-100">{character.role}</p>
                          <p className="leading-relaxed text-zinc-200/90">{character.description}</p>
                          <p className={`italic ${palette?.quote ?? "text-zinc-300/80"}`}>&ldquo;{character.quote}&rdquo;</p>
                        </>
                      ) : (
                        <p className="leading-relaxed text-zinc-400">
                          Choose a character from the cast list to drop into this slot. They bring their own attitude and
                          sonic baggage.
                        </p>
                      )}
                    </div>

                    {slot && character && instrument && (
                      <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl" aria-hidden>
                            {instrument.icon}
                          </span>
                          <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">Gear</p>
                            <p className="font-semibold text-zinc-100">{instrument.name}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-xs uppercase tracking-[0.35em] text-zinc-500">Tone Family</p>
                        <p className="text-sm text-zinc-200">{instrument.toneFamily}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.35em] text-zinc-500">Origin Story</p>
                        <p className="text-sm text-zinc-200">{instrument.origin}</p>
                        <p className="mt-2 text-sm font-semibold text-emerald-200">{instrument.detail}</p>
                        <label className="mt-4 block text-xs uppercase tracking-[0.4em] text-zinc-500">
                          Swap Instrument
                          <select
                            value={slot.instrumentId}
                            onChange={(event) => handleInstrumentChange(index, event.target.value)}
                            className="mt-2 w-full rounded-xl border border-emerald-400/30 bg-black/50 px-3 py-2 text-sm font-semibold text-emerald-100 focus:border-emerald-300 focus:outline-none"
                          >
                            {instruments.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    )}

                    {character && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRemove(index);
                        }}
                        className="absolute right-5 top-5 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.4em] text-zinc-400 opacity-0 transition group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6 rounded-3xl border border-emerald-400/20 bg-emerald-500/5 p-6 shadow-[0_25px_60px_-40px_rgba(16,185,129,0.4)]">
            <h2 className="font-serif text-2xl text-emerald-100">The Cast</h2>
            <p className="text-sm text-emerald-200/70">
              Click a band slot, then assign one of these legends. More faces unlock as you chart new zones on the
              Southside map.
            </p>
            <div className="flex flex-col gap-4">
              {characterCast.map((character) => {
                const isAlreadyInBand = bandSlots.some((slot) => slot?.characterId === character.id);
                const isDisabled = selectedSlot === null || isAlreadyInBand;

                return (
                  <div
                    key={character.id}
                    className={`rounded-2xl border px-4 py-4 text-sm shadow-[0_15px_35px_-25px_rgba(16,185,129,0.45)] ${
                      character.palette.panel
                    } ${character.palette.border}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs uppercase tracking-[0.45em] ${character.palette.accent}`}>{character.name}</p>
                        <p className="mt-1 font-semibold text-zinc-100">{character.role}</p>
                      </div>
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-2xl text-xl ${character.palette.iconBackground}`}
                        aria-hidden
                      >
                        {character.icon}
                      </span>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.35em] text-zinc-400">Lore</p>
                    <p className="text-sm text-zinc-200">{character.description}</p>
                    <p className={`mt-2 text-sm italic ${character.palette.quote}`}>&ldquo;{character.quote}&rdquo;</p>
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleChooseCharacter(character.id)}
                      className={`mt-4 w-full rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-[0.4em] transition ${
                        isDisabled
                          ? "cursor-not-allowed border-emerald-200/10 bg-black/20 text-emerald-200/30"
                          : "border-emerald-400/30 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30"
                      }`}
                    >
                      {selectedSlot === null
                        ? "Select a slot"
                        : isAlreadyInBand
                          ? "Already on stage"
                          : `Send to slot ${selectedSlot + 1}`}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-black/40 p-4 text-xs uppercase tracking-[0.4em] text-emerald-200/60">
              Bonus: scout new map zones to unlock mythic members. Future update – bands will jam in Level Builder and
              Studio mode.
            </div>
          </aside>
        </div>

        <footer className="flex flex-col items-start gap-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-[0_30px_80px_-45px_rgba(16,185,129,0.5)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">Ready to poster the neighborhood?</p>
            <p className="mt-2 max-w-xl text-sm text-emerald-100/90">
              “Print My Band” will snapshot the current lineup. Export tools are coming once the ink dries.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrintBand}
            className="rounded-xl border border-emerald-400/40 bg-emerald-500/30 px-6 py-3 text-sm font-black uppercase tracking-[0.4em] text-emerald-100 transition hover:bg-emerald-500/40"
          >
            Print My Band
          </button>
        </footer>

        {showSummary && (
          <section className="rounded-3xl border border-emerald-400/30 bg-black/40 p-6 shadow-[0_20px_70px_-45px_rgba(16,185,129,0.5)]">
            <h2 className="font-serif text-2xl text-emerald-100">
              {bandName ? `${bandName}` : "Untitled Ensemble"}
            </h2>
            <p className="mt-2 text-sm uppercase tracking-[0.35em] text-emerald-200/70">Lineup</p>
            <div className="mt-4 space-y-4">
              {bandSlots.map((slot, index) => {
                if (!slot) {
                  return (
                    <p key={index} className="text-sm text-zinc-400">
                      Slot {index + 1}: Waiting for a headliner.
                    </p>
                  );
                }

                const character = characterCast.find((profile) => profile.id === slot.characterId);
                const instrument = instruments.find((item) => item.id === slot.instrumentId);

                return (
                  <div key={index} className="flex flex-col gap-1">
                    <p className="text-base font-semibold text-emerald-100">
                      {character?.name ?? "Mystery"} – {instrument?.name ?? "Unknown contraption"}
                    </p>
                    <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">{character?.role}</p>
                    <p className="text-sm text-zinc-300">{instrument?.detail}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BandBuilder;
