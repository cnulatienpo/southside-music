import { PachecoEvent, NotationRenderSettings } from "../events/EventTypes";
import { LineEvolutionEngine } from "../lines/LineEvolutionEngine";
import { LaneEngine } from "../lanes/LaneEngine";
import { EventCaptureEngine } from "../events/EventCaptureEngine";
import { RhythmCaptureEngine } from "../rhythm/RhythmCaptureEngine";
import { PitchContourEngine, PitchContour } from "../pitch/PitchContourEngine";
import { SymbolLibrary } from "../symbols/SymbolLibrary";
import { Persistence } from "./Persistence";
import { PatternPropagationEngine } from "../patterns/PatternPropagationEngine";

export interface PachecoStateSnapshot {
  events: PachecoEvent[];
  settings: NotationRenderSettings;
}

export class PachecoStateManager {
  readonly library = new SymbolLibrary();

  readonly events: PachecoEvent[] = [];

  readonly settings: NotationRenderSettings = {
    sliderLevel: 0,
    showLines: false,
    showStaff: false,
    showRealNoteheads: false,
    showUserSymbols: true,
    snapPitch: false,
    snapRhythm: false,
  };

  readonly laneEngine = new LaneEngine();

  readonly lineEngine = new LineEvolutionEngine();

  readonly rhythmEngine = new RhythmCaptureEngine();

  readonly pitchEngine = new PitchContourEngine();

  readonly patternEngine = new PatternPropagationEngine();

  readonly eventCapture = new EventCaptureEngine((event) => this.storeEvent(event));

  private persistence = new Persistence();

  constructor() {
    this.laneEngine.addLane("high");
    this.laneEngine.addLane("mid");
    this.laneEngine.addLane("low");
    this.laneEngine.addLane("bass");
  }

  storeEvent(event: PachecoEvent) {
    this.events.push(event);
    this.persistence.saveEvents(this.events);
  }

  addPropagation(fingerprint: string) {
    const clones = this.patternEngine.propagate(this.events, fingerprint);
    clones.forEach((event) => this.events.push(event));
    this.persistence.saveEvents(this.events);
  }

  captureRhythmTap(timestamp: number) {
    this.rhythmEngine.recordTap(timestamp);
  }

  finalizeRhythm() {
    return this.rhythmEngine.completeRecording();
  }

  capturePitch(points: PitchContour["points"]): PitchContour {
    return this.pitchEngine.capture(points);
  }

  updateSlider(level: number) {
    this.settings.sliderLevel = level;
    const updated = this.lineEngine.advance(this.settings);
    Object.assign(this.settings, updated);
    return this.settings;
  }

  load() {
    const events = this.persistence.loadEvents();
    events.forEach((event) => this.events.push(event));
    const symbols = this.persistence.loadSymbols();
    symbols.forEach((symbol) => this.library.add(symbol));
  }

  snapshot(): PachecoStateSnapshot {
    return {
      events: [...this.events],
      settings: { ...this.settings },
    };
  }
}
