import { PachecoSymbol } from "./SymbolSchema";

export class SymbolLibrary {
  private symbols: Map<string, PachecoSymbol> = new Map();

  add(symbol: PachecoSymbol) {
    this.symbols.set(symbol.id, symbol);
  }

  getAll(): PachecoSymbol[] {
    return Array.from(this.symbols.values());
  }

  findByFingerprint(fingerprint: string): PachecoSymbol | undefined {
    return this.getAll().find((symbol) => symbol.fingerprint === fingerprint);
  }
}
