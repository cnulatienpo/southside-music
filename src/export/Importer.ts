import { ExportBundle } from "./ExportFormats";

export class Importer {
  merge(current: ExportBundle, incoming: ExportBundle): ExportBundle {
    return {
      symbols: [...current.symbols, ...incoming.symbols],
      events: [...current.events, ...incoming.events],
      mappings: { ...current.mappings, ...incoming.mappings },
      progression: { ...current.progression, ...incoming.progression },
    };
  }
}
