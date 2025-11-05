import { useEffect, useMemo, useRef, useState } from "react";
import * as Tone from "tone";

export interface LayerTrack {
  id: string;
  label: string;
  /** Remote or local URL for a loop-ready audio asset. */
  url?: string;
  /** Optional playback gain offset in decibels. */
  volume?: number;
  /** Accent color used for the visualizer ring. */
  color?: string;
  /** Optional short descriptor shown under the label. */
  description?: string;
}

export interface LayerPrompt {
  message: string;
  predicate: (context: { activeIds: Set<string>; tracks: LayerTrack[] }) => boolean;
}

export interface LayerStackProps {
  /** Override the default set of loop stems. */
  tracks?: LayerTrack[];
  /** Swap in custom listening prompts. */
  prompts?: LayerPrompt[];
  /** Lines Chela can deliver after each change. */
  voiceLines?: string[];
  /** Optional title for the stack. */
  title?: string;
  /** Optional helper copy under the title. */
  helperText?: string;
  /** Additional class names for the container. */
  className?: string;
}

const defaultTracks: LayerTrack[] = [
  {
    id: "drums",
    label: "Drums",
    description: "Rust-and-steel beat grid",
    url: "https://tonejs.github.io/audio/berklee/drums.mp3",
    color: "#f97316",
  },
  {
    id: "bass",
    label: "Bass",
    description: "Low-end spine",
    url: "https://tonejs.github.io/audio/berklee/bass.mp3",
    color: "#22d3ee",
  },
  {
    id: "pad",
    label: "Pads",
    description: "Mist curtain",
    url: "https://tonejs.github.io/audio/berklee/pad.mp3",
    color: "#a855f7",
  },
  {
    id: "guitar",
    label: "Texture",
    description: "Corroded strings",
    url: "https://tonejs.github.io/audio/berklee/guitar.mp3",
    color: "#f87171",
  },
  {
    id: "vocal",
    label: "Vocal Sample",
    description: "Ghost fragment",
    url: "https://tonejs.github.io/audio/berklee/vox.mp3",
    color: "#facc15",
  },
];

const defaultPrompts: LayerPrompt[] = [
  {
    message: "Now there’s atmosphere.",
    predicate: ({ activeIds }) =>
      activeIds.has("drums") && activeIds.has("bass") && activeIds.has("pad") && activeIds.size >= 3,
  },
  {
    message: "You’re hearing the skeleton.",
    predicate: ({ activeIds }) =>
      activeIds.size === 2 && activeIds.has("drums") && activeIds.has("bass"),
  },
  {
    message: "Raw nerve. No backup.",
    predicate: ({ activeIds }) => activeIds.size === 1 && activeIds.has("vocal"),
  },
];

const defaultVoiceLines = [
  "That’s a good bone pile.",
  "Too clean. Needs more dirt.",
  "This would slap in a '93 rave basement.",
];

