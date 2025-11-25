# Circuits Progression & Story System

## What It Is
- A way to make scenes feel connected.
- A way to remember where you’ve been.
- Not a linear story, but overlapping threads.

## How It Works
- The engine tracks:
  - seenScenes
  - topicVisits
  - partial story chains
- When picking a new scene:
  - it avoids too much repetition
  - it tries to follow interesting chains
  - it still lets you go anywhere from any exit

## Why It’s Not a Quest System
- No “mission complete.”
- No “you failed.”
- Just: “you went here, then here, then here.”

## Examples of Chains
- Night-shift arc
- Flea-market arc
- Apartment arc
- Train line arc
- Late class arc

## Integration
- Works with CircuitsEngine + CircuitsRuntime
- Uses UserDataStore for persistence
