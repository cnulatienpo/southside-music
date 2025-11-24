# Dual-Mode Audio + Visual Engine — Design Doc

## Overview
The Dual-Mode Engine enables three synchronized creation paths: purely visual authoring, purely audio authoring, and fully synchronized dual-mode creation. All paths share a data-driven core where shapes map to musical meaning and audio events map back to shapes. The engine supports classroom, accessibility, and performance contexts by maintaining real-time parity between what is seen and what is heard.

## Visual Mode
- **Shapes**: melodies as sloped lines, bass and drums as rectangles, chords as stacked blocks, textures as thickness, dynamics as gradients, riffs/motifs as patterned clusters, and song form as labeled regions.
- **Dimensions**: height → pitch, slope → contour, width → duration, x-position → grid placement, y-position → register, color → timbre family, gradient → dynamics, thickness → density/texture, iconography → instrument presets.
- **Editing rules**: snapping to rhythmic grid, pitch quantization by scale, adaptive contrast for low-vision users, undoable edits, and autosave of revisions.
- **Teaching 30 musical concepts visually**: pitch, interval, contour, scale degrees, key, tonic/dominant, cadence types, meter, subdivision, tempo, syncopation, swing, groove templates, polyrhythm hints, harmonic rhythm, chord quality, inversion, voice-leading, cadence strength, modulation markers, dynamics (pp–ff), accents, crescendo/decrescendo, articulations, texture density, orchestration lanes, form regions (intro/verse/chorus/bridge/outro), motif development, call-and-response, and ostinato patterns.

## Audio Mode
- **Tapping**: tap-to-tempo establishes grid; tap-to-beat records rhythmic events with quantization and velocity estimation.
- **Singing**: monophonic pitch tracker feeds melodic lines; converts to shapes for visual echo.
- **MIDI**: bidirectional import/export of notes, chords, CC envelopes, and drum pads.
- **Beat building**: step sequencer, sample triggers, and effect lanes; supports layering envelopes, humanization, swing, and per-lane FX.

## Dual Mode
- **Bidirectional sync**: every visual edit produces audio events; every audio edit produces shapes. Mapper preserves timing, pitch contour, dynamics, timbre presets, and density.
- **Shape ↔ Sound logic**: slopes → pitch contour, height → pitch, rectangle width → duration, rectangle height → dynamics, block stacks → harmony type, gradient brightness → dynamic weight, thickness → density, timbre icons → synth/sample families.
- **Real-time updates**: requestAnimationFrame tick updates visualizer, media sync, and timing cues; late events are predicted and reconciled for tight playback.
- **Muting each mode**: visual-only hides speakers and mutes audio engine; audio-only hides canvas and overlays; dual shows both.

## YouTube Integration (Legal)
- Playback is embedded via iframe API; audio is never extracted.
- Only `currentTime` and live FFT data from an AnalyzerNode are read to drive visuals; no audio is modified or intercepted, preserving YouTube TOS compliance.
- Visualizer overlays run in “ride-along” mode to mirror playback with zero audio manipulation.

## Latency Solutions
- **Predicted beats**: extrapolate tempo from recent taps or analyzer peaks to pre-render cues.
- **Shadow mode visuals**: show ghost shapes a few frames ahead, corrected when definitive timing arrives.
- **User nudge**: per-track and global offsets to align MIDI, taps, or external video.

## Ear Training Integration
- **Forward-Shadow Tests**: present a prompt (shape-only, sound-only, or both) and ask the learner to complete or continue it in dual mode.
- **Shape-only prompts**: learners hear what they draw once committed, reinforcing mapping.
- **Sound-only prompts**: captured audio is converted to shapes for reflection.
- **Shape+Sound combo**: simultaneous guidance for mixed-ability classrooms.

## Safety + Accessibility
- **Deaf-friendly**: every sound is mirrored as a shape with clear pitch/contour/duration encodings and haptic-friendly timing hooks.
- **Beginner-friendly**: progressive disclosure of parameters, tooltips, and pre-baked templates.
- **Cognitive-load sensitive**: simplify UI in solo modes, throttle visual clutter, and provide colorblind-safe palettes.
