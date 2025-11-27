import { nanoid } from "nanoid";
import { PachecoSymbol, Stroke } from "./SymbolSchema";
import { SymbolLibrary } from "./SymbolLibrary";

export class SymbolEngine {
  constructor(private library: SymbolLibrary) {}

  createSymbol(strokes: Stroke[], fingerprint?: string): PachecoSymbol {
    const symbol: PachecoSymbol = {
      id: nanoid(),
      strokes,
      fingerprint,
    };
    this.library.add(symbol);
    return symbol;
  }

  linkProfiles(symbolId: string, profiles: Partial<PachecoSymbol>) {
    const existing = this.library.getAll().find((sym) => sym.id === symbolId);
    if (!existing) return;
    this.library.add({ ...existing, ...profiles });
  }
}
