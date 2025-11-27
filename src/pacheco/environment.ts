import { nanoid } from "nanoid";
import { DiaryEntry, NotationRenderSettings, PachecoEvent, SubtitleRenderData } from "./types";
import {
  AdaptiveSubtitleEngineStub,
  DiaryEngineStub,
  EventCaptureEngineStub,
  LaneEngineStub,
  LineEvolutionEngineStub,
  MediaEngineStub,
  MicCommandEngineStub,
  PatternPropagationEngineStub,
  PitchContourEngineStub,
  RhythmCaptureEngineStub,
  StateManagerStub,
  SymbolEngineStub,
} from "./engines/implementations";
import { AdaptiveSubtitleEngine, DiaryEngine, EventCaptureEngine, LaneEngine, LineEvolutionEngine, MediaEngine, MicCommandEngine, PatternPropagationEngine, PitchContourEngine, RhythmCaptureEngine, StateManager, SymbolEngine } from "./engines/contracts";

export class PachecoEnvironment {
  readonly media: MediaEngine;

  readonly lanes: LaneEngine;

  readonly lines: LineEvolutionEngine;

  readonly events: EventCaptureEngine;

  readonly rhythm: RhythmCaptureEngine;

  readonly pitch: PitchContourEngine;

  readonly symbols: SymbolEngine;

  readonly propagation: PatternPropagationEngine;

  readonly subtitles: AdaptiveSubtitleEngine;

  readonly mic: MicCommandEngine;

  readonly diary: DiaryEngine;

  readonly state: StateManager;

  constructor() {
    this.media = new MediaEngineStub();
    this.lanes = new LaneEngineStub();
    this.lines = new LineEvolutionEngineStub();
    this.events = new EventCaptureEngineStub(this.lanes);
    this.rhythm = new RhythmCaptureEngineStub();
    this.pitch = new PitchContourEngineStub();
    this.symbols = new SymbolEngineStub();
    this.propagation = new PatternPropagationEngineStub(() => this.events.getAllEvents(), this.events);
    this.subtitles = new AdaptiveSubtitleEngineStub(() => this.lanes.getLanes(), () => this.events.getAllEvents());
    this.mic = new MicCommandEngineStub();
    this.diary = new DiaryEngineStub();
    this.state = new StateManagerStub();
  }

  initialize(): void {
    this.media.onTimeUpdate((time) => {
      this.subtitles.renderFrame(time);
    });

    this.events.onEventCreated((event) => this.logEvent("created", event));
    this.events.onEventUpdated((event) => this.logEvent("updated", event));

    this.rhythm.onProfile((profile) => {
      const last = this.events.getAllEvents().slice(-1)[0];
      if (last) {
        this.events.updateEventRhythm(last.id, profile);
      }
    });

    this.lines.onLineState(() => {
      const settings: Partial<NotationRenderSettings> = { showLines: this.lines.getLineState().active };
      this.subtitles.setRenderSettings(settings);
    });

    this.state.onLevelChange((lvl) => {
      this.diary.log({ id: nanoid(), type: "level", timestamp: Date.now(), payload: { level: lvl } });
    });
  }

  renderAt(time: number): SubtitleRenderData {
    return this.subtitles.renderFrame(time);
  }

  private logEvent(type: string, event: PachecoEvent): void {
    const entry: DiaryEntry = {
      id: nanoid(),
      type: `event-${type}`,
      timestamp: event.timestamp,
      payload: event,
    };
    this.diary.log(entry);
  }
}
