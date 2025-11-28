import React, { useState } from 'react';
import { DiaryEngine } from './DiaryEngine';

interface Props {
  diaryEngine: DiaryEngine;
}

const DiaryScreen: React.FC<Props> = ({ diaryEngine }) => {
  const [message, setMessage] = useState('');
  const entries = diaryEngine.getEntries();

  const handleAdd = () => {
    if (!message.trim()) return;
    diaryEngine.addEntry(message.trim());
    setMessage('');
  };

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <div>diary</div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="log" />
      <button onClick={handleAdd}>store line</button>
      <button onClick={() => diaryEngine.clear()}>clear</button>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            {new Date(entry.createdAt).toISOString()} :: {entry.message}
          </li>
        ))}
      </ul>
      {entries.length === 0 && <div>no entries</div>}
    </div>
  );
};

export default DiaryScreen;
