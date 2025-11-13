import React from "react";
import styles from "./TheoryCard.module.css";

export interface MediaExample {
  source: "youtube" | "soundcloud";
  title: string;
  artist?: string;
  url: string;
}

export interface TheoryCardContent {
  id: string;
  title: string;
  content: string;
  category?: string;
  examples: MediaExample[];
}

interface TheoryCardProps {
  card: TheoryCardContent;
}

const TheoryCard: React.FC<TheoryCardProps> = ({ card }) => {
  return (
    <article className={styles.card}>
      {card.category && <span className={styles.category}>{card.category}</span>}
      <h2 className={styles.title}>{card.title}</h2>
      <p className={styles.content}>{card.content}</p>
    </article>
  );
};

export default TheoryCard;
