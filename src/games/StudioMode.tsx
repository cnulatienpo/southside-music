import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import * as Tone from "tone";

type SectionName = "Intro" | "Verse" | "Chorus" | "Outro";
type LoopCategory = "Drums" | "Bass" | "Melody" | "Texture" | "FX" | "Voice";

type LoopSpec = {
  id: string;
  label: string;
  icon: string;
  category: LoopCategory;
  mood: "dusty" | "shimmer" | "drone" | "gloss" | "haunt" | "frenzy";
  toneTag: "gritty" | "sleek" | "foggy" | "glassy" | "feral" | "warm";
  energy: number; // 0 - 1 range
  description: string;
};

type RegionPack = {
  id: string;
  name: string;
  accent: string;
  background: string;
  description: string;
  loops: LoopSpec[];
};

type AssignedLoop = LoopSpec & {
  regionId: string;
  regionName: string;
};

type ArrangementState = Record<SectionName, Partial<Record<LoopCategory, AssignedLoop>>>;

type FxOption = {
  id: string;
  label: string;
  accent: string;
  texture: string;
  vibe: "dusty" | "chrome" | "echo" | "crush" | "warp";
  reaction: string;
};

type FxAssignments = Record<SectionName, string[]>;

const sections: SectionName[] = ["Intro", "Verse", "Chorus", "Outro"];
const loopCategories: LoopCategory[] = [
  "Drums",
  "Bass",
  "Melody",
  "Texture",
  "FX",
  "Voice",
];

const categoryNotes: Record<LoopCategory, string> = {
  Drums: "C2",
  Bass: "C1",
  Melody: "E3",
  Texture: "A4",
  FX: "D5",
  Voice: "G3",
};

