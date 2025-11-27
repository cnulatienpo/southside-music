import { Lane } from "../events/EventTypes";

export class LaneVisibilityLogic {
  updateVisibility(lanes: Lane[], laneId: string, visible: boolean): Lane[] {
    return lanes.map((lane) => (lane.id === laneId ? { ...lane, visible } : lane));
  }
}
