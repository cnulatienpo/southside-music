# **PACHECO SYSTEM – MASTER DEVELOPMENT PROMPT**

*(Monster prompt: Do not summarize, do not simplify.)*

You are building a **music-notation learning environment** designed for someone who starts with *zero theory*, but can hear real patterns in music and wants to represent them immediately. The system must never lecture, cheer, praise, infantilize, or use upbeat teacher-speak. Tone is matter-of-fact, dry, blunt, slightly cynical, and task-oriented — rivethead-coded.

The system’s core law is:

> **The player hears something → the system reveals ONLY the minimum structure needed to represent that hearing. Nothing appears before it’s needed.**

The system should replicate *the real cognitive order of musical perception*, not the academic order.

This means:

* no theory-first
* no notation-first
* no clefs or staffs until the player’s perception requires it
* learning grows from *experience → representation → refinement → notation*

This is the **Pacheco Ladder** — gradual, perception-driven fluency, culminating in full notation literacy that could be read by Karl Orff or any trained musician.

---

# **CORE COMPONENTS**

## **1. Lane System (Vertical Pitch Space Before Lines)**

The player begins with a **blank page**.

When they hear 1 layer: show 1 lane.
When they hear a second layer: show 2 lanes.
When they hear more: add lanes.

The lanes must always be arranged high→low in the same vertical order that real notation uses:

1. high / lead / melody
2. mid / harmony / riffs
3. bass / low instruments
4. pitched drums
5. unpitched percussion

These lanes have **no staff lines at first** — just horizontal regions.
The lanes embody vertical pitch territory without names.

The player does not need to know “melody,” “bass,” or “percussion.”
They only need to know: *this goes up*, *this goes down*, *this feels low*, *this feels bright*, etc.

---

## **2. Line Evolution (Gradual Staff Formation)**

Lines appear ONLY as perception demands them:

* The player hears a pitch drop → offer ONE faint line.
* The player hears pitch variation between low/mid → offer a second line.
* Continue until 5 lines exist → that becomes the staff.

At each stage, lines are explanatory, not prescriptive.
They exist to support hearing → representation, not the other way around.

Lines are faint, optional, and can be toggled.
The visual evolution is:

blank → 1 line → 2 lines → 3 lines → 4 lines → 5 lines (staff)

This is the **Pacheco progression** toward full notation.

---

## **3. Event Capture (“Spacebar System”)

While audio/video is playing, the player can mark events in real-time by:

* hitting **spacebar**
* issuing a short voice command
* tapping
* clapping
* hitting anything the mic picks up

This adds an **event marker** with a timestamp.

Afterward, the system opens an **Event Editor** for that timestamp where the player can annotate:

### **a. Lane (where it lives)**

Player chooses which lane the event belongs to.
No instrument names required yet.

### **b. Rhythm Profile (what speed / pattern)**

Player can:

* tap the rhythm (captured from real-time taps)
* choose a visual pattern
* adjust spacing
* or draw a repeating symbol

The system creates a **rhythmic fingerprint** from tap intervals.

### **c. Pitch Shape (how the note moves)**

Player draws a tiny curve showing:

* down
* up
* down→up
* up→down
* flat
* zigzag

This becomes the **pitch contour**.

### **d. Texture (optional)**

Player may describe texture with:

* scribbles
* scratch marks
* chosen icons
* or nothing

### **e. Symbol (the visual mark)**

Player draws or selects any symbol that represents the event.
That symbol is permanently associated with the event type.

---

## **4. Compound Symbols (Multi-Attribute Objects)**

Every event must support multiple attributes at once:

* rhythm profile
* pitch contour
* timbre/texture
* location (lane)
* duration
* symbol shape
* symbol category
* optional name

These attributes allow the engine to recognize similar events later.

Symbol example:

```
{
  name: "fast_diprise",
  lane: "mid",
  rhythmProfile: [intervals],
  pitchProfile: "downThenUp",
  timbre: "bright_tick",
  shape: (user strokes),
  fingerprint: (computed)
}
```

---

## **5. Pattern Propagation Engine (Auto-Subtitles)**

Once the user captures a pattern:

* the engine analyzes the audio
* finds all matching occurrences
* places their symbol at each match
* extends across the entire track
* stores it for future tracks

This creates **adaptive music subtitles** that only show what the user personally understands.

Future tracks show the same patterns whenever they appear.

---

## **6. Symbol Dictionary (User-Driven Notation Language)**

Every captured symbol is stored in a persistent dictionary.

Each symbol entry can contain:

* name
* strokes
* rhythm profile
* pitch profile
* texture mark
* category
* lane
* staff alignment (optional)
* recognition fingerprint

This dictionary powers future detection.

---

## **7. Adaptive Subtitle Engine**

Displays subtitles under audio/video.

Slider determines the level of detail:

### **0% — Raw**

Only the user’s symbols appear.
No staff, no real notation.

### **25% — Faint aids**

Timeline markers, faint grid.

### **50% — Structured**

More precise spacing, gentle pitch snapping.

### **75% — Hybrid**

Real noteheads behind user symbols, faint staff lines.

### **100% — Fully Notated**

Full staff + durations + positions + beams, but with user symbols overlayed.

The user becomes bilingual.

---

## **8. Mic Input (Voice/Tap Command Engine)**

System must support:

* live voice commands (short, functional):

  * “mark”
  * “again”
  * “new layer”
  * “record”
  * “stop”
  * “down”
  * “up”
  * “save”

* grunt/tap detection

* rhythm detection from mic

* continuous listening

* event tagging

Tone is dry:

* “event stored”
* “recorder armed”
* “timestamp marked”
* “edit window open”

No positivity.

---

## **9. Video Lab Mode**

Player loads **local videos**, not YouTube.
Features:

* lanes over video
* subtitles under video
* slow down / speed up
* looping
* event capture
* slider visualization
* real-time pitch graph (optional but nice)
* waveform + spectrogram

This is the main “morning routine” zone.

---

## **10. Zero Praise, Zero Gamification**

The system must NOT:

* congratulate
* say “cool!”
* say “nice job!”
* act cheerful

Tone:

* direct
* sparse
* functional
* “here’s the next action”
* “layer added”
* “symbol saved”
* “propagated”
* “continue”

Think industrial software, not playful children’s UI.

---

# **META REQUIREMENTS**

### The system must always:

* explain *why* a feature appears
* only introduce structure when it is needed to express something real
* keep the user’s own symbols as first-class citizens
* ensure the user can always express:

  * **what they heard**
  * **where it lives**
  * **when it happens**
  * **how it behaves**
* move toward full notation without forcing it

### Ultimately, the player achieves:

* rhythm fluency
* pitch fluency
* layer fluency
* dynamic fluency
* staff fluency
* real notation fluency

**This is Pacheco Level.**

---

# **OUTPUT EXPECTATIONS FOR ANY BUILT SYSTEM USING THIS PROMPT**

Anything built from this prompt must produce:

* lane stack manager
* lane→line evolution manager
* pitch contour capture
* rhythm tap recorder
* symbol editor
* multi-attribute symbol objects
* mapping system
* auto-propagation engine
* subtitle renderer
* video lab
* mic command engine
* adaptive notation slider
* rivethead-coded tone

All modules must be decoupled and reactive.

---

# END OF MONSTER PROMPT

Whenever you want the **next monster prompt** to generate actual **file structure**, **API definitions**, or **code architecture**, just say **k**.
