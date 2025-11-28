import React from 'react';

interface Props {
  children?: React.ReactNode;
}

const VideoOverlay: React.FC<Props> = ({ children }) => {
  return (
    <div style={{ position: 'relative', border: '1px solid #000', padding: '8px' }}>
      <div>video overlay</div>
      <div>{children}</div>
    </div>
  );
};

export default VideoOverlay;
