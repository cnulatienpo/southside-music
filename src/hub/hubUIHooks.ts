import { CircuitTopic } from "../circuits/circuitsTypes";
import { HubDestination, HubEngine, StoryHistoryEntry } from "./hubEngine";

export interface HubUIHooks {
  onRenderDestinations(destinations: HubDestination[]): void;
  onRenderSuggested(topics: CircuitTopic[]): void;
  onRenderRecentRuns(runs: StoryHistoryEntry[]): void;
  onStartCircuit(topic: CircuitTopic): void;
  onContinue(run: StoryHistoryEntry): void;
  onClear(): void;
  onError?(error: unknown): void;
}

export class HubUI {
  private readonly engine: HubEngine;
  private readonly hooks: HubUIHooks;
  private readonly suggestedLimit: number;

  constructor(options: { engine: HubEngine; hooks: HubUIHooks; suggestedLimit?: number }) {
    this.engine = options.engine;
    this.hooks = options.hooks;
    this.suggestedLimit = options.suggestedLimit ?? 5;
  }

  public async render(): Promise<void> {
    try {
      this.hooks.onClear();
      this.hooks.onRenderDestinations(this.engine.getHubDestinations());

      const suggestions = await this.engine.getSuggestedTopics();
      this.hooks.onRenderSuggested(suggestions.slice(0, this.suggestedLimit));

      const recentRuns = await this.engine.getRecentRuns();
      this.hooks.onRenderRecentRuns(recentRuns);
    } catch (error) {
      this.hooks.onError?.(error);
    }
  }

  public async startTopic(topic: CircuitTopic): Promise<void> {
    try {
      this.hooks.onStartCircuit(topic);
      await this.engine.startCircuit(topic);
      await this.render();
    } catch (error) {
      this.hooks.onError?.(error);
    }
  }

  public async continueLast(): Promise<void> {
    try {
      const runs = await this.engine.getRecentRuns(1);
      const latest = runs[0];
      if (!latest) {
        return;
      }
      this.hooks.onContinue(latest);
      await this.engine.continueLastRun();
      await this.render();
    } catch (error) {
      this.hooks.onError?.(error);
    }
  }
}
