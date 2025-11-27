import { NotationRenderSettings } from "../events/EventTypes";

export const describeLines = (settings: NotationRenderSettings): string => {
  if (settings.showStaff) return "staff";
  if (settings.showLines) return "guides";
  return "none";
};
