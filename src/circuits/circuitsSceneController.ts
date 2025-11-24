import { UserDataStore } from "../data/userDataStore";
import { CircuitsToolExposure } from "./circuitsToolExposure";
import { CircuitContext, CircuitTopic } from "./circuitsTypes";

export class CircuitsSceneController {
  private readonly toolExposure: CircuitsToolExposure;
  private readonly store: UserDataStore;
  private readonly userId: string;

  constructor(options: { toolExposure: CircuitsToolExposure; store: UserDataStore; userId: string }) {
    this.toolExposure = options.toolExposure;
    this.store = options.store;
    this.userId = options.userId;
  }

  async buildContext(topic: CircuitTopic): Promise<CircuitContext> {
    await this.toolExposure.loadExposure();
    const seenTools = this.toolExposure.getSeenTools();
    const level = this.determineLevel(seenTools.length);

    return {
      topic,
      level,
      seenTools,
    };
  }

  private determineLevel(count: number): CircuitContext["level"] {
    if (count < 3) {
      return "basic";
    }
    if (count <= 7) {
      return "intermediate";
    }
    return "advanced";
  }
}
