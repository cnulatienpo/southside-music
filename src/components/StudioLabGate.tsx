import React from "react";
import styles from "./StudioLabGate.module.css";

interface StudioLabGateProps {
  cardTitle?: string;
  correctAnswers: number;
  totalQuestions: number;
  onLaunchStudio: () => void;
  onRetry?: () => void;
  onReturnToLesson?: () => void;
}

const StudioLabGate: React.FC<StudioLabGateProps> = ({
  cardTitle,
  correctAnswers,
  totalQuestions,
  onLaunchStudio,
  onRetry,
  onReturnToLesson
}) => {
  const percentage = Math.round((correctAnswers / Math.max(totalQuestions, 1)) * 100);

  return (
    <section className={styles.gate}>
      <h2 className={styles.heading}>You're ready to create!</h2>
      <p className={styles.copy}>
        {cardTitle
          ? `The ${cardTitle} lesson is unlocked in your hands. Your ears are primed, and the studio door is open.`
          : "Your ears are primed, and the studio door is open."}
      </p>

      <p className={styles.score}>
        Quiz score: {correctAnswers} / {totalQuestions} ({percentage}% correct)
      </p>

      <div className={styles.reward}>
        <strong>New unlock:</strong> Groove Sketch Lab — start layering kicks, snares, and hats to build your own beat.
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={onLaunchStudio}>
          Open Studio Lab
        </button>
        {onRetry && (
          <button type="button" className={styles.secondary} onClick={onRetry}>
            Take Quiz Again
          </button>
        )}
        {onReturnToLesson && (
          <button type="button" className={styles.secondary} onClick={onReturnToLesson}>
            Back to Lesson
          </button>
        )}
      </div>
    </section>
  );
};

export default StudioLabGate;
