import React from "react";
import { NotationRenderSettings } from "../events/EventTypes";
import { describeLines } from "../lines/LineRenderLogic";

interface Props {
  settings: NotationRenderSettings;
}

const LineCanvas: React.FC<Props> = ({ settings }) => (
  <div className="line-canvas">lines: {describeLines(settings)}</div>
);

export default LineCanvas;
