import React, { useEffect, useMemo, useState } from "react";
import { PachecoEnvironment } from "../environment";
import { DiaryEntry, Lane, NotationRenderSettings, PachecoEvent, SubtitleRenderData } from "../types";

const PachecoContractConsole: React.FC = () => {
  const env = useMemo(() => {
    const instance = new PachecoEnvironment();
    instance.initialize();
    return instance;
  }, []);

  const [lanes, setLanes] = useState<Lane[]>(env.lanes.getLanes());
  const [lineState, setLineState] = useState(env.lines.getLineState());
  const [events, setEvents] = useState<PachecoEvent[]>(env.events.getAllEvents());
  const [renderSettings, setRenderSettings] = useState<NotationRenderSettings>(env.subtitles.getRenderSettings());
  const [diary, setDiary] = useState<DiaryEntry[]>(env.diary.getLog());
  const [frame, setFrame] = useState<SubtitleRenderData>(env.renderAt(0));
  const [level, setLevel] = useState(env.state.getLevel());

  useEffect(() => {
    const unsubscribes = [
      env.lanes.onLaneChange(setLanes),
      env.lines.onLineState(setLineState),
      env.events.onEventCreated((evt) => setEvents((prev) => [...prev, evt])),
      env.events.onEventUpdated((evt) => setEvents((prev) => prev.map((e) => (e.id === evt.id ? evt : e)))),
      env.subtitles.onRenderSettings(setRenderSettings),
      env.diary.onEntry((entry) => setDiary((prev) => [...prev, entry])),
      env.state.onLevelChange(setLevel),
    ];
    return () => {
      unsubscribes.forEach((u) => u());
    };
  }, [env]);

  useEffect(() => {
    setFrame(env.renderAt(env.media.getCurrentTime()));
  }, [env, events, lanes, renderSettings]);

  const handleMarkEvent = () => {
    env.events.markEvent(env.media.getCurrentTime());
    setFrame(env.renderAt(env.media.getCurrentTime()));
  };

  const handlePropagate = () => {
    const first = events[0];
    if (!first) return;
    env.propagation.propagate(first.id);
  };

  const handleLineIncrease = () => {
    env.lines.requestLineIncrease("manual");
  };

  const handleLineDecrease = () => {
    env.lines.requestLineDecrease("manual");
  };

  const handleAddLane = () => {
    env.lanes.addLaneAbove();
  };

  const handleLevelUp = () => {
    env.state.requestLevelIncrease("manual");
  };

  const toggleNoteheads = () => {
    env.subtitles.setRenderSettings({ showNoteheads: !renderSettings.showNoteheads });
  };

  return (
    <section className="pacheco-contract-console">
      <header>
        <h3>Pacheco Engine Contracts</h3>
        <p>Dry inspection of stub engines and render outputs.</p>
      </header>

      <div className="pacheco-contract-console__controls">
        <button type="button" onClick={handleMarkEvent}>
          Mark Event
        </button>
        <button type="button" onClick={handlePropagate} disabled={events.length === 0}>
          Propagate First Event
        </button>
        <button type="button" onClick={handleAddLane}>Add Lane Above</button>
        <button type="button" onClick={handleLineIncrease}>Line +</button>
        <button type="button" onClick={handleLineDecrease}>Line -</button>
        <button type="button" onClick={toggleNoteheads}>Toggle Noteheads</button>
        <button type="button" onClick={handleLevelUp}>Increase Level</button>
      </div>

      <div className="pacheco-contract-console__grid">
        <div>
          <h4>Lanes</h4>
          <ul>
            {lanes.map((lane) => (
              <li key={lane.id}>
                {lane.id} z:{lane.z} visible:{lane.visible ? "yes" : "no"}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Line State</h4>
          <p>
            Count: {lineState.lineCount} active:{lineState.active ? "yes" : "no"}
          </p>
        </div>

        <div>
          <h4>Render Settings</h4>
          <p>Slider: {renderSettings.slider}</p>
          <p>Lines: {renderSettings.showLines ? "on" : "off"}</p>
          <p>Staff: {renderSettings.showStaff ? "on" : "off"}</p>
          <p>Noteheads: {renderSettings.showNoteheads ? "on" : "off"}</p>
          <p>Snap Pitch: {renderSettings.snapPitch ? "on" : "off"}</p>
          <p>Snap Rhythm: {renderSettings.snapRhythm ? "on" : "off"}</p>
        </div>

        <div>
          <h4>Events</h4>
          {events.length === 0 && <p>None.</p>}
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                t:{event.timestamp} lane:{event.laneId} rhythm:{event.rhythmProfile?.join(",") ?? "-"} pitch:
                {event.pitchProfile ?? "-"} symbol:{event.symbolId ?? "-"}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Render Frame</h4>
          <pre>{JSON.stringify(frame, null, 2)}</pre>
        </div>

        <div>
          <h4>Diary</h4>
          {diary.length === 0 && <p>Empty.</p>}
          <ul>
            {diary.map((entry) => (
              <li key={entry.id}>
                {entry.type} @ {entry.timestamp}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Level</h4>
          <p>{level}</p>
        </div>
      </div>
    </section>
  );
};

export default PachecoContractConsole;
