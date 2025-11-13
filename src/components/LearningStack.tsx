import React, { useEffect, useState } from "react";
import ChatThread, { ChatMessage } from "./ChatThread";
import EmbeddedPlayer from "./EmbeddedPlayer";
import TheoryCard, { TheoryCardContent } from "./TheoryCard";
import styles from "./LearningStack.module.css";

interface LearningStackProps {
  card: TheoryCardContent;
  prompts?: string[];
  onReadyForQuiz: (card: TheoryCardContent) => void;
}

const LearningStack: React.FC<LearningStackProps> = ({ card, prompts, onReadyForQuiz }) => {
  const [playedExampleUrls, setPlayedExampleUrls] = useState<string[]>([]);
  const [hasUserMessage, setHasUserMessage] = useState(false);

  useEffect(() => {
    setPlayedExampleUrls([]);
    setHasUserMessage(false);
  }, [card.id]);

  const hasPlayedExample = playedExampleUrls.length > 0;
  const isReadyToContinue = hasPlayedExample && hasUserMessage;

  const handlePlayed = (url: string) => {
    setPlayedExampleUrls((current) => (current.includes(url) ? current : [...current, url]));
  };

  const handleReadyClick = () => {
    if (isReadyToContinue) {
      onReadyForQuiz(card);
    }
  };

  return (
    <div className={styles.stack}>
      <TheoryCard card={card} />

      <div>
        <p className={styles.sectionTitle}>Listen &amp; feel</p>
        <div className={styles.examples}>
          {card.examples.map((example) => (
            <EmbeddedPlayer
              key={`${example.source}-${example.url}`}
              {...example}
              onPlayed={() => handlePlayed(example.url)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className={styles.sectionTitle}>Reflect</p>
        <ChatThread
          key={card.id}
          prompts={prompts}
          onUserMessage={(message: ChatMessage) => {
            if (message.speaker === "user") {
              setHasUserMessage(true);
            }
          }}
        />
      </div>

      {isReadyToContinue && (
        <div className={styles.cta}>
          <button className={styles.ready} onClick={handleReadyClick} type="button">
            Ready to Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default LearningStack;
