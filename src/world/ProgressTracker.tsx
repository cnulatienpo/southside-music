import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type GameKey =
  | "StompLoop"
  | "TheoryCards"
  | "BandBuilder"
  | "StudioMode"
  | "TourJam";

export type ZoneKey = "Wax Town" | "Yacht Dock" | "Skyline Stage";

export type UnlockKey = "yachtDock" | "theoryLevel2" | "spark";

export interface GameProgress {
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface ZoneProgress {
  status: "locked" | "unlocked" | "complete";
  percent: number;
  unlockedAt?: string;
  lastVisitedAt?: string;
}

export interface TheoryProgress {
  level: number;
  read: string[];
  favorites: string[];
  reactions: Record<string, string | undefined>;
}

export interface BandMemberProgress {
  id: string;
  name: string;
  role: string;
  slogan?: string;
  recruitedAt: string;
  chelaApproved?: boolean;
}

export interface StudioTrackProgress {
  id: string;
  title: string;
  status: "draft" | "complete";
  createdAt: string;
  updatedAt: string;
}

export interface ProgressState {
  games: Record<GameKey, GameProgress>;
  zones: Record<ZoneKey, ZoneProgress>;
  loopsCollected: string[];
  theory: TheoryProgress;
  bandMembers: BandMemberProgress[];
  studioTracks: StudioTrackProgress[];
  unlocks: Record<UnlockKey, boolean>;
  lastSavedAt?: string;
}

export interface UnlockEvent {
  id: UnlockKey;
  title: string;
  message: string;
  badge: string;
}

const PROGRESS_STORAGE_KEY = "southside:progress";

const createDefaultProgressState = (): ProgressState => ({
  games: {
    StompLoop: { completed: false },
    TheoryCards: { completed: false },
    BandBuilder: { completed: false },
    StudioMode: { completed: false },
    TourJam: { completed: false },
  },
  zones: {
    "Wax Town": { status: "unlocked", percent: 35, unlockedAt: new Date().toISOString() },
    "Yacht Dock": { status: "locked", percent: 0 },
    "Skyline Stage": { status: "locked", percent: 0 },
  },
  loopsCollected: [],
  theory: { level: 1, read: [], favorites: [], reactions: {} },
  bandMembers: [],
  studioTracks: [],
  unlocks: {
    yachtDock: false,
    theoryLevel2: false,
    spark: false,
  },
});


const ProgressTrackerContext = createContext<ProgressTrackerContextValue | null>(null);

export interface ProgressTrackerContextValue {
  progress: ProgressState;
  completeGame: (game: GameKey, notes?: string) => void;
  addLoop: (loopId: string) => void;
  markTheoryCard: (cardId: string, reaction?: string) => void;
  toggleFavoriteTheoryCard: (cardId: string) => void;
  recruitBandMember: (member: Omit<BandMemberProgress, "recruitedAt">) => void;
  retireBandMember: (memberId: string) => void;
  saveStudioTrack: (track: { id: string; title: string; status?: "draft" | "complete" }) => void;
  removeStudioTrack: (trackId: string) => void;
  updateZoneProgress: (zone: ZoneKey, percent: number, status?: ZoneProgress["status"]) => void;
  openBinder: () => void;
  closeBinder: () => void;
  toggleBinder: () => void;
  isBinderOpen: boolean;
  resetProgress: () => void;
  hasResumeSave: boolean;
  acceptResumeSave: () => void;
}

interface ProgressTrackerProviderProps {
  children: React.ReactNode;
}

interface LoadResult {
  state: ProgressState;
  hasStored: boolean;
}

const loadProgressFromStorage = (): LoadResult => {
  const baseline = createDefaultProgressState();

  if (typeof window === "undefined") {
    return { state: baseline, hasStored: false };
  }

  const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!raw) {
    return { state: baseline, hasStored: false };
  }

