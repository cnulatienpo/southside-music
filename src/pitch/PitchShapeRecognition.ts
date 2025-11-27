import { PitchStrokePoint } from "./PitchContourEngine";

export const classifyShape = (points: PitchStrokePoint[]): string => {
  if (points.length < 2) return "flat";
  const delta = points[points.length - 1].y - points[0].y;
  if (delta > 5) return "down";
  if (delta < -5) return "up";
  return "flat";
};
