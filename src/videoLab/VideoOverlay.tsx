import React from "react";

interface Props {
  currentTime: number;
}

const VideoOverlay: React.FC<Props> = ({ currentTime }) => (
  <div className="video-overlay">time {currentTime.toFixed(1)}s</div>
);

export default VideoOverlay;
