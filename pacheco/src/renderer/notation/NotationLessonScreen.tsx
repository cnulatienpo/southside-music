import React from 'react';
import { PatternPropagationEngine } from '../patterns/PatternPropagationEngine';

interface Props {
  patternEngine: PatternPropagationEngine;
}

const NotationLessonScreen: React.FC<Props> = ({ patternEngine }) => {
  const handlePropagate = () => {
    patternEngine.propagate();
  };

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <div>notation lesson</div>
      <button onClick={() => patternEngine.ingest([])}>ingest placeholder</button>
      <button onClick={handlePropagate}>propagate</button>
      <div>queued events: {patternEngine.getQueuedCount()}</div>
    </div>
  );
};

export default NotationLessonScreen;