const loopPacks: RegionPack[] = [
  {
    id: "wax-town",
    name: "Wax Town",
    accent: "border-amber-400 text-amber-200",
    background: "bg-gradient-to-br from-zinc-900 via-stone-900 to-black",
    description: "Dusty neon grooves pulled from warehouse boomboxes.",
    loops: [
      {
        id: "wax-dustbin-breaks",
        label: "Dustbin Breaks",
        icon: "🥁",
        category: "Drums",
        mood: "dusty",
        toneTag: "gritty",
        energy: 0.7,
        description: "Cracked snares chewing through hiss.",
      },
      {
        id: "wax-subway-throb",
        label: "Subway Throb",
        icon: "🎸",
        category: "Bass",
        mood: "dusty",
        toneTag: "warm",
        energy: 0.6,
        description: "Low-end rumble straight off the third rail.",
      },
      {
        id: "wax-night-keys",
        label: "Night Keys",
        icon: "🎹",
        category: "Melody",
        mood: "shimmer",
        toneTag: "foggy",
        energy: 0.5,
        description: "Broken Rhodes with bruised chords.",
      },
      {
        id: "wax-air-vents",
        label: "Air Vents",
        icon: "🌫️",
        category: "Texture",
        mood: "drone",
        toneTag: "foggy",
        energy: 0.3,
        description: "HVAC ghosts breathing in loops.",
      },
      {
        id: "wax-siren-wash",
        label: "Siren Wash",
        icon: "🚨",
        category: "FX",
        mood: "frenzy",
        toneTag: "feral",
        energy: 0.8,
        description: "Emergency lights melting into delay.",
      },
      {
        id: "wax-hallway-chant",
        label: "Hallway Chant",
        icon: "🎤",
        category: "Voice",
        mood: "haunt",
        toneTag: "gritty",
        energy: 0.4,
        description: "Kids choir recorded through a vent.",
      },
    ],
  },
  {
    id: "yacht-dock",
    name: "Yacht Dock",
    accent: "border-cyan-400 text-cyan-200",
    background: "bg-gradient-to-br from-slate-900 via-blue-950 to-black",
    description: "Glossy marina pop soaked in sea breeze shimmer.",
    loops: [
      {
        id: "yacht-lux-kit",
        label: "Lux Kit",
        icon: "🥁",
        category: "Drums",
        mood: "gloss",
        toneTag: "sleek",
        energy: 0.6,
        description: "Snaps and claps in chrome reverb.",
      },
      {
        id: "yacht-rubber-bass",
        label: "Rubber Bass",
        icon: "🎸",
        category: "Bass",
        mood: "gloss",
        toneTag: "sleek",
        energy: 0.5,
        description: "Slippery sub slides across the wake.",
      },
      {
        id: "yacht-sunrise-lead",
        label: "Sunrise Lead",
        icon: "🎺",
        category: "Melody",
        mood: "shimmer",
        toneTag: "glassy",
        energy: 0.7,
        description: "Brassy synth bursting like a yacht horn.",
      },
      {
        id: "yacht-crystal-spray",
        label: "Crystal Spray",
        icon: "💎",
        category: "Texture",
        mood: "shimmer",
        toneTag: "glassy",
        energy: 0.4,
        description: "Ice cube glitter across the stereo field.",
      },
      {
        id: "yacht-jetset-fx",
        label: "Jetset FX",
        icon: "🛥️",
        category: "FX",
        mood: "gloss",
        toneTag: "sleek",
        energy: 0.6,
        description: "Luxury ad swooshes and champagne pops.",
      },
      {
        id: "yacht-vogue-vocal",
        label: "Vogue Vocal",
        icon: "🎤",
        category: "Voice",
        mood: "gloss",
        toneTag: "sleek",
        energy: 0.6,
        description: "Breathy hooks leaning on the beat.",
      },
    ],
  },
  {
    id: "storm-market",
    name: "Storm Market",
    accent: "border-purple-400 text-purple-200",
    background: "bg-gradient-to-br from-indigo-950 via-purple-950 to-black",
    description: "Haunted rave energy hiding in the rain stalls.",
    loops: [
      {
        id: "storm-surge-drums",
        label: "Surge Drums",
        icon: "🥁",
        category: "Drums",
        mood: "frenzy",
        toneTag: "feral",
        energy: 0.85,
        description: "Thundering kicks dripping with distortion.",
      },
      {
        id: "storm-static-bass",
        label: "Static Bass",
        icon: "🎸",
        category: "Bass",
        mood: "dusty",
        toneTag: "gritty",
        energy: 0.75,
        description: "Buzzing saw bass buzzing like neon.",
      },
      {
        id: "storm-specter-lead",
        label: "Specter Lead",
        icon: "🕯️",
        category: "Melody",
        mood: "haunt",
        toneTag: "foggy",
        energy: 0.65,
        description: "Choir pad sneaking between lightning strikes.",
      },
      {
        id: "storm-wire-hum",
        label: "Wire Hum",
        icon: "🪫",
        category: "Texture",
        mood: "drone",
        toneTag: "feral",
        energy: 0.5,
        description: "Powerlines singing in the downpour.",
      },
      {
        id: "storm-tunnel-fx",
        label: "Tunnel FX",
        icon: "🌪️",
        category: "FX",
        mood: "frenzy",
        toneTag: "feral",
        energy: 0.8,
        description: "Reverse swells and thunder claps.",
      },
      {
        id: "storm-shadow-howl",
        label: "Shadow Howl",
        icon: "👻",
        category: "Voice",
        mood: "haunt",
        toneTag: "feral",
        energy: 0.5,
        description: "Distant siren songs inside the rain gutter.",
      },
    ],
  },
];

const fxOptions: FxOption[] = [
  {
    id: "lofi",
    label: "Lo-Fi",
    accent: "bg-amber-500/20 border border-amber-400/40 text-amber-200",
    texture: "shadow-[0_0_15px_rgba(251,191,36,0.35)]",
    vibe: "dusty",
    reaction: "Now it sounds like an abandoned mall PA system.",
  },
  {
    id: "distortion",
    label: "Distortion",
    accent: "bg-rose-500/20 border border-rose-400/40 text-rose-200",
    texture: "shadow-[0_0_18px_rgba(244,63,94,0.45)]",
    vibe: "crush",
    reaction: "You fried it. In a good way.",
  },
  {
    id: "echo",
    label: "Echo Chamber",
    accent: "bg-cyan-500/20 border border-cyan-400/40 text-cyan-200",
    texture: "shadow-[0_0_18px_rgba(34,211,238,0.35)]",
    vibe: "echo",
    reaction: "Chela tilts her head: endless hallway energy.",
  },
  {
    id: "tape",
    label: "Tape Stop",
    accent: "bg-purple-500/20 border border-purple-400/40 text-purple-200",
    texture: "shadow-[0_0_22px_rgba(168,85,247,0.4)]",
    vibe: "warp",
    reaction: "You just graffiti'd time itself.",
  },
  {
    id: "chorus",
    label: "Liquid Chorus",
    accent: "bg-blue-500/20 border border-blue-400/40 text-blue-200",
    texture: "shadow-[0_0_16px_rgba(59,130,246,0.4)]",
    vibe: "chrome",
    reaction: "Chela grins: it shimmers like wet asphalt.",
  },
];

