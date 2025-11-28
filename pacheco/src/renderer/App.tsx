import React, { useMemo, useState } from 'react';
import VideoLabScreen from './videoLab/VideoLabScreen';
import EventEditor from './events/EventEditor';
import DiaryScreen from './diary/DiaryScreen';
import SymbolGalleryScreen from './symbols/SymbolGalleryScreen';
import SandboxScreen from './notation/SandboxScreen';
import NotationLessonScreen from './notation/NotationLessonScreen';
import { MediaEngine } from './media/MediaEngine';
import { AdaptiveSubtitleEngine } from './notation/AdaptiveSubtitleEngine';
import { LaneEngine } from './lanes/LaneEngine';
import { EventCaptureEngine } from './events/EventCaptureEngine';
import { LineEvolutionEngine } from './lines/LineEvolutionEngine';
import { NotationSlider } from './notation/NotationSlider';
import { PatternPropagationEngine } from './patterns/PatternPropagationEngine';
import { SymbolEngine } from './symbols/SymbolEngine';
import { DiaryEngine } from './diary/DiaryEngine';

const App: React.FC = () => {
  const mediaEngine = useMemo(() => new MediaEngine(), []);
  const subtitleEngine = useMemo(() => new AdaptiveSubtitleEngine(), []);
  const laneEngine = useMemo(() => new LaneEngine(), []);
  const eventEngine = useMemo(() => new EventCaptureEngine(), []);
  const lineEngine = useMemo(() => new LineEvolutionEngine(), []);
  const slider = useMemo(() => new NotationSlider(), []);
  const patternEngine = useMemo(() => new PatternPropagationEngine(), []);
  const symbolEngine = useMemo(() => new SymbolEngine(), []);
  const diaryEngine = useMemo(() => new DiaryEngine(), []);
  const [screen, setScreen] = useState('video');

  return (
    <div style={{ padding: '12px', display: 'grid', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => setScreen('video')}>video lab</button>
        <button onClick={() => setScreen('events')}>events</button>
        <button onClick={() => setScreen('diary')}>diary</button>
        <button onClick={() => setScreen('symbols')}>symbols</button>
        <button onClick={() => setScreen('sandbox')}>sandbox</button>
        <button onClick={() => setScreen('lesson')}>lesson</button>
      </div>
      {screen === 'video' && (
        <VideoLabScreen mediaEngine={mediaEngine} subtitleEngine={subtitleEngine} laneEngine={laneEngine} />
      )}
      {screen === 'events' && <EventEditor eventEngine={eventEngine} />}
      {screen === 'diary' && <DiaryScreen diaryEngine={diaryEngine} />}
      {screen === 'symbols' && <SymbolGalleryScreen symbolEngine={symbolEngine} />}
      {screen === 'sandbox' && <SandboxScreen lineEngine={lineEngine} slider={slider} />}
      {screen === 'lesson' && <NotationLessonScreen patternEngine={patternEngine} />}
    </div>
  );
};

export default App;
