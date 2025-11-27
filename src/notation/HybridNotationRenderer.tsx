import React from "react";
import { PachecoEvent } from "../events/EventTypes";

interface Props {
  events: PachecoEvent[];
}

const HybridNotationRenderer: React.FC<Props> = ({ events }) => (
  <div className="hybrid-notation">
    {events.map((event) => (
      <div key={event.id} className="hybrid-notation__event">
        <span>{event.laneId}</span>
        <span>{event.pitchProfile || "?"}</span>
        <span>{event.rhythmProfile ? event.rhythmProfile.join(",") : "tap"}</span>
      </div>
    ))}
  </div>
);

export default HybridNotationRenderer;