const buildEmptyArrangement = (): ArrangementState => {
  return sections.reduce((acc, section) => {
    acc[section] = {};
    return acc;
  }, {} as ArrangementState);
};

const buildEmptyFx = (): FxAssignments => {
  return sections.reduce((acc, section) => {
    acc[section] = [];
    return acc;
  }, {} as FxAssignments);
};

const energyToVelocity = (energy: number) => 0.35 + energy * 0.55;

const StudioMode = () => {
  const [arrangement, setArrangement] = useState<ArrangementState>(() => buildEmptyArrangement());
  const [fxAssignments, setFxAssignments] = useState<FxAssignments>(() => buildEmptyFx());
  const [selectedSection, setSelectedSection] = useState<SectionName>("Intro");
  const [selectedCategory, setSelectedCategory] = useState<LoopCategory>("Drums");
  const [activeRegionId, setActiveRegionId] = useState<string>(loopPacks[0]?.id ?? "");
  const [isPlaying, setIsPlaying] = useState(false);

  const previewSynthRef = useRef<Tone.PolySynth | null>(null);
  const trackSynthRef = useRef<Tone.PolySynth | null>(null);
  const trackGainRef = useRef<Tone.Gain | null>(null);
  const scheduleIdsRef = useRef<number[]>([]);

  useEffect(() => {
    const previewSynth = new Tone.PolySynth(Tone.Synth, {
      volume: -10,
      envelope: { attack: 0.02, release: 0.3 },
    }).toDestination();
    previewSynthRef.current = previewSynth;

    const gain = new Tone.Gain(0).toDestination();
    trackGainRef.current = gain;

    const trackSynth = new Tone.PolySynth(Tone.Synth, {
      volume: -8,
      envelope: { attack: 0.03, release: 0.8 },
    }).connect(gain);
    trackSynthRef.current = trackSynth;

    return () => {
      scheduleIdsRef.current.forEach((id) => Tone.Transport.clear(id));
      Tone.Transport.stop();
      Tone.Transport.cancel(0);
      previewSynth.dispose();
      trackSynth.dispose();
      gain.dispose();
    };
  }, []);

  const activeRegion = useMemo(
    () => loopPacks.find((pack) => pack.id === activeRegionId) ?? loopPacks[0],
    [activeRegionId]
  );

  const handlePaletteAssign = (loop: LoopSpec) => {
    if (!selectedSection || !selectedCategory) {
      return;
    }

    setArrangement((prev) => {
      const next: ArrangementState = { ...prev };
      const sectionLoops = { ...next[selectedSection] };
      sectionLoops[selectedCategory] = {
        ...loop,
        regionId: activeRegion?.id ?? "",
        regionName: activeRegion?.name ?? "",
      };
      next[selectedSection] = sectionLoops;
      return next;
    });
    setSelectedCategory(loop.category);
  };

  const handleLoopPreview = async (loop: LoopSpec) => {
    const synth = previewSynthRef.current;
    if (!synth) return;
    await Tone.start();
    const now = Tone.now() + 0.05;
    const velocity = energyToVelocity(loop.energy);
    synth.triggerAttackRelease(categoryNotes[loop.category], "8n", now, velocity);
  };

  const toggleFx = (section: SectionName, fxId: string) => {
    const fx = fxOptions.find((option) => option.id === fxId);
    if (!fx) return;
    setFxAssignments((prev) => {
      const current = prev[section] ?? [];
      const exists = current.includes(fxId);
      let nextSectionFx = current;
      if (exists) {
        nextSectionFx = current.filter((id) => id !== fxId);
      } else if (current.length < 2) {
        nextSectionFx = [...current, fxId];
      }
      return {
        ...prev,
        [section]: nextSectionFx,
      };
    });
  };

  const stopPlayback = (fade = true) => {
    const gain = trackGainRef.current;
    const now = Tone.now();
    if (gain) {
      gain.gain.cancelScheduledValues(now);
      if (fade) {
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.6);
      } else {
        gain.gain.setValueAtTime(0, now);
      }
    }
    scheduleIdsRef.current.forEach((id) => Tone.Transport.clear(id));
    scheduleIdsRef.current = [];
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    Tone.Transport.cancel(0);
    setIsPlaying(false);
  };

  const handlePlayTrack = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    const gain = trackGainRef.current;
    const synth = trackSynthRef.current;
    if (!gain || !synth) return;

    await Tone.start();

    stopPlayback(false);

    const sectionDuration = 4; // seconds per section sketch
    const totalDuration = sections.length * sectionDuration;

    const fadeInId = Tone.Transport.schedule((time) => {
      gain.gain.cancelScheduledValues(time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.85, time + 0.8);
    }, 0);

    scheduleIdsRef.current.push(fadeInId);

    sections.forEach((section, index) => {
      const loops = arrangement[section] ?? {};
      const sectionStart = index * sectionDuration;
      loopCategories.forEach((category) => {
        const loop = loops[category];
        if (!loop) return;
        const velocity = energyToVelocity(loop.energy);
        const eventId = Tone.Transport.schedule((time) => {
          synth.triggerAttackRelease(categoryNotes[category], "2n", time, velocity);
        }, sectionStart);
        scheduleIdsRef.current.push(eventId);
      });

      const fxForSection = fxAssignments[section] ?? [];
      if (fxForSection.length) {
        const shimmerId = Tone.Transport.schedule((time) => {
          fxForSection.forEach((fxId, fxIndex) => {
            const offset = fxIndex * 0.25;
            synth.set({ detune: fxId === "tape" ? -300 : fxId === "chorus" ? 12 : 0 });
            synth.triggerAttackRelease("A5", "8n", time + offset, 0.25);
          });
          synth.set({ detune: 0 });
        }, sectionStart + sectionDuration - 1);
        scheduleIdsRef.current.push(shimmerId);
      }
    });

    const fadeOutId = Tone.Transport.schedule((time) => {
      gain.gain.cancelScheduledValues(time);
      gain.gain.setValueAtTime(gain.gain.value, time);
      gain.gain.linearRampToValueAtTime(0, time + 1);
    }, totalDuration - 1);
    scheduleIdsRef.current.push(fadeOutId);

    const cleanupId = Tone.Transport.schedule((time) => {
      scheduleIdsRef.current.forEach((id) => Tone.Transport.clear(id));
      scheduleIdsRef.current = [];
      setIsPlaying(false);
      Tone.Transport.stop(time + 0.05);
      Tone.Transport.position = 0;
      Tone.Transport.cancel(0);
    }, totalDuration + 0.6);
    scheduleIdsRef.current.push(cleanupId);

    Tone.Transport.start("+0.1");
    setIsPlaying(true);
  };

  const summary = useMemo(() => {
    const moodTally = new Map<string, number>();
    const toneTally = new Map<string, number>();
    let rhythmWeight = 0;
    let melodyWeight = 0;
    let voiceWeight = 0;

    sections.forEach((section) => {
      loopCategories.forEach((category) => {
        const loop = arrangement[section]?.[category];
        if (!loop) return;
        moodTally.set(loop.mood, (moodTally.get(loop.mood) ?? 0) + 1);
        toneTally.set(loop.toneTag, (toneTally.get(loop.toneTag) ?? 0) + 1);
        if (category === "Drums" || category === "Bass") rhythmWeight += 1;
        if (category === "Melody" || category === "Texture" || category === "FX")
          melodyWeight += 1;
        if (category === "Voice") voiceWeight += 1;
      });
    });

    const dominantMood = Array.from(moodTally.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
    const dominantTone = Array.from(toneTally.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];

    const descriptors: string[] = [];
    if (rhythmWeight >= melodyWeight) {
      descriptors.push("mostly rhythm-forward");
    } else if (melodyWeight > 0) {
      descriptors.push("floating on spectral harmonies");
    }

    if (voiceWeight > 0) {
      descriptors.push("with a ghost choir cameo");
    }

    const fxSet = new Set<string>();
    sections.forEach((section) => {
      fxAssignments[section]?.forEach((fx) => fxSet.add(fx));
    });

    if (fxSet.size) {
      const fxFlavor = Array.from(fxSet)
        .map((fxId) => fxOptions.find((option) => option.id === fxId)?.vibe)
        .filter(Boolean);
      if (fxFlavor.includes("dusty")) descriptors.push("coated in lo-fi grit");
      if (fxFlavor.includes("chrome")) descriptors.push("polished with liquid sheen");
      if (fxFlavor.includes("echo")) descriptors.push("haunting the reverb tunnels");
      if (fxFlavor.includes("crush")) descriptors.push("sizzling at the edges");
      if (fxFlavor.includes("warp")) descriptors.push("bending the tape timeline");
    }

    if (dominantMood) {
      descriptors.push(`radiating ${dominantMood} air`);
    }
    if (dominantTone) {
      descriptors.push(`built with ${dominantTone} tones`);
    }

    if (!descriptors.length) {
      return "This track is waiting for its first spark.";
    }

    const intro = descriptors.shift();
    return `This track is ${intro}${descriptors.length ? `, ${descriptors.join(", ")}` : ""}.`;
  }, [arrangement, fxAssignments]);

  const chelaReaction = useMemo(() => {
    const fxSet = new Set<string>();
    sections.forEach((section) => fxAssignments[section]?.forEach((fx) => fxSet.add(fx)));

    if (fxSet.has("tape")) {
      return "Chela winks: that tape stop hit like a freight elevator braking.";
    }
    if (fxSet.has("distortion")) {
      return "Chela barks approval — the amps smell like ozone now.";
    }
    if (fxSet.has("echo")) {
      return "Chela tilts her head, ears chasing the echoes down the hall.";
    }

    const chorusVoices = sections.some((section) => arrangement[section]?.Voice);
    const grittyLoops = sections.some((section) =>
      loopCategories.some((category) => arrangement[section]?.[category]?.toneTag === "gritty")
    );

    if (chorusVoices && grittyLoops) {
      return "Chela howls along — gutter gospel achieved.";
    }
    if (chorusVoices) {
      return "Chela hums under her breath at those vocals.";
    }
    if (grittyLoops) {
      return "Chela nods: smells like burnt vinyl and that's perfect.";
    }

    return "Chela watches, tail tapping in quarter notes.";
  }, [arrangement, fxAssignments]);

  return (
    <div className="min-h-screen bg-[#090909] p-6 text-zinc-100">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-[0_0_25px_rgba(0,0,0,0.35)]">
            <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-zinc-500">
              Sound Palette
            </h2>
            <p className="mt-2 text-xs text-zinc-400">
              Choose a region to grab loops. Click an element to drop it into the selected section.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {loopPacks.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => setActiveRegionId(pack.id)}
                  className={clsx(
                    "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition",
                    activeRegion?.id === pack.id
                      ? `${pack.accent} ${pack.background} scale-[1.02]`
                      : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                  )}
                >
                  {pack.name}
                </button>
              ))}
            </div>
            {activeRegion && (
              <div
                className={clsx(
                  "mt-4 space-y-3 rounded-xl border p-4",
                  activeRegion.accent,
                  activeRegion.background
                )}
              >
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-zinc-400">Region Vibe</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-100">
                    {activeRegion.description}
                  </p>
                </div>
                <div className="grid gap-3">
                  {activeRegion.loops.map((loop) => (
                    <div
                      key={loop.id}
                      className="group flex items-center justify-between rounded-lg border border-zinc-700/70 bg-black/40 p-3 text-xs transition hover:border-zinc-500 hover:bg-black/60"
                    >
                      <button
                        onClick={() => handlePaletteAssign(loop)}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <span className="text-lg">{loop.icon}</span>
                        <div>
                          <p className="font-semibold tracking-wide text-zinc-100">{loop.label}</p>
                          <p className="text-[0.7rem] text-zinc-400">{loop.description}</p>
                          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.4em] text-zinc-500">
                            Send to {selectedSection} · {selectedCategory}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => handleLoopPreview(loop)}
                        className="rounded-md border border-zinc-600 px-2 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-100"
                      >
                        Preview
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-[0_0_30px_rgba(0,0,0,0.45)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-black uppercase tracking-[0.4em] text-zinc-400">
                  Studio Mode · Southside Loop Lab
                </h1>
                <p className="mt-3 max-w-xl text-sm text-zinc-300">{summary}</p>
              </div>
              <button
                onClick={handlePlayTrack}
                className={clsx(
                  "rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] transition",
                  isPlaying
                    ? "border-rose-500 bg-rose-600/20 text-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.35)]"
                    : "border-emerald-400 bg-emerald-500/10 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:bg-emerald-500/20"
                )}
              >
                {isPlaying ? "Stop the Ride" : "Play My Track"}
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.5em] text-zinc-500">
              Track Timeline
            </h2>
            <div className="space-y-4">
              {sections.map((section) => {
                const sectionFx = fxAssignments[section] ?? [];
                const sectionHasFx = sectionFx.length > 0;
                return (
                  <div
                    key={section}
                    className={clsx(
                      "rounded-2xl border border-zinc-800 bg-gradient-to-br from-black via-zinc-950 to-black p-4 transition",
                      sectionHasFx && "shadow-[0_0_25px_rgba(244,63,94,0.2)]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedSection(section)}
                        className={clsx(
                          "rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] transition",
                          selectedSection === section
                            ? "border-zinc-100 bg-zinc-100 text-black"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                        )}
                      >
                        {section}
                      </button>
                      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-zinc-500">
                        {sectionFx.length ? `${sectionFx.length} FX engaged` : "No FX yet"}
                      </p>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                      {loopCategories.map((category) => {
                        const loop = arrangement[section]?.[category];
                        const isActive =
                          selectedSection === section && selectedCategory === category;
                        return (
                          <button
                            key={`${section}-${category}`}
                            onClick={() => {
                              setSelectedSection(section);
                              setSelectedCategory(category);
                            }}
                            className={clsx(
                              "flex h-20 flex-col justify-between rounded-xl border border-dashed border-zinc-700/70 bg-black/30 p-3 text-left transition hover:border-zinc-500 hover:bg-black/50",
                              isActive && "border-solid border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.3)]"
                            )}
                          >
                            <span className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                              {category}
                            </span>
                            {loop ? (
                              <div>
                                <p className="text-lg">{loop.icon}</p>
                                <p className="text-[0.7rem] text-zinc-300">{loop.label}</p>
                                <p className="text-[0.6rem] text-zinc-500">{loop.regionName}</p>
                              </div>
                            ) : (
                              <p className="text-[0.6rem] text-zinc-600">Drop a loop</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {fxOptions.map((fx) => {
                        const engaged = sectionFx.includes(fx.id);
                        return (
                          <button
                            key={`${section}-${fx.id}`}
                            onClick={() => toggleFx(section, fx.id)}
                            className={clsx(
                              "rounded-lg px-3 py-2 text-[0.6rem] uppercase tracking-[0.4em] transition",
                              engaged
                                ? `${fx.accent} ${fx.texture}`
                                : "border border-zinc-700 bg-black/40 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                            )}
                          >
                            {fx.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr),280px]">
            <div className="rounded-2xl border border-zinc-800 bg-black/60 p-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.5em] text-zinc-500">
                Arrangement Notes
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                {sections.map((section) => {
                  const loops = arrangement[section];
                  const filled = loopCategories.filter((category) => loops?.[category]);
                  if (!filled.length) {
                    return (
                      <li key={section} className="text-zinc-500">
                        {section}: waiting for loops.
                      </li>
                    );
                  }
                  return (
                    <li key={section}>
                      <span className="font-semibold text-zinc-100">{section}</span>: {filled
                        .map((category) => loops?.[category])
                        .filter(Boolean)
                        .map((loop) => `${loop?.label}`)
                        .join(", ")}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5">
              <div className="absolute -right-10 top-6 h-24 w-24 rounded-full bg-rose-500/40 blur-3xl" />
              <div className="absolute left-6 bottom-6 h-20 w-20 rounded-full bg-emerald-500/30 blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-400 bg-rose-500/30 text-2xl">
                    🐕‍🦺
                  </div>
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.5em] text-zinc-500">
                      Chela
                    </p>
                    <p className="text-sm font-semibold text-zinc-100">Loop Guardian</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-rose-400/30 bg-black/50 p-4 text-sm text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.3)]">
                  {chelaReaction}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudioMode;
