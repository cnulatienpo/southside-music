import React, { useMemo, useState } from "react";
import LearningStack from "./components/LearningStack";
import { TheoryCardContent } from "./components/TheoryCard";
import cards from "./data/theoryCards.json";

const theoryCards = cards as TheoryCardContent[];

const App: React.FC = () => {
  const [activeCardId, setActiveCardId] = useState<string>(theoryCards[0]?.id ?? "");

  const activeCard = useMemo<TheoryCardContent | undefined>(() => {
    return theoryCards.find((card) => card.id === activeCardId);
  }, [activeCardId]);

  const handleReadyForQuiz = (card: TheoryCardContent) => {
    // Placeholder for future quiz routing/integration
    // eslint-disable-next-line no-alert
    alert(`Unlocked quiz and studio activity for ${card.title}!`);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Southside School of Music</h1>
        <p>
          Explore rhythm, groove, and feel. Read the lesson, listen with focused
          ears, reflect on what you heard, and unlock the next studio mission.
        </p>
      </header>

      <main className="app__main">
        <aside className="app__sidebar">
          <h2>Lesson Cards</h2>
          <nav className="app__cardList">
            {theoryCards.map((card) => (
              <button
                key={card.id}
                type="button"
                className={`app__cardButton ${card.id === activeCardId ? "app__cardButton--active" : ""}`}
                onClick={() => setActiveCardId(card.id)}
              >
                <span>{card.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="app__learning">
          {activeCard ? (
            <LearningStack card={activeCard} onReadyForQuiz={handleReadyForQuiz} />
          ) : (
            <p>Select a lesson to get started.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
