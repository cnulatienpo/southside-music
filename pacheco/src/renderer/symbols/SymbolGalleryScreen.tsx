import React, { useState } from 'react';
import { SymbolEngine } from './SymbolEngine';
import { PachecoSymbol } from '../types';
import SymbolCanvas from '../ui/SymbolCanvas';

interface Props {
  symbolEngine: SymbolEngine;
}

const SymbolGalleryScreen: React.FC<Props> = ({ symbolEngine }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    const symbol: PachecoSymbol = { id: `sym-${Date.now()}`, name: name.trim(), description };
    symbolEngine.addSymbol(symbol);
    setName('');
    setDescription('');
  };

  const handleClear = () => {
    symbolEngine.getSymbols().forEach((sym) => symbolEngine.removeSymbol(sym.id));
  };

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <div>symbol gallery</div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="description" />
      <button onClick={handleAdd}>save symbol</button>
      <button onClick={handleClear}>clear all</button>
      <SymbolCanvas symbols={symbolEngine.getSymbols()} />
    </div>
  );
};

export default SymbolGalleryScreen;
