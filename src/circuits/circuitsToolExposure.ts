import { UserDataStore } from "../data/userDataStore";
import { CircuitToolId } from "./circuitsTypes";

const EXPOSURE_KEY = "circuits_tool_exposure";

type ExposureRecord = Record<string, CircuitToolId[]>;

export class CircuitsToolExposure {
  public readonly userId: string;
  private readonly store: UserDataStore;
  private seenTools: Set<CircuitToolId> = new Set();

  constructor(options: { userId: string; store: UserDataStore }) {
    this.userId = options.userId;
    this.store = options.store;
  }

  async loadExposure(): Promise<void> {
    const exposureRecord = (await this.store.getCustomData<ExposureRecord>(EXPOSURE_KEY)) ?? {};
    const toolsForUser = exposureRecord[this.userId] ?? [];
    this.seenTools = new Set(toolsForUser);
  }

  async markSeen(toolId: CircuitToolId): Promise<void> {
    if (this.seenTools.has(toolId)) {
      return;
    }

    this.seenTools.add(toolId);
    const exposureRecord = (await this.store.getCustomData<ExposureRecord>(EXPOSURE_KEY)) ?? {};
    exposureRecord[this.userId] = Array.from(this.seenTools);
    await this.store.setCustomData(EXPOSURE_KEY, exposureRecord);
  }

  getSeenTools(): CircuitToolId[] {
    return Array.from(this.seenTools);
  }
}
