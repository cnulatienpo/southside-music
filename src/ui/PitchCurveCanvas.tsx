import React from "react";
import { PitchContour } from "../pitch/PitchContourEngine";

interface Props {
  contour?: PitchContour;
}

const PitchCurveCanvas: React.FC<Props> = ({ contour }) => (
  <div className="pitch-curve-canvas">{contour ? contour.profile : "no contour"}</div>
);

export default PitchCurveCanvas;
