import React from "react";
import { PachecoSymbol } from "../symbols/SymbolSchema";

interface Props {
  symbols: PachecoSymbol[];
}

const SymbolCanvas: React.FC<Props> = ({ symbols }) => (
  <div className="symbol-canvas">
    {symbols.map((symbol) => (
      <div key={symbol.id} className="symbol-canvas__entry">
        <span>{symbol.id}</span>
        <span>{symbol.strokes.length} strokes</span>
      </div>
    ))}
  </div>
);

export default SymbolCanvas;
