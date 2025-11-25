# SOUTHside SCHOOL — MASTER DESIGN DOCUMENT

## 1. Philosophy
- Sandbox first; the player steers every move.
- All modes stay open so switching is instant.
- Choose what feels good, follow curiosity over curriculum.
- No grading, no tests, no scorekeeping.

## 2. The World
- industrial, neon, concrete, lived-in
- everything connected by the HUB hallway

## 3. Modes Summary
- **Lab:** experiment with ideas, remix listening notes, cook up sonic prototypes.
- **Dojo:** drills and micro-exercises in an industrial training room, fans buzzing.
- **Garden:** urban greenhouse / empty lot where sketches sprout into full pieces.
- **Bazaar:** flea market of global sound, swap loops, stall-to-stall exploration.
- **Theft:** chaotic guild of aesthetic theft, riff without stealing for real.
- **Songbuilder:** factory floor where tracks are assembled piece by piece.
- **Archives:** industrial memory vault where runs, scraps, and vocab are stored.
- **Circuits:** scene-based sandbox world connecting everything through runs.

## 4. Navigation
- HUB doors, arrows, and stairs route players between modes. The HUB always feels like a neon transit hall.
- Circuits runs branch through topics and scenes and can drop you into any mode.
- Players pick topics and wander to whichever door hums loudest; no locks or grade gates exist.

## 5. Architecture Snapshot
- Electron shell wraps the React front end; MediaSync and Visualizer coordinate playback without breaking YouTube TOS.
- DeepSeekEngine feeds tone-safe prompts into AI while AIProtocol strips banned words.
- Registry-driven content (scenes, NPCs, tools) keeps modes pluggable.

## 6. AI Persona
- Tone: casual urban-industrial, never talk down, sensory city metaphors.
- Banned words: correct, wrong, mistake, grade, fail, assignment, test, score.
- Boundary reminder: "Not for nothin’, but this game ain’t like that."
- Example lines:
  - "You steer; I'm just here to keep the hum steady."
  - "These neon rails feel like synth arps—ride whichever one pulls you."
  - "Let's reroute this vibe through the laundromat spin cycle."

## 7. Player Flow
- choose topic
- drop into scene
- choose path
- wander through world

## 8. No-Grading System
- Forward-Shadow encourages reflection without scores.
- Mastery detection watches patterns quietly; responses avoid evaluation terms.
- AI answers stay supportive and reflective, never authoritative; banned words are scrubbed before messages ship.

## 9. Visuals
- 2D industrial palette
- neon, concrete, rust, flickering signage

## 10. Extensibility
- add scenes by extending the circuits scenes registry
- add NPCs via npcProfiles
- add tools by extending CircuitToolId list and tool exposure
- add modes by updating global config and registry hooks

## 11. Future Expansion
- new episodes across subway tunnels and rooftops
- collaborative runs through shared Circuits sessions
- mobile-friendly hub spurs and pop-up night markets
