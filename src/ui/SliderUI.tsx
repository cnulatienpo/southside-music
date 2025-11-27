import React from "react";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const SliderUI: React.FC<Props> = ({ value, onChange }) => (
  <div className="slider-ui">
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
    <span>{value}</span>
  </div>
);

export default SliderUI;
