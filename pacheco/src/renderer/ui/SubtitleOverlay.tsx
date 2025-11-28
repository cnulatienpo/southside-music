import React from 'react';

interface Props {
  text?: string;
}

const SubtitleOverlay: React.FC<Props> = ({ text }) => {
  return (
    <div style={{ position: 'relative', padding: '8px', border: '1px solid #111' }}>
      <div>subtitle</div>
      <div>{text || 'no subtitle'}</div>
    </div>
  );
};

export default SubtitleOverlay;