  try {
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      state: {
        ...baseline,
        ...parsed,
        games: { ...baseline.games, ...parsed.games },
        zones: { ...baseline.zones, ...parsed.zones },
        unlocks: { ...baseline.unlocks, ...parsed.unlocks },
      },
      hasStored: true,
    };
  } catch (error) {
    console.warn("Failed to parse saved progress", error);
    return { state: baseline, hasStored: false };
  }
};

const applyUnlocks = (state: ProgressState): { state: ProgressState; events: UnlockEvent[] } => {
  const events: UnlockEvent[] = [];
  let nextState = state;

  const completedGames = Object.values(nextState.games).filter((game) => game.completed).length;
  if (!nextState.unlocks.yachtDock && completedGames >= 2) {
    nextState = {
      ...nextState,
      unlocks: { ...nextState.unlocks, yachtDock: true },
      zones: {
        ...nextState.zones,
        "Yacht Dock": {
          status: "unlocked",
          percent: nextState.zones["Yacht Dock"]?.percent ?? 0,
          unlockedAt: new Date().toISOString(),
        },
      },
    };
    events.push({
      id: "yachtDock",
      title: "Yacht Dock Unlocked!",
      badge: "✨",
      message: "Chela whispers: You're ready to sail soft pop seas, my dude.",
    });
  }

  const theoryReadCount = nextState.theory.read.length;
  if (!nextState.unlocks.theoryLevel2 && theoryReadCount >= 5) {
    nextState = {
      ...nextState,
      unlocks: { ...nextState.unlocks, theoryLevel2: true },
      theory: {
        ...nextState.theory,
        level: Math.max(nextState.theory.level, 2),
      },
    };
    events.push({
      id: "theoryLevel2",
      title: "Theory Level 2",
      badge: "📚",
      message: "Chela nods: You've unlocked the next layer of chord magic.",
    });
  }

  const studioComplete =
    nextState.games.StudioMode?.completed ||
    nextState.studioTracks.some((track) => track.status === "complete");
  if (!nextState.unlocks.spark && studioComplete) {
    const existingSpark = nextState.bandMembers.find((member) => member.id === "spark");
    nextState = {
      ...nextState,
      unlocks: { ...nextState.unlocks, spark: true },
      bandMembers: existingSpark
        ? nextState.bandMembers
        : [
            ...nextState.bandMembers,
            {
              id: "spark",
              name: "Spark",
              role: "Mystic Synth",
              slogan: "Spark emerges from the smoke with a chord in 11.",
              recruitedAt: new Date().toISOString(),
              chelaApproved: true,
            },
          ],
    };
    events.push({
      id: "spark",
      title: "Spark Joins the Band!",
      badge: "⚡",
      message: "Spark emerges from the smoke with a chord in 11.",
    });
  }

  return { state: nextState, events };
};

