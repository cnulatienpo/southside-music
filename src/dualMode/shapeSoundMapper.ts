import { AudioEvent, AudioEventType } from "./audioMusicModel";
import { ShapeObject, ShapeType } from "./visualMusicModel";

interface MappingRule {
  shapeType: ShapeType;
  audioType: AudioEventType;
}

const SHAPE_AUDIO_RULES: MappingRule[] = [
  { shapeType: "melody", audioType: "note" },
  { shapeType: "bass", audioType: "note" },
  { shapeType: "drum", audioType: "beat" },
  { shapeType: "chord", audioType: "chord" },
  { shapeType: "texture", audioType: "effect" },
  { shapeType: "dynamic", audioType: "effect" },
  { shapeType: "riff", audioType: "sample" },
  { shapeType: "motif", audioType: "sample" },
  { shapeType: "form", audioType: "effect" },
];

const TIMBRE_ICON_TO_PRESET: Record<string, string> = {
  piano: "grand-piano",
  guitar: "electric-guitar",
  synth: "analog-lead",
  drum: "acoustic-kit",
};

const HARMONY_STACK_MAP: Record<string, string> = {
  triad: "major",
  seventh: "dominant7",
  sus: "sus4",
};

const DEFAULT_TEMPO = 120;
const MS_PER_BEAT = 60000 / DEFAULT_TEMPO;

function computePitchFromHeight(height: number): number {
  const octaveSpan = 48; // 4 octaves
  const minPitch = 48;
  return Math.round(minPitch + Math.min(Math.max(height, 0), 1) * octaveSpan);
}

function computePitchContour(slope: number | undefined, basePitch: number): number {
  if (slope === undefined) return basePitch;
  const bend = Math.max(-12, Math.min(12, slope * 12));
  return basePitch + bend;
}

function computeDuration(width?: number): number {
  if (width === undefined) return MS_PER_BEAT;
  return Math.max(0.1 * MS_PER_BEAT, width * MS_PER_BEAT * 4);
}

function computeVelocity(height?: number, gradient?: number): number {
  const dyn = gradient ?? height ?? 0.5;
  return Math.round(Math.min(1, Math.max(0, dyn)) * 127);
}

function densityFromThickness(thickness?: number): number {
  if (!thickness) return 1;
  return Math.max(1, Math.round(thickness * 8));
}

function rhythmFromPosition(position?: { x: number; y: number }): number {
  if (!position) return 0;
  return Math.max(0, position.x * MS_PER_BEAT * 4);
}

export class ShapeSoundMapper {
  shapeToSound(shape: ShapeObject): AudioEvent[] {
    const rule = SHAPE_AUDIO_RULES.find((item) => item.shapeType === shape.type);
    if (!rule) return [];

    const { geometry, timeStart, timeEnd, metadata } = shape;
    const basePitch = computePitchFromHeight(geometry.position?.y ?? geometry.slope ?? 0.5);
    const pitch = computePitchContour(geometry.slope, basePitch);
    const duration = timeEnd > timeStart ? timeEnd - timeStart : computeDuration(geometry.size?.width);
    const velocity = computeVelocity(geometry.size?.height, metadata?.gradientBrightness as number | undefined);
    const timestamp = rhythmFromPosition(geometry.position) || timeStart;

    const shared: Omit<AudioEvent, "type" | "id"> = {
      pitch,
      duration,
      velocity,
      timestamp,
      metadata: {
        ...metadata,
        harmony: shape.type === "chord" ? HARMONY_STACK_MAP[(metadata?.stack as string) ?? "triad"] : undefined,
        timbrePreset: TIMBRE_ICON_TO_PRESET[(metadata?.timbreIcon as string) ?? ""],
        density: densityFromThickness(shape.thickness),
      },
    };

    const events: AudioEvent[] = [
      {
        id: `${shape.id}-${rule.audioType}`,
        type: rule.audioType,
        ...shared,
      },
    ];

    if (shape.type === "texture" && shared.metadata?.density) {
      for (let i = 1; i < shared.metadata.density; i += 1) {
        events.push({
          id: `${shape.id}-${rule.audioType}-${i}`,
          type: rule.audioType,
          ...shared,
          timestamp: timestamp + i * (shared.duration ?? MS_PER_BEAT) * 0.25,
        });
      }
    }

    return events;
  }

  soundToShape(audioEvent: AudioEvent): ShapeObject {
    const shapeRule = SHAPE_AUDIO_RULES.find((item) => item.audioType === audioEvent.type);
    const type: ShapeType = shapeRule?.shapeType ?? "form";
    const widthBeats = (audioEvent.duration ?? MS_PER_BEAT) / MS_PER_BEAT;
    const height = (audioEvent.velocity ?? 80) / 127;

    const slope = (audioEvent.metadata?.pitchContour as number | undefined) ?? 0;
    const timeStart = audioEvent.timestamp;
    const timeEnd = timeStart + (audioEvent.duration ?? MS_PER_BEAT);

    return {
      id: `${audioEvent.id}-shape`,
      type,
      geometry: {
        position: { x: timeStart / (MS_PER_BEAT * 4), y: (audioEvent.pitch ?? 60) / 96 },
        size: { width: widthBeats / 4, height },
        slope,
      },
      color: audioEvent.metadata?.color as string | undefined,
      thickness: (audioEvent.metadata?.density as number | undefined)?.valueOf?.() ?? 1,
      timeStart,
      timeEnd,
      metadata: {
        ...audioEvent.metadata,
        gradientBrightness: (audioEvent.velocity ?? 80) / 127,
        timbreIcon: this.reverseLookupPreset(audioEvent.metadata?.timbrePreset as string | undefined),
      },
    };
  }

  private reverseLookupPreset(preset?: string): string | undefined {
    if (!preset) return undefined;
    const match = Object.entries(TIMBRE_ICON_TO_PRESET).find(([, value]) => value === preset);
    return match?.[0];
  }
}
