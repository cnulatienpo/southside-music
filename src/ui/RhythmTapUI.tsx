import React, { useState } from "react";
import { RhythmCaptureEngine } from "../rhythm/RhythmCaptureEngine";

interface Props {
  engine: RhythmCaptureEngine;
  onComplete: (fingerprint: string) => void;
}

const RhythmTapUI: React.FC<Props> = ({ engine, onComplete }) => {
  const [, force] = useState(0);

  const handleTap = () => {
    engine.recordTap(performance.now());
    force((value) => value + 1);
  };

  const handleFinish = () => {
    const result = engine.completeRecording();
    onComplete(result.fingerprint);
  };

  return (
    <div className="rhythm-tap-ui">
      <button type="button" onClick={handleTap}>
        tap
      </button>
      <button type="button" onClick={handleFinish}>
        finish
      </button>
    </div>
  );
};

export default RhythmTapUI;
