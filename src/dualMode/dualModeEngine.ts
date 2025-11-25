import { AudioEvent, AudioMusicModel } from "./audioMusicModel";
import { ShapeObject, VisualMusicModel } from "./visualMusicModel";
import { ShapeSoundMapper } from "./shapeSoundMapper";

export type DualMode = "visual" | "audio" | "dual";

export interface MediaSync {
  init?(): Promise<void> | void;
  snapshot(): { currentTime: number; isYouTube: boolean; fft?: Uint8Array };
}

export interface VisualizerEngine {
  updateFromMedia(time: number, fft?: Uint8Array): void;
  renderShapes(shapes: ShapeObject[], mode: DualMode): void;
}

export interface DeepSeekEngine {
  suggestShapes(audioEvents: AudioEvent[]): ShapeObject[];
  suggestAudio(shapes: ShapeObject[]): AudioEvent[];
}

interface ConstructorOptions {
  visualModel: VisualMusicModel;
  audioModel: AudioMusicModel;
  mapper: ShapeSoundMapper;
  mediaSync: MediaSync;
  visualizerEngine: VisualizerEngine;
  deepSeek: DeepSeekEngine;
}

/**
 * DualModeEngine orchestrates visual and audio creation flows while
 * respecting YouTube's TOS: audio is never intercepted or manipulated; only
 * currentTime and live FFT data from an AnalyzerNode are consumed.
 */
export class DualModeEngine {
  private mode: DualMode = "dual";
  private visualModel: VisualMusicModel;
  private audioModel: AudioMusicModel;
  private mapper: ShapeSoundMapper;
  private mediaSync: MediaSync;
  private visualizerEngine: VisualizerEngine;
  private deepSeek: DeepSeekEngine;

  constructor(options: ConstructorOptions) {
    this.visualModel = options.visualModel;
    this.audioModel = options.audioModel;
    this.mapper = options.mapper;
    this.mediaSync = options.mediaSync;
    this.visualizerEngine = options.visualizerEngine;
    this.deepSeek = options.deepSeek;
  }

  setMode(mode: DualMode): void {
    this.mode = mode;
    const shapes = this.visualModel.getAllShapes();
    this.visualizerEngine.renderShapes(shapes, mode);
  }

  applyVisualEdit(shape: ShapeObject): void {
    this.visualModel.updateShape(shape.id, shape);
    const audioEvents = this.mapper.shapeToSound(shape);

    if (this.mode !== "visual") {
      audioEvents.forEach((event) => this.audioModel.updateEvent(event.id, event));
    }

    if (this.mode !== "audio") {
      this.visualizerEngine.renderShapes(this.visualModel.getAllShapes(), this.mode);
    }
  }

  applyAudioEdit(event: AudioEvent): void {
    this.audioModel.updateEvent(event.id, event);
    const shape = this.mapper.soundToShape(event);

    if (this.mode !== "audio") {
      this.visualModel.updateShape(shape.id, shape);
      this.visualizerEngine.renderShapes(this.visualModel.getAllShapes(), this.mode);
    }
  }

  syncWithMedia(): void {
    const snapshot = this.mediaSync.snapshot();
    if (snapshot.isYouTube) {
      // Only read timestamps and FFT data—no audio manipulation per YouTube TOS.
      this.visualizerEngine.updateFromMedia(snapshot.currentTime, snapshot.fft);
    }
  }

  tick(): void {
    this.syncWithMedia();
    const shapes = this.visualModel.getAllShapes();
    if (this.mode !== "audio") {
      this.visualizerEngine.renderShapes(shapes, this.mode);
    }

    if (this.mode !== "visual") {
      const suggestedShapes = this.deepSeek.suggestShapes(this.audioModel.getEvents());
      suggestedShapes.forEach((shape) => this.visualModel.updateShape(shape.id, shape));
    }
  }
}
