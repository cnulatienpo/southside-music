import { CircuitTopic } from "../circuits/circuitsTypes";
import { HubDestination, HubEngine, StoryHistoryEntry } from "./hubEngine";

export interface HubUIHooks {
  onRenderDestinations?: (destinations: HubDestination[]) => void;
  onRenderSuggested?: (topics: CircuitTopic[]) => void;
  onRenderRecentRuns?: (runs: StoryHistoryEntry[]) => void;
  onStartCircuit?: (topic: CircuitTopic) => void;
  onContinue?: (run: StoryHistoryEntry) => void;
  onClear?: () => void;
  onError?: (message: string) => void;
}

export class HubUI {
  private readonly engine: HubEngine;
  private readonly hooks: HubUIHooks;

  constructor(engine: HubEngine, hooks: HubUIHooks) {
    this.engine = engine;
    this.hooks = hooks;
  }

  async render(): Promise<void> {
    await this.safeExecute(async () => {
      this.hooks.onClear?.();
      this.hooks.onRenderDestinations?.(this.engine.getHubDestinations());
      this.hooks.onRenderSuggested?.(await this.engine.getSuggestedTopics());
      this.hooks.onRenderRecentRuns?.(await this.engine.getRecentRuns());
    });
  }

  async start(topic: CircuitTopic): Promise<void> {
    await this.safeExecute(async () => {
      await this.engine.startCircuit(topic);
      this.hooks.onStartCircuit?.(topic);
      await this.render();
    });
  }

  async continueLast(): Promise<void> {
    await this.safeExecute(async () => {
      const runs = await this.engine.getRecentRuns(1);
      const latest = runs[0];
      const chain = await this.engine.continueLastRun();
      if (!chain) {
        this.hooks.onError?.("No recent runs to continue.");
        return;
      }

      if (latest) {
        this.hooks.onContinue?.(latest);
      }
      await this.render();
    });
  }

  clear(): void {
    this.hooks.onClear?.();
  }

  private async safeExecute(operation: () => Promise<void>): Promise<void> {
    try {
      await operation();
    } catch (error) {
      console.error("Hub UI operation failed", error);
      this.hooks.onError?.(
        "The hallway lights flickered. Try that action again in a second."
      );
    }
  }
}
