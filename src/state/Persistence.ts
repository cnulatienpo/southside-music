import { PachecoEvent } from "../events/EventTypes";
import { PachecoSymbol } from "../symbols/SymbolSchema";
import { StorageKeys } from "./StorageKeys";

export class Persistence {
  saveEvents(events: PachecoEvent[]) {
    localStorage.setItem(StorageKeys.EVENTS, JSON.stringify(events));
  }

  loadEvents(): PachecoEvent[] {
    const raw = localStorage.getItem(StorageKeys.EVENTS);
    return raw ? JSON.parse(raw) : [];
  }

  saveSymbols(symbols: PachecoSymbol[]) {
    localStorage.setItem(StorageKeys.SYMBOLS, JSON.stringify(symbols));
  }

  loadSymbols(): PachecoSymbol[] {
    const raw = localStorage.getItem(StorageKeys.SYMBOLS);
    return raw ? JSON.parse(raw) : [];
  }
}
