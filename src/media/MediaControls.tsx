import React from "react";

interface Props {
  onLoopToggle?: () => void;
  onRateChange?: (rate: number) => void;
}

const MediaControls: React.FC<Props> = ({ onLoopToggle, onRateChange }) => (
  <div className="media-controls">
    <button type="button" onClick={onLoopToggle}>
      loop
    </button>
    <label htmlFor="rate">rate</label>
    <input
      id="rate"
      type="range"
      min={0.5}
      max={1.5}
      step={0.1}
      defaultValue={1}
      onChange={(event) => onRateChange?.(Number(event.target.value))}
    />
  </div>
);

export default MediaControls;
