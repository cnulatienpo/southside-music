import React from 'react';
import { LineEvolutionEngine } from '../lines/LineEvolutionEngine';
import { NotationSlider } from './NotationSlider';
import LineCanvas from '../ui/LineCanvas';
import SliderUI from '../ui/SliderUI';

interface Props {
  lineEngine: LineEvolutionEngine;
  slider: NotationSlider;
}

const SandboxScreen: React.FC<Props> = ({ lineEngine, slider }) => {
  const state = lineEngine.getState();

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <div>notation sandbox</div>
      <SliderUI slider={slider} />
      <button onClick={() => lineEngine.applyChange({ revision: state.revision + 1 })}>bump revision</button>
      <LineCanvas state={lineEngine.getState()} />
    </div>
  );
};

export default SandboxScreen;
