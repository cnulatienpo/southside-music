export type EarExerciseRenderer = (meta: Record<string, any>) => {
  type: string;
  geometry: any;
  colorScheme: any;
  timing: any;
};

export type EarExerciseRendererMap = Record<string, EarExerciseRenderer>;

const baseColors = {
  background: {
    light: "#F5F5F5",
    dark: "#111111",
  },
  primary: {
    light: "#1E88E5",
    dark: "#64B5F6",
  },
  accent: {
    light: "#F06292",
    dark: "#F48FB1",
  },
  neutral: {
    light: "#424242",
    dark: "#E0E0E0",
  },
};

function sameDifferent(meta: Record<string, any>) {
  return {
    type: "same_different",
    geometry: {
      symbols: [
        { shape: "circle", emphasis: "steady" },
        { shape: "circle", emphasis: "glow" },
      ],
    },
    colorScheme: {
      ...baseColors,
      emphasis: meta.mode === "dark" ? "#FFD54F" : "#FFB300",
    },
    timing: {
      sequence: [0, meta.delayMs ?? 600],
      emphasisDuration: meta.emphasisDuration ?? 900,
    },
  };
}

function upDown(meta: Record<string, any>) {
  return {
    type: "up_down",
    geometry: {
      arrows: [
        { direction: "up", start: { x: 0.4, y: 0.6 }, end: { x: 0.4, y: 0.2 } },
        { direction: "down", start: { x: 0.6, y: 0.4 }, end: { x: 0.6, y: 0.8 } },
      ],
    },
    colorScheme: baseColors,
    timing: {
      pulse: meta.pulseMs ?? 400,
      offset: meta.offsetMs ?? 120,
    },
  };
}

function nearFar(meta: Record<string, any>) {
  return {
    type: "near_far",
    geometry: {
      circles: [
        { position: { x: 0.35, y: 0.5 }, radius: 0.08 },
        { position: { x: 0.65, y: meta.far ? 0.5 : 0.35 }, radius: 0.08 },
      ],
      separation: meta.far ? 0.3 : 0.1,
    },
    colorScheme: baseColors,
    timing: {
      driftDuration: meta.driftDuration ?? 1200,
      hold: meta.hold ?? 800,
    },
  };
}

function contour(meta: Record<string, any>) {
  return {
    type: "contour",
    geometry: {
      path: meta.points ?? [
        { x: 0.1, y: 0.6 },
        { x: 0.3, y: 0.4 },
        { x: 0.6, y: 0.5 },
        { x: 0.9, y: 0.2 },
      ],
      strokeWidth: meta.strokeWidth ?? 3,
    },
    colorScheme: {
      ...baseColors,
      line: meta.mode === "dark" ? "#8BC34A" : "#33691E",
    },
    timing: {
      drawDuration: meta.drawDuration ?? 1500,
      echo: meta.echo ?? false,
    },
  };
}

function pulseTap(meta: Record<string, any>) {
  return {
    type: "pulse_tap",
    geometry: {
      dot: { position: { x: 0.5, y: 0.5 }, radius: meta.radius ?? 0.07 },
    },
    colorScheme: {
      ...baseColors,
      pulse: meta.mode === "dark" ? "#FF8A65" : "#D84315",
    },
    timing: {
      pulseInterval: meta.interval ?? 600,
      pulseDecay: meta.decay ?? 250,
    },
  };
}

function rhythmEcho(meta: Record<string, any>) {
  return {
    type: "rhythm_echo",
    geometry: {
      beats: (meta.pattern ?? [300, 600, 900]).map((ms: number, index: number) => ({
        time: ms,
        lane: index % 2,
      })),
      lanes: 2,
    },
    colorScheme: baseColors,
    timing: {
      totalDuration: meta.totalDuration ?? 2000,
      beatHighlight: meta.highlight ?? 140,
    },
  };
}

function gestureMatch(meta: Record<string, any>) {
  return {
    type: "gesture_match",
    geometry: {
      targetPath: meta.targetPath ?? [
        { x: 0.2, y: 0.2 },
        { x: 0.8, y: 0.4 },
        { x: 0.6, y: 0.8 },
      ],
      tolerance: meta.tolerance ?? 0.12,
    },
    colorScheme: {
      ...baseColors,
      target: meta.mode === "dark" ? "#FFD600" : "#FF8F00",
      live: meta.mode === "dark" ? "#80DEEA" : "#006064",
    },
    timing: {
      previewDuration: meta.previewDuration ?? 1000,
      captureWindow: meta.captureWindow ?? 2500,
    },
  };
}

function whichFirst(meta: Record<string, any>) {
  return {
    type: "which_first",
    geometry: {
      cards: (meta.cards ?? ["A", "B", "C"]).map((label: string, index: number) => ({
        label,
        drift: { x: 0.3 + index * 0.2, y: 0.25 + index * 0.1 },
      })),
    },
    colorScheme: baseColors,
    timing: {
      entryStagger: meta.entryStagger ?? 300,
      hoverHint: meta.hoverHint ?? 500,
    },
  };
}

function whatChanged(meta: Record<string, any>) {
  return {
    type: "what_changed",
    geometry: {
      before: meta.before ?? { shape: "wave", points: 5 },
      after: meta.after ?? { shape: "wave", points: 5, delta: "+1" },
      overlay: { style: "ghost", opacity: 0.4 },
    },
    colorScheme: {
      ...baseColors,
      change: meta.mode === "dark" ? "#FF7043" : "#D84315",
    },
    timing: {
      revealDelay: meta.revealDelay ?? 700,
      swapDuration: meta.swapDuration ?? 800,
    },
  };
}

export function buildEarExerciseRendererMap(): EarExerciseRendererMap {
  return {
    same_different: sameDifferent,
    up_down: upDown,
    near_far: nearFar,
    contour,
    pulse_tap: pulseTap,
    rhythm_echo: rhythmEcho,
    gesture_match: gestureMatch,
    which_first: whichFirst,
    what_changed: whatChanged,
  };
}
