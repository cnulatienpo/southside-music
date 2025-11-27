import React from "react";
import { PachecoEvent } from "../events/EventTypes";
import { PachecoSymbol } from "../symbols/SymbolSchema";

interface Props {
  events: PachecoEvent[];
  symbols: PachecoSymbol[];
}

const InspectorPanel: React.FC<Props> = ({ events, symbols }) => (
  <div className="inspector-panel">
    <div>
      <h4>events</h4>
      <p>{events.length}</p>
    </div>
    <div>
      <h4>symbols</h4>
      <p>{symbols.length}</p>
    </div>
  </div>
);

export default InspectorPanel;