export function LayerStack({
  tracks,
  prompts,
  voiceLines,
  title = "Layer Stack",
  helperText = "Flip the toggles to excavate the loop.",
  className,
}: LayerStackProps) {
  const resolvedTracks = useMemo(
    () => (tracks && tracks.length > 0 ? tracks : defaultTracks),
    [tracks],
  );
  const resolvedPrompts = useMemo(
    () => (prompts && prompts.length > 0 ? prompts : defaultPrompts),
    [prompts],
  );
  const resolvedVoiceLines = useMemo(
    () => (voiceLines && voiceLines.length > 0 ? voiceLines : defaultVoiceLines),
    [voiceLines],
  );

  const [activeTrackIds, setActiveTrackIds] = useState<string[]>([]);
  const [playersReady, setPlayersReady] = useState(false);
  const [chelaLine, setChelaLine] = useState(resolvedVoiceLines[0]);
  const playersRef = useRef<Map<string, Tone.Player>>(new Map());
  const firstRender = useRef(true);

  useEffect(() => {
    setChelaLine(resolvedVoiceLines[0]);
  }, [resolvedVoiceLines]);

  useEffect(() => {
    setActiveTrackIds((current) =>
      current.filter((id) => resolvedTracks.some((track) => track.id === id)),
    );
  }, [resolvedTracks]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setPlayersReady(false);
    let disposed = false;

    const setupPlayers = async () => {
      const players = new Map<string, Tone.Player>();

      for (const track of resolvedTracks) {
        if (!track.url) {
          continue;
        }

        const player = new Tone.Player({
          url: track.url,
          loop: true,
          autostart: false,
          volume: track.volume ?? 0,
        }).toDestination();

        player.sync().start(0);
        player.mute = true;
        players.set(track.id, player);
      }

      await Tone.loaded();

      if (disposed) {
        players.forEach((player) => player.dispose());
        return;
      }

      playersRef.current.forEach((player) => player.dispose());
      playersRef.current = players;
      setPlayersReady(true);
    };

    setupPlayers();

    return () => {
      disposed = true;
      setPlayersReady(false);
      playersRef.current.forEach((player) => player.dispose());
      playersRef.current.clear();
      if (Tone.Transport.state !== "stopped") {
        Tone.Transport.stop();
        Tone.Transport.position = 0;
      }
    };
  }, [resolvedTracks]);

  useEffect(() => {
    if (!playersReady || typeof window === "undefined") {
      return;
    }

    const activeSet = new Set(activeTrackIds);
    const players = playersRef.current;

    players.forEach((player, id) => {
      player.mute = !activeSet.has(id);
    });

    const startTransport = async () => {
      if (activeSet.size > 0) {
        await Tone.start();
        if (Tone.Transport.state !== "started") {
          Tone.Transport.start("+0.05");
        }
      } else if (Tone.Transport.state === "started") {
        Tone.Transport.stop();
        Tone.Transport.position = 0;
      }
    };

    void startTransport();
  }, [activeTrackIds, playersReady]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (resolvedVoiceLines.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * resolvedVoiceLines.length);
    setChelaLine(resolvedVoiceLines[randomIndex]);
  }, [activeTrackIds, resolvedVoiceLines]);

  const currentPrompt = useMemo(() => {
    const activeIds = new Set(activeTrackIds);

    for (const promptEntry of resolvedPrompts) {
      if (promptEntry.predicate({ activeIds, tracks: resolvedTracks })) {
        return promptEntry.message;
      }
    }

    if (activeIds.size === 0) {
      return "Silence is a canvas. Start stacking.";
    }

    if (activeIds.size === resolvedTracks.length) {
      return "Full stack engaged. Ride the whole machine.";
    }

    return "Keep sculpting—there are more bones to uncover.";
  }, [activeTrackIds, resolvedPrompts, resolvedTracks]);

  const handleToggle = (trackId: string) => {
    setActiveTrackIds((current) => {
      const isActive = current.includes(trackId);
      if (isActive) {
        return current.filter((id) => id !== trackId);
      }

      return [...current, trackId];
    });
  };

  return (
    <section
      className={[
        "rounded-3xl border border-gray-800 bg-[#0a0b10]/95 p-8 text-gray-100 shadow-[0_0_60px_rgba(12,12,20,0.45)]",
        "backdrop-blur",
        "font-[\"Space Grotesk\",_system-ui,\"Segoe UI\",sans-serif]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.5em] text-emerald-300/80">{title}</p>
        <h2 className="text-3xl font-semibold tracking-[0.2em] text-gray-100">What are you hearing now?</h2>
        <p className="text-sm text-gray-400">{helperText}</p>
        <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
          <span className="font-medium">{currentPrompt}</span>
        </div>
        <div className="inline-flex items-center gap-2 text-sm italic text-fuchsia-200/80">
          <span className="uppercase tracking-[0.3em] text-fuchsia-300">Chela</span>
          <span>“{chelaLine}”</span>
        </div>
      </header>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {resolvedTracks.map((track) => {
          const isActive = activeTrackIds.includes(track.id);
          const accent = track.color ?? "#38bdf8";

          return (
            <button
              key={track.id}
              type="button"
              onClick={() => handleToggle(track.id)}
              className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-[#13141d] p-5 text-left transition hover:border-gray-500/60 hover:bg-[#1a1b27]"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14">
                  <span
                    className="absolute inset-0 rounded-full border-2 border-current opacity-0 transition group-hover:opacity-40"
                    style={{ color: accent }}
                  />
                  <span
                    className={`absolute inset-0 rounded-full border border-current ${
                      isActive ? "animate-ping" : "opacity-0"
                    }`}
                    style={{ color: accent }}
                  />
                  <span
                    className="absolute inset-[6px] flex items-center justify-center rounded-full border border-gray-700 bg-[#0c0d14] text-xs uppercase tracking-[0.3em] text-gray-300"
                    style={{ color: accent }}
                  >
                    {isActive ? "ON" : "OFF"}
                  </span>
                </div>

                <div className="flex-1">
                  <p className="text-sm uppercase tracking-[0.4em] text-gray-300">{track.label}</p>
                  {track.description ? (
                    <p className="mt-2 text-xs text-gray-400">{track.description}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 h-1 overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: isActive ? "100%" : "12%",
                    backgroundImage: `linear-gradient(90deg, ${accent}, #1f2937)`,
                    boxShadow: isActive ? `0 0 18px ${accent}66` : undefined,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default LayerStack;
