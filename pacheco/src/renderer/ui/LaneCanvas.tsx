import React from 'react';
import { Lane } from '../types';

interface Props {
  lanes: Lane[];
}

const LaneCanvas: React.FC<Props> = ({ lanes }) => {
  return (
    <div style={{ border: '1px solid #444', padding: '8px' }}>
      <div>lanes: {lanes.length}</div>
      <ul>
        {lanes.map((lane) => (
          <li key={lane.id}>{lane.label || lane.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default LaneCanvas;
