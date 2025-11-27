import { nanoid } from "nanoid";
import { DiaryEntry } from "./DiaryEventTypes";

export class DiaryEngine {
  private entries: DiaryEntry[] = [];

  log(message: string) {
    this.entries.push({ id: nanoid(), timestamp: performance.now(), message });
  }

  getEntries(): DiaryEntry[] {
    return [...this.entries];
  }
}
