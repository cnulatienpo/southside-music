import React, { useMemo, useState } from "react";
import { NOTES, playTone } from "../games/soundPad";

const getRandomNote = () => NOTES[Math.floor(Math.random() * NOTES.length)];

const EarTrainer: React.FC = () => {
  const [target, setTarget] = useState(getRandomNote());
  const [status, setStatus] = useState<string>("");
  const [attempts, setAttempts] = useState(0);

  const noteButtons = useMemo(
    () =>
      NOTES.map((note) => (
        <button
          key={note.name}
          onClick={() => {
            playTone(note.frequency);
            setAttempts((prev) => prev + 1);
            if (note.name === target.name) {
              setStatus(`Nailed it! You matched ${note.name} in ${attempts + 1} taps.`);
              setTimeout(() => {
                setTarget(getRandomNote());
                setAttempts(0);
                setStatus("");
              }, 1200);
            } else {
              setStatus(`Keep listening... ${note.name} is not the target.`);
            }
          }}
        >
          {note.name}
        </button>
      )),
    [target.name, attempts]
  );

  return (
    <section className="ear-trainer">
      <header>
        <h2>Ear Training Playground</h2>
        <p>
          Press "Play Target" to hear a pitch, then tap the matching note. Cycle
          through until you can sing it back without peeking.
        </p>
      </header>
      <div className="ear-trainer__actions">
        <button
          onClick={() => {
            playTone(target.frequency);
            setStatus("Target playing...");
          }}
        >
          Play Target
        </button>
        <button
          onClick={() => {
            setTarget(getRandomNote());
            setAttempts(0);
            setStatus("New target ready.");
          }}
        >
          New Target
        </button>
      </div>
      <div className="ear-trainer__buttons">{noteButtons}</div>
      {status && <p className="ear-trainer__status">{status}</p>}
    </section>
  );
};

export default EarTrainer;
