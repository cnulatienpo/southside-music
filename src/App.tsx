import React, { useMemo, useState } from "react";
import EarTrainer from "./components/EarTrainer";
import LoopStation from "./components/LoopStation";
import TheoryCard, { TheoryCardData } from "./components/TheoryCard";
import cards from "./data/theoryCards.json";

const App: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string>(cards[0]?.id ?? "");

  const selectedCard = useMemo<TheoryCardData | undefined>(
    () => cards.find((card) => card.id === activeCard),
    [activeCard]
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1>Southside School of Music</h1>
        <p>
          Learn to hear, speak, and create music through interactive training that
          celebrates industrial, classic rock, heavy metal, blues, house, funk,
          salsa, goth, and outlaw country vibes.
        </p>
      </header>

      <main className="app__content">
        <section className="app__cards">
          <h2>Learning Paths</h2>
          <div className="app__grid">
            {cards.map((card) => (
              <TheoryCard
                key={card.id}
                data={card}
                isActive={card.id === activeCard}
                onSelect={setActiveCard}
              />
            ))}
          </div>
        </section>

        {selectedCard && (
          <section className="app__viewer">
            <h2>{selectedCard.title} Assignment</h2>
            <div className="app__media">
              <iframe
                title={selectedCard.title}
                src={selectedCard.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <aside>
                <h3>Practice Checklist</h3>
                <ul>
                  {selectedCard.activities.map((activity) => (
                    <li key={activity}>{activity}</li>
                  ))}
                </ul>
              </aside>
            </div>
          </section>
        )}

        <EarTrainer />
        <LoopStation />
      </main>

      <footer className="app__footer">
        <p>
          Dial in your groove, record progress, and remix lessons into your own
          compositions.
        </p>
      </footer>
    </div>
  );
};

export default App;
