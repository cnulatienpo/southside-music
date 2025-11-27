import { nanoid } from "nanoid";
import { Lane } from "../events/EventTypes";
import { LanePitchMapping } from "./LanePitchMapping";
import { LaneVisibilityLogic } from "./LaneVisibilityLogic";

export class LaneEngine {
  private lanes: Lane[] = [];

  private mapping = new LanePitchMapping();

  private visibility = new LaneVisibilityLogic();

  addLane(name: string): Lane {
    const lane: Lane = { id: nanoid(), name, visible: true, zOrder: this.lanes.length };
    this.lanes.push(lane);
    return lane;
  }

  assignLaneFromPitch(pitch: number): Lane {
    const laneId = this.mapping.getLaneForPitch(pitch);
    const lane = this.lanes.find((l) => l.id === laneId);
    if (lane) return lane;
    return this.addLane(`lane-${pitch}`);
  }

  toggleVisibility(laneId: string, visible: boolean) {
    this.lanes = this.visibility.updateVisibility(this.lanes, laneId, visible);
  }

  getLanes() {
    return [...this.lanes];
  }
}
