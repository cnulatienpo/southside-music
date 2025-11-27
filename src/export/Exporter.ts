import { ExportBundle } from "./ExportFormats";

export class Exporter {
  createBundle(events: unknown[], symbols: unknown[], mappings: Record<string, unknown>, progression: Record<string, unknown>): ExportBundle {
    return { events, symbols, mappings, progression };
  }
}
