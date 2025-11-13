import React, { useMemo, useState } from "react";
import LearningStack from "./components/LearningStack";
import LoopStation from "./components/LoopStation";
import QuizLauncher from "./components/QuizLauncher";
import { TheoryCardContent } from "./components/TheoryCard";
import cards from "./data/theoryCards.json";

const theoryCards = cards as TheoryCardContent[];

type ExperienceMode = "learn" | "quiz" | "studio";

const App: React.FC = () => {
  const [activeCardId, setActiveCardId] = useState<string>(theoryCards[0]?.id ?? "");
  const [mode, setMode] = useState<ExperienceMode>("learn");

  const activeCard = useMemo<TheoryCardContent | undefined>(() => {
    return theoryCards.find((card) => card.id === activeCardId);
  }, [activeCardId]);

  const handleReadyForQuiz = (card: TheoryCardContent) => {
    setActiveCardId(card.id);
    setMode("quiz");
  };

  const handleReturnToLesson = () => {
    setMode("learn");
  };

  const handleLaunchStudio = () => {
    setMode("studio");
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
                onClick={() => {
                  setActiveCardId(card.id);
                  setMode("learn");
                }}
              >
                <span>{card.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="app__learning">
          {mode === "learn" && activeCard && (
            <LearningStack card={activeCard} onReadyForQuiz={handleReadyForQuiz} />
          )}

          {mode === "quiz" && activeCard && (
            <QuizLauncher
              cardId={activeCard.id}
              cardTitle={activeCard.title}
              onReturnToLesson={handleReturnToLesson}
              onLaunchStudio={handleLaunchStudio}
            />
          )}

          {mode === "studio" && (
            <div className="app__studioShell">
              <header className="app__studioHeader">
                <h2>Create in the Studio Lab</h2>
                {activeCard && (
                  <p>
                    Inspired by <strong>{activeCard.title}</strong>? Use the loop station to sculpt your own groove.
                  </p>
                )}
              </header>
              <LoopStation />
              <div className="app__studioActions">
                <button type="button" onClick={handleReturnToLesson}>
                  Back to Lessons
                </button>
              </div>
            </div>
          )}

          {!activeCard && <p>Select a lesson to get started.</p>}
        </section>
      </main>
    </div>
  );
};

export default App;
