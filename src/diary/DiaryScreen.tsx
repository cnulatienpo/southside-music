import React from "react";
import { DiaryEngine } from "./DiaryEngine";

interface Props {
  diary: DiaryEngine;
}

const DiaryScreen: React.FC<Props> = ({ diary }) => {
  const entries = diary.getEntries();
  return (
    <div className="diary-screen">
      <h3>diary</h3>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <span>{Math.round(entry.timestamp)}ms</span> – <span>{entry.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiaryScreen;
