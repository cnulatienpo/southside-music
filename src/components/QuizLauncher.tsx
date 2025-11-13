import React, { useEffect, useMemo, useState } from "react";
import quizBank from "../data/quizzes.json";
import QuizQuestion, { QuizQuestionContent } from "./QuizQuestion";
import StudioLabGate from "./StudioLabGate";
import styles from "./QuizLauncher.module.css";

export type QuizLibrary = Record<string, QuizQuestionContent[]>;

interface QuizLauncherProps {
  cardId: string;
  cardTitle?: string;
  onReturnToLesson?: () => void;
  onLaunchStudio: () => void;
}

const quizzes = quizBank as QuizLibrary;

const QuizLauncher: React.FC<QuizLauncherProps> = ({ cardId, cardTitle, onReturnToLesson, onLaunchStudio }) => {
  const questions = useMemo(() => quizzes[cardId] ?? [], [cardId]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setHasAnsweredCurrent(false);
    setLastAnswerCorrect(null);
    setIsComplete(false);
  }, [cardId, questions.length]);

  const totalQuestions = questions.length;

  const progressPercent = useMemo(() => {
    if (totalQuestions === 0) {
      return 0;
    }

    if (isComplete) {
      return 100;
    }

    const answeredCount = currentQuestionIndex + (hasAnsweredCurrent ? 1 : 0);
    return Math.min(100, Math.round((answeredCount / totalQuestions) * 100));
  }, [currentQuestionIndex, hasAnsweredCurrent, isComplete, totalQuestions]);

  const handleAnswer = (isCorrect: boolean) => {
    if (hasAnsweredCurrent) {
      return;
    }
    setHasAnsweredCurrent(true);
    setLastAnswerCorrect(isCorrect);
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!hasAnsweredCurrent) {
      return;
    }

    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setHasAnsweredCurrent(false);
      setLastAnswerCorrect(null);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setHasAnsweredCurrent(false);
    setLastAnswerCorrect(null);
    setIsComplete(false);
  };

  if (totalQuestions === 0) {
    return (
      <section className={styles.launcher}>
        <header className={styles.header}>
          <h2 className={styles.title}>Quiz coming soon</h2>
          <p className={styles.subtitle}>We're crafting new questions for this lesson. Check back shortly!</p>
        </header>
        {onReturnToLesson && (
          <button type="button" className={styles.secondaryButton} onClick={onReturnToLesson}>
            Back to Lesson
          </button>
        )}
      </section>
    );
  }

  if (isComplete) {
    return (
      <section className={styles.launcher}>
        <header className={styles.header}>
          <h2 className={styles.title}>{cardTitle ?? "Lesson Quiz"}</h2>
          <p className={styles.subtitle}>Nice work! You've cleared the knowledge check.</p>
        </header>
        <StudioLabGate
          cardTitle={cardTitle}
          correctAnswers={correctCount}
          totalQuestions={totalQuestions}
          onLaunchStudio={onLaunchStudio}
          onRetry={handleRetry}
          onReturnToLesson={onReturnToLesson}
        />
      </section>
    );
  }

  const nextLabel = currentQuestionIndex + 1 === totalQuestions ? "Finish Quiz" : "Next Question";
  const statusMessage = hasAnsweredCurrent
    ? lastAnswerCorrect
      ? "Solid ear! Let's keep the energy going."
      : "Great attempt. Take that insight into the next question."
    : "Choose the best answer to continue.";

  return (
    <section className={styles.launcher}>
      <header className={styles.header}>
        <h2 className={styles.title}>{cardTitle ?? "Lesson Quiz"}</h2>
        <p className={styles.subtitle}>Lock in what you heard before heading into the studio.</p>
      </header>

      <div className={styles.progress}>
        <span>
          Question {currentQuestionIndex + 1} / {totalQuestions}
        </span>
        <div className={styles.progressBar} aria-hidden="true">
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <QuizQuestion
        key={`${cardId}-${currentQuestionIndex}`}
        question={questions[currentQuestionIndex]}
        questionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onAnswer={handleAnswer}
      />

      <div className={styles.controls}>
        <span>{statusMessage}</span>
        <div className={styles.navButtons}>
          {onReturnToLesson && (
            <button type="button" className={styles.secondaryButton} onClick={onReturnToLesson}>
              Back to Lesson
            </button>
          )}
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleNextQuestion}
            disabled={!hasAnsweredCurrent}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuizLauncher;
