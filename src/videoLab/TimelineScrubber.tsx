import React from "react";

interface Props {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
}

const TimelineScrubber: React.FC<Props> = ({ duration, currentTime, onSeek }) => (
  <div className="timeline-scrubber">
    <input
      type="range"
      min={0}
      max={duration || 1}
      step={0.01}
      value={currentTime}
      onChange={(event) => onSeek(Number(event.target.value))}
    />
    <span>
      {currentTime.toFixed(2)} / {duration ? duration.toFixed(2) : "0.00"}
    </span>
  </div>
);

export default TimelineScrubber;
