import React from 'react';

interface Props {
  points: Array<{ time: number; value: number }>;
}

const PitchCurveCanvas: React.FC<Props> = ({ points }) => {
  return (
    <div style={{ border: '1px dashed #555', padding: '8px' }}>
      <div>pitch points: {points.length}</div>
    </div>
  );
};

export default PitchCurveCanvas;
