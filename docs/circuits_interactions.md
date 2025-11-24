# Circuits Interaction System

## Overview
The interaction layer for Circuits scenes focuses on playful, zero-grading controls that feed lightweight data to the CircuitsRuntime without judging player input. Everything here is 2D-friendly and themed with an urban/industrial vibe.

## Controls
- **Taps:** quick pulse captures for beats and timing echoes.
- **Sliders:** horizontal or vertical ranges for soft/loud, high/low, clean/dirty motions.
- **Dials:** rotary adjustments for tempo feel, timing shifts, or panning gestures.
- **Gesture drawings:** freehand lines/curves to capture melody contours or texture shapes.
- **Pad grids:** 1x4 or 2x2 touch squares for drum hits and rhythmic toggles.
- **Text blurbs:** short player-written phrases or choices for NPC prompts.
- **Mic placeholder:** stub data for future pitch/contour/dynamics analysis.

## Philosophy
- Zero grading; input is recorded, not judged.
- Encourage low-pressure experimentation and playful discovery.

## 2D Aesthetic
- Urban/industrial sketches with cracked floor grids.
- Neon sliders and scrappy UI metaphors over flat planes.

## Integration
- `CircuitsActionRouter` binds controls to scenes and forwards actions to `CircuitsRuntime`.
- Tool exposure is tracked so only available controls can be requested.
