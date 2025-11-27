import React from "react";
import { EventCaptureEngine } from "../events/EventCaptureEngine";

interface Props {
  capture: EventCaptureEngine;
  onCapture: () => void;
}

const CaptureOverlay: React.FC<Props> = ({ capture, onCapture }) => (
  <div className="capture-overlay">
    <button
      type="button"
      onClick={() => {
        capture.captureFromUi({ origin: "ui", value: performance.now() }, "lane-1");
        onCapture();
      }}
    >
      capture
    </button>
  </div>
);

export default CaptureOverlay;
