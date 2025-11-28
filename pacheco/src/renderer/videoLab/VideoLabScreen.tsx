import React, { useEffect, useRef, useState } from 'react';
import { MediaEngine } from '../media/MediaEngine';
import { AdaptiveSubtitleEngine } from '../notation/AdaptiveSubtitleEngine';
import { LaneEngine } from '../lanes/LaneEngine';
import SubtitleOverlay from '../ui/SubtitleOverlay';
import VideoOverlay from '../ui/VideoOverlay';
import LaneCanvas from '../ui/LaneCanvas';

interface Props {
  mediaEngine: MediaEngine;
  subtitleEngine: AdaptiveSubtitleEngine;
  laneEngine: LaneEngine;
}

const VideoLabScreen: React.FC<Props> = ({ mediaEngine, subtitleEngine, laneEngine }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const subUpdate = subtitleEngine.on('subtitle-updated', () => setSubtitleIndex(0));
    const playSync = mediaEngine.on('play', () => setStatus('playing'));
    const pauseSync = mediaEngine.on('pause', () => setStatus('paused'));
    return () => {
      subUpdate();
      playSync();
      pauseSync();
    };
  }, [mediaEngine, subtitleEngine]);

  const handlePlay = () => {
    mediaEngine.play();
    videoRef.current?.play();
  };

  const handlePause = () => {
    mediaEngine.pause();
    videoRef.current?.pause();
  };

  const handleSeek = (time: number) => {
    mediaEngine.seek(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleLoad = () => {
    mediaEngine.loadMedia('local-demo.mp4');
    subtitleEngine.load(['line 1', 'line 2', 'line 3']);
    laneEngine.addLane('baseline');
    setStatus('ready');
  };

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      <div>status: {status}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={handleLoad}>load demo</button>
        <button onClick={handlePlay}>play</button>
        <button onClick={handlePause}>pause</button>
        <button onClick={() => handleSeek(0)}>seek start</button>
      </div>
      <VideoOverlay>
        <video ref={videoRef} width={320} controls>
          <source src={mediaEngine.getState().source} />
        </video>
        <SubtitleOverlay text={subtitleEngine.getCurrent(subtitleIndex)} />
      </VideoOverlay>
      <LaneCanvas lanes={laneEngine.getLanes()} />
    </div>
  );
};

export default VideoLabScreen;
