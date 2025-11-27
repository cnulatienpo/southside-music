import React from "react";
import { PachecoEvent } from "../events/EventTypes";

interface Props {
  events: PachecoEvent[];
}

const StaffRenderer: React.FC<Props> = ({ events }) => (
  <div className="staff-renderer">
    {events.map((event) => (
      <div key={event.id} className="staff-renderer__note">
        <span>{event.pitchProfile || "note"}</span>
        <small>{event.timestamp.toFixed(0)}ms</small>
      </div>
    ))}
  </div>
);

export default StaffRenderer;
