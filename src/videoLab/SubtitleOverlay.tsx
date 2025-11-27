import React from "react";
import { PachecoEvent, NotationRenderSettings } from "../events/EventTypes";
import NotationRenderer from "../notation/NotationRenderer";
import { SymbolLibrary } from "../symbols/SymbolLibrary";

interface Props {
  events: PachecoEvent[];
  settings: NotationRenderSettings;
  library: SymbolLibrary;
}

const SubtitleOverlay: React.FC<Props> = ({ events, settings, library }) => (
  <div className="subtitle-overlay">
    <NotationRenderer events={events} settings={settings} library={library} />
  </div>
);

export default SubtitleOverlay;
