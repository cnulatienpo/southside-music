import React from 'react';
import { PachecoSymbol } from '../types';

interface Props {
  symbols: PachecoSymbol[];
}

const SymbolCanvas: React.FC<Props> = ({ symbols }) => {
  return (
    <div style={{ border: '1px solid #222', padding: '8px' }}>
      <div>symbols: {symbols.length || 'no symbols'}</div>
      <ul>
        {symbols.map((symbol) => (
          <li key={symbol.id}>{symbol.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SymbolCanvas;