export const ProgressTrackerProvider: React.FC<ProgressTrackerProviderProps> = ({ children }) => {
  const initialLoad = useRef<LoadResult>(loadProgressFromStorage());
  const [progress, setProgress] = useState<ProgressState>(initialLoad.current.state);
  const [isBinderOpen, setBinderOpen] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(initialLoad.current.hasStored);
  const [unlockQueue, setUnlockQueue] = useState<UnlockEvent[]>([]);
  const [activeTab, setActiveTab] = useState<ProgressTab>("games");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const payload = {
      ...progress,
      lastSavedAt: new Date().toISOString(),
    } satisfies ProgressState;
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(payload));
  }, [progress]);

  const updateProgress = useCallback(
    (updater: (previous: ProgressState) => ProgressState) => {
      setProgress((previous) => {
        const updated = updater(previous);
        const { state: nextState, events } = applyUnlocks(updated);
        if (events.length > 0) {
          setUnlockQueue((queue) => [...queue, ...events]);
        }
        return nextState;
      });
    },
    []
  );

  const completeGame = useCallback(
    (game: GameKey, notes?: string) => {
      updateProgress((previous) => {
        const current = previous.games[game] ?? { completed: false };
        const completedAt = current.completedAt ?? new Date().toISOString();
        return {
          ...previous,
          games: {
            ...previous.games,
            [game]: {
              ...current,
              completed: true,
              completedAt,
              notes: notes ?? current.notes,
            },
          },
        };
      });
    },
    [updateProgress]
  );

  const addLoop = useCallback(
    (loopId: string) => {
      updateProgress((previous) => {
        if (previous.loopsCollected.includes(loopId)) {
          return previous;
        }
        return {
          ...previous,
          loopsCollected: [...previous.loopsCollected, loopId],
        };
      });
    },
    [updateProgress]
  );

  const markTheoryCard = useCallback(
    (cardId: string, reaction?: string) => {
      updateProgress((previous) => {
        const read = previous.theory.read.includes(cardId)
          ? previous.theory.read
          : [...previous.theory.read, cardId];
        return {
          ...previous,
          theory: {
            ...previous.theory,
            read,
            reactions: {
              ...previous.theory.reactions,
              [cardId]: reaction ?? previous.theory.reactions[cardId],
            },
          },
        };
      });
    },
    [updateProgress]
  );

  const toggleFavoriteTheoryCard = useCallback(
    (cardId: string) => {
      updateProgress((previous) => {
        const isFavorite = previous.theory.favorites.includes(cardId);
        return {
          ...previous,
          theory: {
            ...previous.theory,
            favorites: isFavorite
              ? previous.theory.favorites.filter((id) => id !== cardId)
              : [...previous.theory.favorites, cardId],
          },
        };
      });
    },
    [updateProgress]
  );

  const recruitBandMember = useCallback(
    (member: Omit<BandMemberProgress, "recruitedAt">) => {
      updateProgress((previous) => {
        const exists = previous.bandMembers.some((entry) => entry.id === member.id);
        if (exists) {
          return previous;
        }
        return {
          ...previous,
          bandMembers: [
            ...previous.bandMembers,
            {
              ...member,
              recruitedAt: new Date().toISOString(),
            },
          ],
        };
      });
    },
    [updateProgress]
  );

  const retireBandMember = useCallback(
    (memberId: string) => {
      updateProgress((previous) => ({
        ...previous,
        bandMembers: previous.bandMembers.filter((member) => member.id !== memberId),
      }));
    },
    [updateProgress]
  );

  const saveStudioTrack = useCallback(
    (track: { id: string; title: string; status?: "draft" | "complete" }) => {
      updateProgress((previous) => {
        const existingIndex = previous.studioTracks.findIndex((entry) => entry.id === track.id);
        const now = new Date().toISOString();
        const updatedTrack: StudioTrackProgress = existingIndex >= 0
          ? {
              ...previous.studioTracks[existingIndex],
              title: track.title,
              status: track.status ?? previous.studioTracks[existingIndex].status,
              updatedAt: now,
            }
          : {
              id: track.id,
              title: track.title,
              status: track.status ?? "draft",
              createdAt: now,
              updatedAt: now,
            };

        if (existingIndex >= 0) {
          const nextTracks = [...previous.studioTracks];
          nextTracks.splice(existingIndex, 1, updatedTrack);
          return {
            ...previous,
            studioTracks: nextTracks,
          };
        }

        return {
          ...previous,
          studioTracks: [...previous.studioTracks, updatedTrack],
        };
      });
    },
    [updateProgress]
  );

  const removeStudioTrack = useCallback(
    (trackId: string) => {
      updateProgress((previous) => ({
        ...previous,
        studioTracks: previous.studioTracks.filter((track) => track.id !== trackId),
      }));
    },
    [updateProgress]
  );

  const updateZoneProgress = useCallback(
    (zone: ZoneKey, percent: number, status?: ZoneProgress["status"]) => {
      updateProgress((previous) => {
        const current = previous.zones[zone] ?? { status: "locked", percent: 0 };
        const nextStatus = status ?? current.status;
        return {
          ...previous,
          zones: {
            ...previous.zones,
            [zone]: {
              ...current,
              percent: Math.max(0, Math.min(100, Math.round(percent))),
              status: nextStatus,
              lastVisitedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [updateProgress]
  );

  const openBinder = useCallback(() => {
    setBinderOpen(true);
    setShowResumePrompt(false);
  }, []);

  const closeBinder = useCallback(() => {
    setBinderOpen(false);
  }, []);

  const toggleBinder = useCallback(() => {
    setBinderOpen((open) => !open);
    setShowResumePrompt(false);
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(createDefaultProgressState());
    setUnlockQueue([]);
    setShowResumePrompt(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
    }
  }, []);

  const acceptResumeSave = useCallback(() => {
    setShowResumePrompt(false);
  }, []);

  const contextValue = useMemo<ProgressTrackerContextValue>(
    () => ({
      progress,
      completeGame,
      addLoop,
      markTheoryCard,
      toggleFavoriteTheoryCard,
      recruitBandMember,
      retireBandMember,
      saveStudioTrack,
      removeStudioTrack,
      updateZoneProgress,
      openBinder,
      closeBinder,
      toggleBinder,
      isBinderOpen,
      resetProgress,
      hasResumeSave: showResumePrompt,
      acceptResumeSave,
    }),
    [
      progress,
      completeGame,
      addLoop,
      markTheoryCard,
      toggleFavoriteTheoryCard,
      recruitBandMember,
      retireBandMember,
      saveStudioTrack,
      removeStudioTrack,
      updateZoneProgress,
      openBinder,
      closeBinder,
      toggleBinder,
      isBinderOpen,
      resetProgress,
      showResumePrompt,
      acceptResumeSave,
    ]
  );

  return (
    <ProgressTrackerContext.Provider value={contextValue}>
      {children}
      {showResumePrompt && !isBinderOpen && (
        <button
          type="button"
          className="fixed bottom-28 right-4 z-40 rounded-full bg-amber-200 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-amber-300"
          onClick={() => {
            setBinderOpen(true);
            acceptResumeSave();
          }}
        >
          Resume?
        </button>
      )}
      {!isBinderOpen && (
        <button
          type="button"
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-slate-900/90 px-5 py-3 text-sm font-semibold text-amber-200 shadow-xl ring-2 ring-amber-400/70 transition hover:scale-105 hover:bg-slate-900"
          onClick={openBinder}
        >
          <span role="img" aria-hidden>
            📒
          </span>
          Progress Binder
        </button>
      )}
      {isBinderOpen && (
        <ProgressBinder
          progress={progress}
          onClose={closeBinder}
          unlockQueue={unlockQueue}
          dismissUnlock={(id) =>
            setUnlockQueue((queue) => queue.filter((event) => event.id !== id))
          }
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </ProgressTrackerContext.Provider>
  );
};

export const useProgressTracker = (): ProgressTrackerContextValue => {
  const context = useContext(ProgressTrackerContext);
  if (!context) {
    throw new Error("useProgressTracker must be used within a ProgressTrackerProvider");
  }
  return context;
};

type ProgressTab = "games" | "theory" | "band" | "tour" | "tracks";

interface ProgressBinderProps {
  progress: ProgressState;
  onClose: () => void;
  unlockQueue: UnlockEvent[];
  dismissUnlock: (id: UnlockKey) => void;
  activeTab: ProgressTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ProgressTab>>;
}

const tabConfig: { id: ProgressTab; label: string; icon: string }[] = [
  { id: "games", label: "My Games", icon: "✅" },
  { id: "theory", label: "My Theory", icon: "🧠" },
  { id: "band", label: "My Band", icon: "🧑‍🎤" },
  { id: "tour", label: "My Tour", icon: "🗺️" },
  { id: "tracks", label: "My Tracks", icon: "🎛" },
];

const ProgressBinder: React.FC<ProgressBinderProps> = ({
  progress,
  onClose,
  unlockQueue,
  dismissUnlock,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 flex h-[80vh] w-[90vw] max-w-5xl flex-col overflow-hidden rounded-3xl border-4 border-amber-400 bg-amber-100 shadow-2xl">
        <div className="flex items-center justify-between bg-amber-300 px-6 py-4 text-slate-900 shadow-inner">
          <div className="flex items-center gap-3 text-lg font-black uppercase tracking-widest">
            <span role="img" aria-hidden>
              📚
            </span>
            Southside Progress Binder
          </div>
          <button
            type="button"
            className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-amber-200 shadow-md transition hover:bg-slate-800"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex flex-1">
          <aside className="flex w-56 flex-col gap-2 bg-amber-200/70 p-4">
            {tabConfig.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-slate-900 shadow-inner"
                      : "bg-amber-200/60 text-slate-600 hover:bg-amber-200 hover:text-slate-900"
                  }`}
                >
                  <span aria-hidden>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </aside>
          <section className="relative flex-1 overflow-hidden bg-white/90 p-6">
            <UnlockToasts queue={unlockQueue} dismissUnlock={dismissUnlock} />
            <div className="h-full overflow-y-auto pr-3 text-slate-900">
              {activeTab === "games" && <GamesSection progress={progress} />}
              {activeTab === "theory" && <TheorySection progress={progress} />}
              {activeTab === "band" && <BandSection progress={progress} />}
              {activeTab === "tour" && <TourSection progress={progress} />}
              {activeTab === "tracks" && <TracksSection progress={progress} />}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const UnlockToasts: React.FC<{
  queue: UnlockEvent[];
  dismissUnlock: (id: UnlockKey) => void;
}> = ({ queue, dismissUnlock }) => {
  if (queue.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute right-4 top-4 flex max-w-sm flex-col gap-3">
      {queue.map((event) => (
        <div
          key={event.id}
          className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-slate-900/90 px-4 py-3 text-amber-200 shadow-xl"
        >
          <div className="text-2xl" aria-hidden>
            {event.badge}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold uppercase tracking-wide text-amber-100">
              {event.title}
            </div>
            <div className="text-xs text-amber-200/80">{event.message}</div>
          </div>
          <button
            type="button"
            className="ml-2 text-xs font-semibold uppercase text-amber-200/70 transition hover:text-white"
            onClick={() => dismissUnlock(event.id)}
          >
            Done
          </button>
        </div>
      ))}
    </div>
  );
};

const GamesSection: React.FC<{ progress: ProgressState }> = ({ progress }) => {
  const entries = Object.entries(progress.games) as [GameKey, GameProgress][];
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900">
        My Games
      </h3>
      <p className="text-sm text-slate-500">
        Every time you crush a session, Chela stamps the page.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map(([key, value]) => {
          const statusIcon = value.completed ? "✅" : "🔒";
          const statusLabel = value.completed ? "Complete" : "In Progress";
          return (
            <div
              key={key}
              className={`flex flex-col gap-3 rounded-3xl border-2 border-dashed px-4 py-5 transition ${
                value.completed
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>{formatName(key)}</span>
                <span aria-hidden>{statusIcon}</span>
              </div>
              <div className="text-xs uppercase tracking-wide text-slate-500">
                {statusLabel}
              </div>
              {value.completedAt && (
                <div className="text-xs text-slate-400">
                  Stamped on {new Date(value.completedAt).toLocaleDateString()}
                </div>
              )}
              {value.notes && <div className="text-sm text-slate-600">{value.notes}</div>}
            </div>
          );
        })}
      </div>
      <div className="rounded-3xl bg-amber-50 p-4 text-sm text-amber-900">
        <strong className="font-semibold">Loops collected:</strong> {progress.loopsCollected.length}
        {progress.loopsCollected.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {progress.loopsCollected.map((loop) => (
              <span
                key={loop}
                className="rounded-full bg-amber-200 px-3 py-1 font-semibold text-slate-900"
              >
                {loop}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TheorySection: React.FC<{ progress: ProgressState }> = ({ progress }) => {
  const { theory } = progress;
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900">
        My Theory Deck
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-indigo-50 p-4 text-slate-800">
          <div className="text-sm font-semibold uppercase text-indigo-900">
            Level
          </div>
          <div className="mt-2 flex items-baseline gap-2 text-3xl font-black text-indigo-700">
            {theory.level}
            <span className="text-xs font-semibold uppercase text-indigo-400">
              {theory.level >= 2 ? "Unlocked" : "Beginner"}
            </span>
          </div>
          <div className="mt-2 text-xs text-indigo-500">
            Read {theory.read.length} cards · Favorited {theory.favorites.length}
          </div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-4 text-amber-100">
          <div className="text-sm font-semibold uppercase text-amber-300">Chela's Reactions</div>
          <ul className="mt-2 space-y-2 text-sm">
            {theory.read.length === 0 && <li>No cards read yet. Flip a page!</li>}
            {theory.read.map((cardId) => (
              <li key={cardId} className="flex items-center justify-between gap-2">
                <span>{cardId}</span>
                <span className="text-xs uppercase tracking-wide text-amber-400">
                  {theory.favorites.includes(cardId) ? "✨ Favorite" : "Read"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const BandSection: React.FC<{ progress: ProgressState }> = ({ progress }) => {
  const { bandMembers } = progress;
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900">
        My Bandmates
      </h3>
      {bandMembers.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
          Recruit some players to start the groove.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {bandMembers.map((member) => (
            <div key={member.id} className="rounded-3xl bg-rose-50 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-rose-900">{member.name}</div>
                <div className="text-xl" aria-hidden>
                  {member.chelaApproved ? "🐾" : "🎵"}
                </div>
              </div>
              <div className="text-xs uppercase tracking-wide text-rose-400">{member.role}</div>
              {member.slogan && <div className="mt-2 text-sm text-rose-700">{member.slogan}</div>}
              <div className="mt-3 text-xs text-rose-400">
                Joined {new Date(member.recruitedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TourSection: React.FC<{ progress: ProgressState }> = ({ progress }) => {
  const zones = Object.entries(progress.zones) as [ZoneKey, ZoneProgress][];
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900">
        My Tour Map
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {zones.map(([zone, details]) => {
          const isLocked = details.status === "locked";
          const isComplete = details.status === "complete";
          const badge = isLocked ? "🔒" : isComplete ? "✅" : "✨";
          const statusLabel = isLocked ? "Locked" : isComplete ? "Complete" : "Unlocked";
          return (
            <div key={zone} className="rounded-3xl bg-slate-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-slate-800">{zone}</div>
                <span aria-hidden>{badge}</span>
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                {statusLabel}
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-300">
                <div
                  className={`h-full rounded-full ${
                    isComplete ? "bg-emerald-400" : isLocked ? "bg-slate-400" : "bg-amber-400"
                  }`}
                  style={{ width: `${details.percent}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-500">{details.percent}% complete</div>
              {details.lastVisitedAt && (
                <div className="mt-1 text-[11px] text-slate-400">
                  Last visit: {new Date(details.lastVisitedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TracksSection: React.FC<{ progress: ProgressState }> = ({ progress }) => {
  const { studioTracks } = progress;
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900">
        My Studio Tracks
      </h3>
      {studioTracks.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
          Build some grooves in Studio Mode to see them here.
        </div>
      ) : (
        <div className="space-y-3">
          {studioTracks.map((track) => {
            const isComplete = track.status === "complete";
            return (
              <div
                key={track.id}
                className="flex items-center justify-between rounded-3xl bg-slate-900/90 px-4 py-3 text-amber-100"
              >
                <div>
                  <div className="text-lg font-semibold">{track.title}</div>
                  <div className="text-xs uppercase tracking-wide text-amber-400">
                    {isComplete ? "Complete" : "Draft"}
                  </div>
                </div>
                <div className="text-right text-xs text-amber-300">
                  Saved {new Date(track.updatedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const formatName = (input: string): string =>
  input.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b([A-Z]+)\b/g, (match) => match);

