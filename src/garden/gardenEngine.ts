import { nanoid } from "nanoid";
import { DeepSeekEngine } from "../lib/deepSeekEngine";
import { UserDataStore } from "../data/userDataStore";
import { AudioEvent, AudioMusicModel } from "../dualMode/audioMusicModel";
import { ShapeObject, VisualMusicModel } from "../dualMode/visualMusicModel";
import { ShapeSoundMapper } from "../dualMode/shapeSoundMapper";
import { GardenSoundworld } from "./gardenSoundworld";
import { analyzeSeed, SeedAnalysis } from "./gardenHeuristics";

export type GardenSeedPayload = {
  motionPattern: string;
  textureProfile: string;
  tonalPalette: string[];
  rhythmicShape: string;
  energyCurve: string;
};

export type GardenStartResponse = {
  seed: GardenSeedPayload;
  analysis: SeedAnalysis;
  suggestedShapes: ShapeObject[];
  suggestedAudio: AudioEvent[];
  followUpHint?: string | null;
};

export type GardenEditResponse = {
  shapes: ShapeObject[];
  audio: AudioEvent[];
  note?: string;
};

export type GardenImprovResponse = {
  improvisedEvents: AudioEvent[];
  shapes: ShapeObject[];
  gestureSummary: string;
};

type ConstructorOptions = {
  userId: string;
  deepSeek: DeepSeekEngine;
  store: UserDataStore;
  audioModel: AudioMusicModel;
  visualModel: VisualMusicModel;
  mapper: ShapeSoundMapper;
};

type UserGesture = {
  mode: "draw" | "tap" | "hum" | "knock" | "gesture";
  detail?: string;
  velocity?: number;
  density?: number;
  durationMs?: number;
};

type AudioGesture = {
  contour?: number[];
  hits?: number;
  color?: string;
};

export class GardenEngine {
  private userId: string;
  private deepSeek: DeepSeekEngine;
  private store: UserDataStore;
  private audioModel: AudioMusicModel;
  private visualModel: VisualMusicModel;
  private mapper: ShapeSoundMapper;
  private soundworld: GardenSoundworld;
  private lastSeedText: string | undefined;

  constructor(options: ConstructorOptions) {
    this.userId = options.userId;
    this.deepSeek = options.deepSeek;
    this.store = options.store;
    this.audioModel = options.audioModel;
    this.visualModel = options.visualModel;
    this.mapper = options.mapper;
    this.soundworld = new GardenSoundworld();
    this.soundworld.loadDefaultUrbanSet();
  }

  async startIdea(seedText?: string): Promise<GardenStartResponse> {
    const text = seedText?.trim() || "industrial greenhouse spark";
    this.lastSeedText = text;
    const analysis = analyzeSeed(text);
    const tonalPalette = this.deriveTonalPalette(analysis);
    const seedPayload: GardenSeedPayload = {
      motionPattern: analysis.motionPattern,
      textureProfile: `${analysis.textureProfile} near ${analysis.environmentalCue}`,
      tonalPalette,
      rhythmicShape: analysis.rhythmicShape,
      energyCurve: this.deriveEnergyCurve(analysis.intensity),
    };

    const seedShape: ShapeObject = {
      id: `seed-${nanoid()}`,
      type: "texture",
      geometry: {
        position: { x: 0, y: 0.5 },
        size: { width: 0.5, height: 0.6 },
        slope: tonalPalette.includes("phrygian") ? -0.2 : 0.15,
      },
      color: "#c4ff5a",
      thickness: 2,
      timeStart: 0,
      timeEnd: 1200,
      metadata: { seedText: text, vibe: "urban-greenhouse" },
    };

    this.upsertShape(seedShape);
    const audioFromSeed = this.mapper.shapeToSound(seedShape);
    const ambientEvents = this.soundworld.spawn("neon buzz pad", { startTime: 0, intensity: 0.5 });
    this.upsertAudioEvents([...audioFromSeed, ...ambientEvents]);

    const followUpHint = await this.fetchFollowUpHint(text, analysis);

    this.logGardenEvent("garden_seed", { seedText: text, analysis });
    return {
      seed: seedPayload,
      analysis,
      suggestedShapes: this.visualModel.getAllShapes(),
      suggestedAudio: this.audioModel.getEvents(),
      followUpHint,
    };
  }

  async applyVisualEdit(shape: ShapeObject): Promise<GardenEditResponse> {
    this.upsertShape(shape);
    const audioEvents = this.mapper.shapeToSound(shape);
    this.upsertAudioEvents(audioEvents);

    this.logGardenEvent("garden_visual_edit", { shapeId: shape.id, type: shape.type });
    return {
      shapes: this.visualModel.getAllShapes(),
      audio: this.audioModel.getEvents(),
      note: "Visual edit pushed through the mapper into audio",
    };
  }

