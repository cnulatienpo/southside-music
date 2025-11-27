import React, { useEffect, useMemo, useState } from "react";
import MediaPlayer from "../media/MediaPlayer";
import MediaControls from "../media/MediaControls";
import SubtitleOverlay from "./SubtitleOverlay";
import VideoOverlay from "./VideoOverlay";
import CaptureOverlay from "./CaptureOverlay";
import TimelineScrubber from "./TimelineScrubber";
import { PachecoStateManager } from "../state/PachecoStateManager";
import SliderUI from "../ui/SliderUI";
import { mapSliderToSettings } from "../notation/NotationSlider";
import LaneCanvas from "../ui/LaneCanvas";
import LineCanvas from "../ui/LineCanvas";
import SymbolCanvas from "../ui/SymbolCanvas";
import PitchCurveCanvas from "../ui/PitchCurveCanvas";
import RhythmTapUI from "../ui/RhythmTapUI";
import InspectorPanel from "../ui/InspectorPanel";
import { DiaryEngine } from "../diary/DiaryEngine";
import DiaryScreen from "../diary/DiaryScreen";
import PachecoContractConsole from "../pacheco/components/PachecoContractConsole";

const VideoLabScreen: React.FC = () => {
  const manager = useMemo(() => new PachecoStateManager(), []);
  const diary = useMemo(() => new DiaryEngine(), []);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sliderLevel, setSliderLevel] = useState(manager.settings.sliderLevel);
  const [snapshot, setSnapshot] = useState(manager.snapshot());

  useEffect(() => {
    manager.load();
    setSnapshot(manager.snapshot());
  }, [manager]);

  const handleCapture = () => {
    diary.log("event stored");
    setSnapshot(manager.snapshot());
  };

  const handleSliderChange = (value: number) => {
    setSliderLevel(value);
    const mapping = mapSliderToSettings(value);
    manager.updateSlider(mapping.level);
    setSnapshot(manager.snapshot());
  };

  return (
    <div className="video-lab">
      <div className="video-lab__left">
        <MediaPlayer onLoaded={setDuration} onTimeUpdate={setCurrentTime} />
        <MediaControls />
        <TimelineScrubber duration={duration} currentTime={currentTime} onSeek={setCurrentTime} />
        <VideoOverlay currentTime={currentTime} />
        <SubtitleOverlay events={snapshot.events} settings={snapshot.settings} library={manager.library} />
        <CaptureOverlay capture={manager.eventCapture} onCapture={handleCapture} />
      </div>
      <div className="video-lab__right">
        <SliderUI value={sliderLevel} onChange={handleSliderChange} />
        <LaneCanvas lanes={manager.laneEngine.getLanes()} />
        <LineCanvas settings={snapshot.settings} />
        <SymbolCanvas symbols={manager.library.getAll()} />
        <PitchCurveCanvas contour={undefined} />
        <RhythmTapUI engine={manager.rhythmEngine} onComplete={(fp) => diary.log(`rhythm recorded ${fp}`)} />
        <InspectorPanel events={snapshot.events} symbols={manager.library.getAll()} />
        <DiaryScreen diary={diary} />
        <PachecoContractConsole />
      </div>
    </div>
  );
};

export default VideoLabScreen;
