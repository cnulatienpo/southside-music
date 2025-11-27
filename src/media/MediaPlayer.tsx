import React, { useRef, useState } from "react";

interface Props {
  onLoaded?: (duration: number) => void;
  onTimeUpdate?: (time: number) => void;
}

const MediaPlayer: React.FC<Props> = ({ onLoaded, onTimeUpdate }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [sourceName, setSourceName] = useState<string>("");

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    if (videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.onloadedmetadata = () => {
        setSourceName(file.name);
        onLoaded?.(videoRef.current?.duration || 0);
      };
    }
  };

  return (
    <div className="media-player">
      <input
        type="file"
        accept="video/*,audio/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <p>{sourceName || "no media"}</p>
      <video
        ref={videoRef}
        controls
        width="100%"
        onTimeUpdate={() => onTimeUpdate?.(videoRef.current?.currentTime || 0)}
      />
    </div>
  );
};

export default MediaPlayer;
