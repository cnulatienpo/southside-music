import { nanoid } from "nanoid";
import { classifyShape } from "./PitchShapeRecognition";

export interface PitchStrokePoint {
  x: number;
  y: number;
}

export interface PitchContour {
  id: string;
  points: PitchStrokePoint[];
  profile: string;
}

export class PitchContourEngine {
  capture(points: PitchStrokePoint[]): PitchContour {
    const profile = classifyShape(points);
    return { id: nanoid(), points, profile };
  }
}