  async applyAudioEdit(event: AudioEvent): Promise<GardenEditResponse> {
    this.upsertAudioEvents([event]);
    const shape = this.mapper.soundToShape(event);
    this.upsertShape(shape);

    this.logGardenEvent("garden_audio_edit", { audioId: event.id, type: event.type });
    return {
      shapes: this.visualModel.getAllShapes(),
      audio: this.audioModel.getEvents(),
      note: "Audio edit mirrored into shapes",
    };
  }

  async improvise(userGesture: UserGesture, audioGesture: AudioGesture): Promise<GardenImprovResponse> {
    const density = userGesture.density ?? audioGesture.hits ?? 2;
    const velocity = Math.round(Math.min(1, userGesture.velocity ?? 0.7) * 127);
    const duration = Math.max(200, userGesture.durationMs ?? 600);

    const improvisedEvents: AudioEvent[] = Array.from({ length: density }).map((_, idx) => ({
      id: `improv-${nanoid()}`,
      type: "sample",
      timestamp: idx * (duration * 0.5),
      duration,
      velocity,
      metadata: {
        gesture: userGesture.mode,
        contour: audioGesture.contour,
        color: audioGesture.color ?? "neon",
      },
    }));

    this.upsertAudioEvents(improvisedEvents);
    const shapes = improvisedEvents.map((event) => this.mapper.soundToShape(event));
    shapes.forEach((shape) => this.upsertShape(shape));

    const gestureSummary = this.describeGesture(userGesture, audioGesture);
    this.logGardenEvent("garden_improv", { gestureSummary, density });

    return {
      improvisedEvents,
      shapes: this.visualModel.getAllShapes(),
      gestureSummary,
    };
  }

  async requestFollowUp(): Promise<string> {
    const hint = await this.fetchFollowUpHint(this.lastSeedText ?? "", analyzeSeed(this.lastSeedText ?? ""));
    this.logGardenEvent("garden_follow_up", { hint });
    return hint ?? "Try stacking another layer of noise or bending the shape higher.";
  }

  private deriveTonalPalette(analysis: SeedAnalysis): string[] {
    const palette: string[] = [];
    if (analysis.intensity === "frantic" || analysis.intensity === "urgent") {
      palette.push("phrygian", "locrian");
    } else if (analysis.intensity === "tense") {
      palette.push("dorian", "phrygian");
    } else {
      palette.push("mixolydian", "minor");
    }

    if (analysis.textureProfile.includes("metal")) {
      palette.push("chromatic sparks");
    }

    return palette;
  }

  private deriveEnergyCurve(intensity: string): string {
    const map: Record<string, string> = {
      frantic: "spike early then decay",
      urgent: "steady climb",
      tense: "slow coil then release",
      "hard-edged": "plateau of force",
      "soft glow": "gentle arc",
      steady: "moderate swell",
    };

    return map[intensity] ?? "broken escalator rise";
  }

  private upsertShape(shape: ShapeObject): void {
    const existing = this.visualModel.getAllShapes().find((item) => item.id === shape.id);
    if (existing) {
      this.visualModel.updateShape(shape.id, shape);
    } else {
      this.visualModel.addShape(shape);
    }
  }

  private upsertAudioEvents(events: AudioEvent[]): void {
    events.forEach((event) => {
      const existing = this.audioModel.getEvents().find((item) => item.id === event.id);
      if (existing) {
        this.audioModel.updateEvent(event.id, event);
      } else {
        this.audioModel.addEvent(event);
      }
    });
  }

  private describeGesture(userGesture: UserGesture, audioGesture: AudioGesture): string {
    const density = userGesture.density ?? audioGesture.hits ?? 1;
    const contour = audioGesture.contour?.length ? `contour(${audioGesture.contour.join(",")})` : "flat";
    return `${userGesture.mode} with density ${density} and ${contour}`;
  }

  private async fetchFollowUpHint(seedText: string, analysis: SeedAnalysis): Promise<string | null> {
    try {
      const response = await this.deepSeek.analyzeListeningNote({
        userId: this.userId,
        text: seedText || "",
        context: {
          mode: "garden",
          tags: [analysis.textureProfile, analysis.rhythmicShape, analysis.intensity],
        },
      });

      return (
        response.followUpQuestion ||
        response.summary ||
        "Stack another layer of noise, or drag the energy later in the timeline."
      );
    } catch (error) {
      console.warn("DeepSeek follow-up failed, returning fallback", error);
    }

    return "Stack another layer of noise, or drag the energy later in the timeline.";
  }

  private logGardenEvent(eventName: string, metadata?: Record<string, unknown>): void {
    const payload = { event: eventName, userId: this.userId, metadata };
    try {
      console.info("[garden]", payload);
    } catch (error) {
      console.warn("Failed to log garden event", error);
    }
  }
}
