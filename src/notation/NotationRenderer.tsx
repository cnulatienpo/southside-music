import React from "react";
import { PachecoEvent, NotationRenderSettings } from "../events/EventTypes";
import RawSymbolRenderer from "./RawSymbolRenderer";
import HybridNotationRenderer from "./HybridNotationRenderer";
import StaffRenderer from "./StaffRenderer";
import { SymbolLibrary } from "../symbols/SymbolLibrary";

interface Props {
  events: PachecoEvent[];
  settings: NotationRenderSettings;
  library: SymbolLibrary;
}

const NotationRenderer: React.FC<Props> = ({ events, settings, library }) => {
  if (settings.showStaff) {
    return <StaffRenderer events={events} />;
  }
  if (settings.showLines || settings.showRealNoteheads) {
    return <HybridNotationRenderer events={events} />;
  }
  return <RawSymbolRenderer events={events} library={library} />;
};

export default NotationRenderer;
