import React from "react";

type TourZone = {
  id: string;
  name: string;
  genre: string;
  status: "available" | "locked";
  tagline: string;
  description: string;
  influences: string[];
  artists: string[];
  visualMotifs: string;
  icon: string;
  accentColor: string;
};

const tourZones: TourZone[] = [
  {
    id: "wax-town",
    name: "Wax Town",
    genre: "Industrial / EBM",
    status: "available",
    tagline: "Where the pipes never stop clanging.",
    description:
      "Warehouse catwalks rattle with sequenced hammers and fogged-out strobes. Station maps look more like patch cables than subway lines.",
    influences: ["Wax Trax! (Chicago)", "Nettwerk (Vancouver)", "Play It Again Sam (Belgium)"],
    artists: ["Front 242", "Ministry", "Skinny Puppy"],
    visualMotifs: "Chainlink fences, reel-to-reel tape, rusted samplers",
    icon: "🎛️",
    accentColor: "from-amber-500/80 to-orange-600/80",
  },
  {
    id: "yacht-dock",
    name: "Yacht Dock",
    genre: "Yacht Rock / Soft Pop",
    status: "available",
    tagline: "Where every drink has an orange slice and the mix is crystal.",
    description:
      "Polished teak decks shimmer beside chrome consoles, while satin jackets sway to endless major seventh chords.",
    influences: ["Warner Bros. '70s", "Columbia/CBS Pop", "City Pop Harbors"],
    artists: ["Steely Dan", "Hall & Oates", "Tatsuro Yamashita"],
    visualMotifs: "Chrome logos, neon tides, endless fade-outs",
    icon: "🛥️",
    accentColor: "from-sky-400/80 to-cyan-500/80",
  },
  {
    id: "outlaw-hollow",
    name: "Outlaw Hollow",
    genre: "Country / Doom / Truckstop Punk",
    status: "available",
    tagline: "AM radios hum outlaw blues and diesel fuzz.",
    description:
      "Roadside chapels and jukebox motels glow under desert storms; pedal steel howls through tube-amp ghosts.",
    influences: ["Sun Records", "Bloodshot (Chicago)", "Texas Indie Country"],
    artists: ["Waylon Jennings", "Hank III", "Lucinda Williams"],
    visualMotifs: "Desert skies, barbed wire staff lines, oil-stained guitars",
    icon: "🚛",
    accentColor: "from-lime-500/80 to-amber-400/80",
  },
  {
    id: "midnight-chapel",
    name: "Midnight Chapel",
    genre: "Goth / Post-Punk",
    status: "locked",
    tagline: "This place only opens after sundown.",
    description:
      "Fog rolls beneath cathedral synths while shadowed choirs chant into the reverb tanks humming with candlelight.",
    influences: ["4AD", "Cleopatra Records", "Factory Records"],
    artists: ["Bauhaus", "Siouxsie", "Coil"],
    visualMotifs: "Stained glass EQ curves, candles in reverb tanks",
    icon: "🕯️",
    accentColor: "from-purple-500/80 to-fuchsia-500/80",
  },
  {
    id: "basement-bounce",
    name: "Basement Bounce",
    genre: "House / Chicago + Detroit Club",
    status: "locked",
    tagline: "Every track starts with a kick and ends with a sermon.",
    description:
      "Sweat-dripped basements pulse with MPC pads flashing in sync, while crate diggers preach over 909 baptisms.",
    influences: ["Trax Records", "Underground Resistance", "Nervous Records"],
    artists: ["Frankie Knuckles", "Mr. Fingers", "DJ Assault"],
    visualMotifs: "Brick walls, crate diggers, flashing pads",
    icon: "🎚️",
    accentColor: "from-emerald-500/80 to-teal-500/80",
  },
];

type TourMapProps = {
  onZoneSelect?: (zoneId: string) => void;
};

const statusStyles: Record<TourZone["status"], string> = {
  available:
    "border-emerald-400/60 bg-zinc-900/70 shadow-[0_0_25px_-10px_rgba(34,197,94,0.4)] hover:-translate-y-1 hover:shadow-[0_12px_35px_-15px_rgba(34,197,94,0.55)]",
  locked:
    "border-zinc-800/80 bg-zinc-950/60 shadow-[inset_0_0_25px_rgba(0,0,0,0.7)] opacity-60 hover:opacity-80",
};

const TourMap: React.FC<TourMapProps> = ({ onZoneSelect }) => {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-6 py-16 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-zinc-700/10 via-transparent to-black" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Southside World Map</p>
          <h1 className="text-4xl font-black uppercase text-zinc-50 sm:text-5xl">
            Tour Map Control Center
          </h1>
          <p className="max-w-3xl text-sm text-zinc-300">
            Plot your next sonic invasion from the tour van dashboard. Each region beats with its own scene lore, label ghosts, and local legends. Crack the locks, vibe the frequencies, and slot in your crew when you&apos;re ready to drop.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[repeat(6,minmax(0,1fr))]">
          {tourZones.map((zone) => {
            const locked = zone.status === "locked";
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => !locked && onZoneSelect?.(zone.id)}
                className={`group relative flex flex-col gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${statusStyles[zone.status]} ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div
                  className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${zone.accentColor} opacity-0 transition-opacity duration-300 group-hover:opacity-40`}
                  aria-hidden={true}
                />

                {locked && (
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border border-zinc-800/80 bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,rgba(255,255,255,0.04)_8px,rgba(255,255,255,0.04)_16px)]" />
                )}

                <div className="relative flex items-center justify-between">
                  <span className="text-3xl" aria-hidden={true}>
                    {zone.icon}
                  </span>
                  <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${locked ? "border-zinc-700/80 text-zinc-500" : "border-emerald-400/70 text-emerald-300"}`}>
                    {locked ? "Locked" : "Open"}
                  </span>
                </div>

                <div className="relative space-y-2">
                  <h2 className="text-2xl font-black uppercase text-zinc-50">{zone.name}</h2>
                  <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                    {zone.genre}
                  </p>
                  <p className="text-sm italic text-zinc-300">{zone.tagline}</p>
                </div>

                <p className="relative text-sm text-zinc-200/90">{zone.description}</p>

                <div className="relative flex flex-col gap-2 rounded-xl border border-dashed border-zinc-700/70 bg-zinc-950/60 p-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">Scene Signals</p>
                    <ul className="mt-1 space-y-1 text-xs text-zinc-300">
                      {zone.influences.map((influence) => (
                        <li key={influence} className="flex items-start gap-2">
                          <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-zinc-500" aria-hidden={true} />
                          <span>{influence}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">Local Rotation</p>
                    <ul className="mt-1 flex flex-wrap gap-2 text-[11px] font-medium text-zinc-100">
                      {zone.artists.map((artist) => (
                        <li key={artist} className="rounded-full border border-zinc-700/80 px-2 py-1">
                          {artist}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-zinc-800/70 bg-zinc-900/60 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                    {zone.visualMotifs}
                  </div>
                </div>

                {locked && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-[2px]">
                    <span className="flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-900/80 px-4 py-1 text-xs uppercase tracking-[0.35em] text-zinc-400">
                      <span aria-hidden={true}>🔒</span> Future Route
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TourMap;
