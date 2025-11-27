import React from "react";
import { PachecoSymbol } from "./SymbolSchema";

interface Props {
  symbol: PachecoSymbol;
}

const SymbolPreview: React.FC<Props> = ({ symbol }) => (
  <div className="symbol-preview">
    <p>symbol {symbol.id}</p>
    <p>strokes: {symbol.strokes.length}</p>
    {symbol.fingerprint && <p>fp: {symbol.fingerprint}</p>}
  </div>
);

export default SymbolPreview;
