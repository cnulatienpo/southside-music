import { UserDataStore } from "../data/userDataStore";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { MediaSync } from "../lib/mediaSync";
import audioEngine from "../audio/audioEngine";
import type { VisualizerEngine } from "../visual/visualizerEngine";

export type GameModeName =
  | "theft"
  | "lab"
  | "dojo"
  | "garden"
  | "bazaar"
  | "archives";

export interface GameModeConfig {
  name: GameModeName;
  displayName: string;
  description: string;
  icon?: string;
  // true = mode locked until some condition met (future)
  locked?: boolean;
}

export const GAME_MODES: GameModeConfig[] = [
  {
    name: "theft",
    displayName: "Theft Syndicate",
    description: "How to rob the fuck out of everything and everyone (within the rules).",
    icon: "💣",
  },
  {
    name: "lab",
    displayName: "The Lab",
    description: "Experiments with notes, chords, rhythm, and sound.",
    icon: "🧪",
  },
  {
    name: "dojo",
    displayName: "The Dojo",
    description: "Ear training and practice — no grades, no shame.",
    icon: "🥋",
  },
  {
    name: "garden",
    displayName: "The Garden",
    description: "Grow full songs and ideas from seeds.",
    icon: "🌱",
  },
  {
    name: "bazaar",
    displayName: "The Bazaar",
    description: "Walk through genres, cultures, and musical worlds.",
    icon: "🧿",
  },
  {
    name: "archives",
    displayName: "The Archives",
    description: "Theory cards, logs, and your entire musical crime record.",
    icon: "📚",
  },
];

export const GAME_MODE_MAP: Record<GameModeName, GameModeConfig> = GAME_MODES.reduce(
  (map, mode) => {
    map[mode.name] = mode;
    return map;
  },
  {} as Record<GameModeName, GameModeConfig>
);

export class GameModeManager {
  private userDataStore: UserDataStore;
  private deepSeek: DeepSeekEngine;
  private mediaSync: MediaSync;
  private visualizer?: VisualizerEngine | null;
  private userId: string;
  private currentMode: GameModeName;
  private modeHistory: GameModeName[];

  constructor(options: {
    userDataStore: UserDataStore;
    deepSeek: DeepSeekEngine;
    mediaSync: MediaSync;
    visualizer?: VisualizerEngine | null;
    userId: string;
    initialMode?: GameModeName;
  }) {
    this.userDataStore = options.userDataStore;
    this.deepSeek = options.deepSeek;
    this.mediaSync = options.mediaSync;
    this.visualizer = options.visualizer;
    this.userId = options.userId;
    this.currentMode = options.initialMode ?? "lab";
    this.modeHistory = [];
  }

  public async init(): Promise<void> {
    await this.userDataStore.getOrCreateProfile();
    await this.userDataStore.logSessionEvent({ userId: this.userId, type: "session_start" });
    await this.userDataStore.logModeUsage({
      userId: this.userId,
      modeName: this.currentMode,
      action: "enter",
    });
  }

  public getCurrentMode(): GameModeName {
    return this.currentMode;
  }

  public getCurrentModeConfig(): GameModeConfig {
    return GAME_MODE_MAP[this.currentMode];
  }

  public getAllModes(): GameModeConfig[] {
    return GAME_MODES;
  }

  public async switchMode(nextMode: GameModeName): Promise<void> {
    if (nextMode === this.currentMode) {
      return;
    }

    await this.userDataStore.logModeUsage({
      userId: this.userId,
      modeName: this.currentMode,
      action: "exit",
    });

    this.currentMode = nextMode;
    this.modeHistory.push(nextMode);

    await this.userDataStore.logModeUsage({
      userId: this.userId,
      modeName: nextMode,
      action: "enter",
    });

    await this.handleModeEnter(nextMode);
  }

