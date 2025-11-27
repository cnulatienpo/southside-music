import React from "react";
import { Lane } from "../events/EventTypes";

interface Props {
  lanes: Lane[];
}

const LaneCanvas: React.FC<Props> = ({ lanes }) => (
  <div className="lane-canvas">
    {lanes.map((lane) => (
      <div key={lane.id} className="lane-canvas__lane">
        <span>{lane.name}</span>
        <span>{lane.visible ? "visible" : "hidden"}</span>
      </div>
    ))}
  </div>
);

export default LaneCanvas;
