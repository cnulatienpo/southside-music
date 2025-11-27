import React from "react";
import { PachecoEvent } from "../events/EventTypes";
import { SymbolLibrary } from "../symbols/SymbolLibrary";

interface Props {
  events: PachecoEvent[];
  library: SymbolLibrary;
}

const RawSymbolRenderer: React.FC<Props> = ({ events, library }) => (
  <div className="raw-symbol-renderer">
    {events.map((event) => {
      const symbol = event.symbolId ? library.getAll().find((s) => s.id === event.symbolId) : undefined;
      return (
        <div key={event.id} className="raw-symbol-renderer__event">
          <span>{event.timestamp.toFixed(0)}ms</span>
          <span>{symbol ? symbol.fingerprint || symbol.id : "?"}</span>
        </div>
      );
    })}
  </div>
);

export default RawSymbolRenderer;
