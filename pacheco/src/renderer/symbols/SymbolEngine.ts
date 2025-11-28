import { PachecoSymbol } from '../types';

type SymbolEvent = 'symbol-added' | 'symbol-removed' | 'symbol-updated';

export interface ISymbolEngine {
  addSymbol(symbol: PachecoSymbol): void;
  removeSymbol(id: string): void;
  updateSymbol(symbol: PachecoSymbol): void;
  getSymbols(): PachecoSymbol[];
  on(event: SymbolEvent, handler: (symbols: PachecoSymbol[]) => void): () => void;
}

export class SymbolEngine implements ISymbolEngine {
  private symbols: PachecoSymbol[] = [];
  private subscribers: Map<SymbolEvent, Set<(symbols: PachecoSymbol[]) => void>> = new Map();

  constructor() {
    ['symbol-added', 'symbol-removed', 'symbol-updated'].forEach((evt) =>
      this.subscribers.set(evt as SymbolEvent, new Set()),
    );
  }

  addSymbol(symbol: PachecoSymbol): void {
    this.symbols.push(symbol);
    this.emit('symbol-added');
  }

  removeSymbol(id: string): void {
    this.symbols = this.symbols.filter((s) => s.id !== id);
    this.emit('symbol-removed');
  }

  updateSymbol(symbol: PachecoSymbol): void {
    this.symbols = this.symbols.map((s) => (s.id === symbol.id ? symbol : s));
    this.emit('symbol-updated');
  }

  getSymbols(): PachecoSymbol[] {
    return [...this.symbols];
  }

  on(event: SymbolEvent, handler: (symbols: PachecoSymbol[]) => void): () => void {
    const bucket = this.subscribers.get(event);
    if (!bucket) return () => undefined;
    bucket.add(handler);
    return () => bucket.delete(handler);
  }

  private emit(event: SymbolEvent) {
    const bucket = this.subscribers.get(event);
    if (!bucket) return;
    const snapshot = this.getSymbols();
    bucket.forEach((handler) => handler(snapshot));
  }
}
