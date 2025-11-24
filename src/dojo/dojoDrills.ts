import { EarTrainingExerciseType } from "../game/earTrainingEngine";

export type DojoDrillCategory =
  | "ear_attention"
  | "rhythm_body"
  | "vocal_control"
  | "instrument_technique"
  | "pitch_training";

export type DojoDrill = {
  name: string;
  category: DojoDrillCategory;
  prompt: string;
  description: string;
  systemContext: Record<string, any>;
  earExerciseType?: EarTrainingExerciseType;
};

const DRILLS: Record<string, DojoDrill> = {
  ear_same_different: {
    name: "ear_same_different",
    category: "ear_attention",
    prompt: "Two clips fire off—does the second one tilt like flickering warehouse lights?",
    description: "Notice micro-shifts between back-to-back sounds without judgment.",
    systemContext: { tags: ["ear_attention", "same_different"], surface: "concrete" },
    earExerciseType: "same_different",
  },
  ear_up_down: {
    name: "ear_up_down",
    category: "ear_attention",
    prompt: "Does this line climb like elevator cables or sink like subway rumble?",
    description: "Track rise or fall without worrying about correctness—just gut sense.",
    systemContext: { tags: ["ear_attention", "up_down"], vibe: "industrial cables" },
    earExerciseType: "up_down",
  },
  ear_near_far: {
    name: "ear_near_far",
    category: "ear_attention",
    prompt: "Are these sounds hanging close like a lamp buzz or spaced out like distant trains?",
    description: "Judge spacing and proximity of tones against a gritty backdrop.",
    systemContext: { tags: ["ear_attention", "near_far"], room: "warehouse" },
    earExerciseType: "near_far",
  },
  ear_contour: {
    name: "ear_contour",
    category: "ear_attention",
    prompt: "Trace this curve like following a line of flickering lights across the ceiling.",
    description: "Shadow the contour without naming notes—just shape and motion.",
    systemContext: { tags: ["ear_attention", "contour"], imagery: "ceiling lights" },
    earExerciseType: "gesture_match",
  },
  rhythm_pulse: {
    name: "rhythm_pulse",
    category: "rhythm_body",
    prompt: "Tap where you feel the beat land on this concrete floor.",
    description: "Ride the pulse with relaxed taps, no pressure to be exact.",
    systemContext: { tags: ["rhythm_body", "pulse"], floor: "concrete" },
    earExerciseType: "pulse_tap",
  },
  rhythm_echo: {
    name: "rhythm_echo",
    category: "rhythm_body",
    prompt: "Echo this warehouse pattern back: thud… thud-thud… thud.",
    description: "Mirror a simple rhythm like knocking on metal ductwork.",
    systemContext: { tags: ["rhythm_body", "echo"], texture: "metal" },
    earExerciseType: "rhythm_echo",
  },
  rhythm_subdivision: {
    name: "rhythm_subdivision",
    category: "rhythm_body",
    prompt: "Split the beat like hazard stripes—keep your taps steady and low-key.",
    description: "Practice subdivisions with chill, even taps.",
    systemContext: { tags: ["rhythm_body", "subdivision"], markers: "hazard_stripes" },
    earExerciseType: "pulse_tap",
  },
  vocal_breath: {
    name: "vocal_breath",
    category: "vocal_control",
    prompt: "Let your breath cycle like vents humming above—smooth in, smooth out.",
    description: "Shape simple breath patterns without pushing volume.",
    systemContext: { tags: ["vocal_control", "breath"], room: "vented" },
    earExerciseType: "up_down",
  },
  vocal_vowels: {
    name: "vocal_vowels",
    category: "vocal_control",
    prompt: "Shape vowels like sliding shutters—ah to oo to ee with no rush.",
    description: "Ease between vowel shapes keeping the tone relaxed and grounded.",
    systemContext: { tags: ["vocal_control", "vowels"], flow: "slow_slide" },
    earExerciseType: "same_different",
  },
  vocal_dynamics: {
    name: "vocal_dynamics",
    category: "vocal_control",
    prompt: "Move from soft to loud like dimmers in an old loft—gradual, no strain.",
    description: "Explore dynamics gently without chasing perfection.",
    systemContext: { tags: ["vocal_control", "dynamics"], lighting: "dimmer" },
    earExerciseType: "what_changed",
  },
  instrument_picking: {
    name: "instrument_picking",
    category: "instrument_technique",
    prompt: "Run picking patterns like tapping rebar—steady, even, no rush.",
    description: "Cycle through picking shapes with relaxed consistency.",
    systemContext: { tags: ["instrument_technique", "picking"], tool: "rebar" },
    earExerciseType: "pulse_tap",
  },
  instrument_finger: {
    name: "instrument_finger",
    category: "instrument_technique",
    prompt: "Walk your fingers like climbing scaffolding rungs—one after another.",
    description: "Finger dexterity reps focused on smooth, repeatable motion.",
    systemContext: { tags: ["instrument_technique", "fingers"], structure: "scaffolding" },
    earExerciseType: "gesture_match",
  },
  instrument_timing: {
    name: "instrument_timing",
    category: "instrument_technique",
    prompt: "Lock timing like aligning paint stripes on the floor—clean and patient.",
    description: "Timing precision reps with calm, even strokes.",
    systemContext: { tags: ["instrument_technique", "timing"], markers: "floor_stripes" },
    earExerciseType: "pulse_tap",
  },
  pitch_octave_scan: {
    name: "pitch_octave_scan",
    category: "pitch_training",
    prompt: "Name the layer this note lives in—low floor, mid rafters, or high skylights?",
    description: "Octave categories framed like levels of an old warehouse.",
    systemContext: { tags: ["pitch_training", "octave"], ladder: true },
  },
  pitch_neighbor_octave: {
    name: "pitch_neighbor_octave",
    category: "pitch_training",
    prompt: "Is this note hugging the lower beam or the one just above?",
    description: "Neighbor octave sensitivity with subtle comparisons.",
    systemContext: { tags: ["pitch_training", "neighbor"], ladder: true },
  },
  pitch_note_color: {
    name: "pitch_note_color",
    category: "pitch_training",
    prompt: "What color or texture does this note carry—rust, chrome, neon?",
    description: "Note-color associations without naming pitches outright.",
    systemContext: { tags: ["pitch_training", "color"], ladder: true },
  },
};

export function getDrillDefinition(name: string): DojoDrill {
  const drill = DRILLS[name];
  if (!drill) {
    throw new Error(`Unknown dojo drill: ${name}`);
  }

  return drill;
}
