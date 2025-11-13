import React, { useEffect, useMemo, useState } from "react";
import styles from "./QuizQuestion.module.css";

export interface BaseQuizQuestion {
  type: "multiple-choice" | "visual-pick";
  question: string;
  answer: string;
  helperText?: string;
}

export interface MultipleChoiceQuizQuestion extends BaseQuizQuestion {
  type: "multiple-choice";
  options: string[];
}

export interface VisualPickOption {
  label: string;
  src: string;
  alt?: string;
}

export interface VisualPickQuizQuestion extends BaseQuizQuestion {
  type: "visual-pick";
  imageOptions: VisualPickOption[];
}

export type QuizQuestionContent = MultipleChoiceQuizQuestion | VisualPickQuizQuestion;

interface QuizQuestionProps {
  question: QuizQuestionContent;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, questionIndex, totalQuestions, onAnswer }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    setSelectedValue(null);
    setHasAnswered(false);
  }, [question]);

  const isCorrect = useMemo(() => {
    if (!hasAnswered || selectedValue === null) {
      return false;
    }
    return selectedValue === question.answer;
  }, [hasAnswered, selectedValue, question.answer]);

  const feedbackMessage = useMemo(() => {
    if (!hasAnswered || selectedValue === null) {
      return "";
    }

    if (isCorrect) {
      return "Correct! You locked in the groove.";
    }

    return `Not quite. Listen again for ${question.answer}.`;
  }, [hasAnswered, isCorrect, question.answer, selectedValue]);

  const handleAnswer = (value: string) => {
    if (hasAnswered) {
      return;
    }
    setSelectedValue(value);
    setHasAnswered(true);
    onAnswer(value === question.answer);
  };

  const renderMultipleChoice = (content: MultipleChoiceQuizQuestion) => {
    const groupName = `quiz-question-${questionIndex}`;
    return (
      <div className={styles.options} role="radiogroup" aria-labelledby={`${groupName}-prompt`}>
        {content.options.map((option) => {
          const optionId = `${groupName}-${option}`;
          const isSelected = selectedValue === option;
          return (
            <label
              key={option}
              className={styles.option}
              data-selected={isSelected}
              data-disabled={hasAnswered}
              htmlFor={optionId}
            >
              <input
                className={styles.radio}
                type="radio"
                id={optionId}
                name={groupName}
                value={option}
                checked={isSelected}
                disabled={hasAnswered}
                onChange={() => handleAnswer(option)}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    );
  };

  const renderVisualPick = (content: VisualPickQuizQuestion) => {
    return (
      <div className={styles.visualGrid} role="group" aria-label="Visual answer options">
        {content.imageOptions.map((option) => {
          const isSelected = selectedValue === option.label;
          return (
            <button
              type="button"
              key={option.label}
              className={styles.visualOption}
              data-selected={isSelected}
              data-disabled={hasAnswered}
              onClick={() => handleAnswer(option.label)}
              disabled={hasAnswered}
            >
              <span className={styles.visualLabel}>{option.label}</span>
              <img src={option.src} alt={option.alt ?? `Option ${option.label}`} />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <article className={styles.card} aria-live="polite">
      <header>
        <p className={styles.helper}>
          Question {questionIndex + 1} of {totalQuestions}
        </p>
        <p id={`quiz-question-${questionIndex}-prompt`} className={styles.prompt}>
          {question.question}
        </p>
        {question.helperText && <p className={styles.helper}>{question.helperText}</p>}
      </header>

      {question.type === "multiple-choice"
        ? renderMultipleChoice(question)
        : renderVisualPick(question)}

      {hasAnswered && (
        <p className={styles.feedback} data-correct={isCorrect}>
          {feedbackMessage}
        </p>
      )}
    </article>
  );
};

export default QuizQuestion;
