# Circuits Interaction System

## Overview
The interaction layer that powers Circuits scenes focuses on capturing player intent without grading or friction. Each control feeds lightweight data into the CircuitsRuntime for downstream scene logic.

## Controls
- **Taps**: timing-based pulses for beats and rhythm echoes.
- **Sliders**: horizontal or vertical axes for ranges like soft/loud or clean/dirty.
- **Dials**: rotary gestures for tempo feel and spatial shifts.
- **Gesture drawings**: freeform lines and curves for contour and motion shapes.
- **Pad grids**: compact drum-pad style hits and toggles.
- **Text blurbs**: short player phrases for reflective prompts.
- **Mic placeholder**: stubbed capture for future pitch/dynamics analysis.

## Philosophy
- Zero grading: every input is accepted as-is; the runtime interprets creatively.
- Playful experimentation: controls are tuned for quick iteration and feel-driven play.
- Player-first pacing: minimal required precision, maximum expressive freedom.

## 2D Aesthetic
- Urban/industrial tone with cracked floor grids and neon slider rails.
- Scrappy UI metaphors (taped labels, marker ticks) for tactile immediacy.
- Flat, 2D-friendly layouts prioritized for accessibility and clarity.

## Integration
- `CircuitsActionRouter` maps scenes and tool exposure to the right interaction class.
- Routed actions are timestamped and handed off directly to `CircuitsRuntime`.
- Tool exposure is tracked centrally so scenes get the controls they request without extra wiring.