  private async handleModeEnter(mode: GameModeName): Promise<void> {
    switch (mode) {
      case "theft":
        console.log("[GameModeManager] Entering THEFT mode.");
        await this.setupTheftMode();
        break;
      case "lab":
        console.log("[GameModeManager] Entering LAB mode.");
        await this.setupLabMode();
        break;
      case "dojo":
        console.log("[GameModeManager] Entering DOJO mode.");
        await this.setupDojoMode();
        break;
      case "garden":
        console.log("[GameModeManager] Entering GARDEN mode.");
        await this.setupGardenMode();
        break;
      case "bazaar":
        console.log("[GameModeManager] Entering BAZAAR mode.");
        await this.setupBazaarMode();
        break;
      case "archives":
        console.log("[GameModeManager] Entering ARCHIVES mode.");
        await this.setupArchivesMode();
        break;
      default:
        break;
    }
  }

  private async setupTheftMode(): Promise<void> {
    // Initialize Theft Syndicate UI, hook into DeepSeek for theft suggestions, etc.
    try {
      await this.deepSeek.generateTestFreeTestPrompt({
        userId: this.userId,
        focusArea: "theft",
      });
    } catch (error) {
      console.error("Failed to setup Theft mode", error);
    }
  }

  private async setupLabMode(): Promise<void> {
    // Set up theory cards, audio/visual lab tools, etc.
    try {
      // The Lab will be where theory cards and experiments live.
      console.log("[GameModeManager] Lab mode setup stub");
      await audioEngine.init?.();
      await audioEngine.resumeContext?.();
    } catch (error) {
      console.error("Failed to setup Lab mode", error);
    }
  }

  private async setupDojoMode(): Promise<void> {
    // Prepare ear training sessions (no grading).
    try {
      // The Dojo will manage the No-Grading + Test-Free Tests ear training system.
      console.log("[GameModeManager] Dojo mode setup stub");
      await audioEngine.init?.();
      await audioEngine.resumeContext?.();
    } catch (error) {
      console.error("Failed to setup Dojo mode", error);
    }
  }

  private async setupGardenMode(): Promise<void> {
    // Prepare song-building tools in visual/audio mode.
    try {
      // The Garden will integrate with AudioEngine + VisualizerEngine for song creation.
      console.log("[GameModeManager] Garden mode setup stub");
      await audioEngine.init?.();
      await audioEngine.resumeContext?.();
      await this.visualizer?.init?.();
    } catch (error) {
      console.error("Failed to setup Garden mode", error);
    }
  }

  private async setupBazaarMode(): Promise<void> {
    // Prepare genre/culture exploration playlists and YouTube/SoundCloud hooks.
    try {
      // The Bazaar will integrate with MediaSync for YouTube/SoundCloud exploration.
      console.log("[GameModeManager] Bazaar mode setup stub");
      await this.mediaSync.init?.();
    } catch (error) {
      console.error("Failed to setup Bazaar mode", error);
    }
  }

  private async setupArchivesMode(): Promise<void> {
    // Load user logs, theft reports, ear training history, etc.
    try {
      // The Archives will read from UserDataStore and display a friendly profile/history.
      console.log("[GameModeManager] Archives mode setup stub");
      const usageSummary = await this.userDataStore.getModeUsageSummary(this.userId);
      console.debug("Archives mode usage summary placeholder", usageSummary);
    } catch (error) {
      console.error("Failed to setup Archives mode", error);
    }
  }

  public async endSession(): Promise<void> {
    await this.userDataStore.logModeUsage({
      userId: this.userId,
      modeName: this.currentMode,
      action: "exit",
    });
    await this.userDataStore.logSessionEvent({ userId: this.userId, type: "session_end" });
  }
}

/*
Example usage:

import { UserDataStore } from "../data/userDataStore";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { MediaSync } from "../lib/mediaSync";
import { GameModeManager } from "./gameModes";

async function bootstrapGame() {
  const store = new UserDataStore();
  await store.init();

  const deepSeek = new DeepSeekEngine();
  const mediaSync = new MediaSync();

  const profile = await store.getOrCreateProfile();

  const manager = new GameModeManager({
    userDataStore: store,
    deepSeek,
    mediaSync,
    userId: profile.id,
    initialMode: "lab",
  });

  await manager.init();
  await manager.switchMode("theft"); // enter theft mode
}
*/
