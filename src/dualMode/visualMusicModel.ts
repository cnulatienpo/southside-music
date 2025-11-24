export type ShapeType =
  | "melody"
  | "bass"
  | "drum"
  | "chord"
  | "texture"
  | "dynamic"
  | "riff"
  | "motif"
  | "form";

export interface ShapeGeometry {
  path?: Array<{ x: number; y: number }>;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  slope?: number;
}

export interface ShapeObject {
  id: string;
  type: ShapeType;
  geometry: ShapeGeometry;
  color?: string;
  thickness?: number;
  timeStart: number;
  timeEnd: number;
  metadata?: Record<string, unknown>;
}

/**
 * VisualMusicModel stores the full arrangement as a shape-first representation.
 * Shapes are designed to be serializable, easy to diff, and compatible with
 * accessibility tooling that can verbalize their semantic meaning.
 */
export class VisualMusicModel {
  private shapes: ShapeObject[] = [];

  addShape(shape: ShapeObject): void {
    this.shapes.push(structuredClone(shape));
  }

  updateShape(id: string, edits: Partial<ShapeObject>): void {
    this.shapes = this.shapes.map((shape) =>
      shape.id === id ? { ...shape, ...structuredClone(edits) } : shape
    );
  }

  getAllShapes(): ShapeObject[] {
    return structuredClone(this.shapes);
  }

  clear(): void {
    this.shapes = [];
  }
}
