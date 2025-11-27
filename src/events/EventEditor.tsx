import React, { useState } from "react";
import { PachecoEvent } from "./EventTypes";

interface Props {
  event: PachecoEvent;
  onSave: (event: PachecoEvent) => void;
}

const EventEditor: React.FC<Props> = ({ event, onSave }) => {
  const [laneId, setLaneId] = useState(event.laneId);

  const handleSave = () => {
    onSave({ ...event, laneId });
  };

  return (
    <div className="event-editor">
      <div className="event-editor__row">
        <label htmlFor="lane">lane</label>
        <input
          id="lane"
          type="text"
          value={laneId}
          onChange={(e) => setLaneId(e.target.value)}
        />
      </div>
      <button type="button" onClick={handleSave}>
        save event
      </button>
    </div>
  );
};

export default EventEditor;
