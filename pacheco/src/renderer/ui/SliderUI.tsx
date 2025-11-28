import React, { useEffect, useState } from 'react';
import { NotationSlider } from '../notation/NotationSlider';

interface Props {
  slider: NotationSlider;
}

const SliderUI: React.FC<Props> = ({ slider }) => {
  const [value, setValue] = useState(slider.getValue());

  useEffect(() => {
    const unsubscribe = slider.on('changed', setValue);
    return unsubscribe;
  }, [slider]);

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => slider.setValue(Number(e.target.value))}
      />
      <span>{value}</span>
    </div>
  );
};

export default SliderUI;
