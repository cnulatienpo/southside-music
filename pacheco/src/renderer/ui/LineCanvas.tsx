import React from 'react';
import { LineState } from '../types';

interface Props {
  state: LineState;
}

const LineCanvas: React.FC<Props> = ({ state }) => {
  return (
    <div style={{ border: '1px solid #666', padding: '8px', marginTop: '8px' }}>
      <div>line id: {state.id}</div>
      <div>revision: {state.revision}</div>
    </div>
  );
};

export default LineCanvas;
