import React, { useState } from 'react';
import { EventCaptureEngine } from './EventCaptureEngine';
import { PachecoEvent } from '../types';

interface Props {
  eventEngine: EventCaptureEngine;
}

const EventEditor: React.FC<Props> = ({ eventEngine }) => {
  const [type, setType] = useState('generic');
  const [payload, setPayload] = useState('{}');

  const handleStore = () => {
    const event: PachecoEvent = {
      id: `evt-${Date.now()}`,
      timestamp: Date.now(),
      type,
      payload: {},
    };
    try {
      event.payload = JSON.parse(payload);
    } catch {
      event.payload = {};
    }
    eventEngine.capture(event);
  };

  const stored = eventEngine.getEvents();

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <div>event editor</div>
      <input value={type} onChange={(e) => setType(e.target.value)} />
      <textarea value={payload} onChange={(e) => setPayload(e.target.value)} />
      <button onClick={handleStore}>store event</button>
      <div>stored events: {stored.length || 'none'}</div>
    </div>
  );
};

export default EventEditor;
