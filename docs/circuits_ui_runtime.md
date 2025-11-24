# Circuits — UI + Runtime System

## Purpose
A sandbox/choose-your-own-adventure overlay for all musical concepts.

## Visual Style
- urban, industrial, 2D
- station booths, corner stores, hallways, stoops, flea markets
- bold captions
- NPC portraits optional or simple silhouettes

## Player Flow
1. choose topic
2. engine picks a matching scene
3. scene is displayed with tools
4. player picks an exit path
5. runtime launches next scene

## Constraint Display
- only show tools from scene.constraint.requiredTools
- show optionalTools ONLY if the player has seen them before
- mark new tools as “seen”

## Tool Exposure
- tracked globally to support “start from zero, grow naturally”

## Integration
- connects to Lab, Dojo, Garden, Bazaar, Theft, Songbuilder
