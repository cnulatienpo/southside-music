import React from "react";

export interface TheoryCardData {
  id: string;
  title: string;
  genre: string[];
  description: string;
  videoUrl: string;
  activities: string[];
}

interface TheoryCardProps {
  data: TheoryCardData;
  isActive: boolean;
  onSelect: (id: string) => void;
}

const TheoryCard: React.FC<TheoryCardProps> = ({ data, isActive, onSelect }) => {
  return (
    <article
      className={`theory-card ${isActive ? "active" : ""}`}
      onClick={() => onSelect(data.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onSelect(data.id);
        }
      }}
    >
      <header className="theory-card__header">
        <h3>{data.title}</h3>
        <div className="theory-card__genres">
          {data.genre.map((genre) => (
            <span className="theory-card__badge" key={genre}>
              {genre}
            </span>
          ))}
        </div>
      </header>
      <p className="theory-card__description">{data.description}</p>
      <ul className="theory-card__activities">
        {data.activities.map((activity) => (
          <li key={activity}>{activity}</li>
        ))}
      </ul>
    </article>
  );
};

export default TheoryCard;
