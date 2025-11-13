import React, { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./ChatThread.module.css";

export type ChatSpeaker = "system" | "user";

export interface ChatMessage {
  id: string;
  speaker: ChatSpeaker;
  text: string;
}

interface ChatThreadProps {
  prompts?: string[];
  onUserMessage?: (message: ChatMessage, history: ChatMessage[]) => void;
}

const DEFAULT_PROMPTS = [
  "What did you hear?",
  "Where did the drums kick in?",
  "Was it easy to hear the beat this time?",
];

const createMessage = (speaker: ChatSpeaker, text: string): ChatMessage => ({
  id: `${speaker}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  speaker,
  text,
});

const ChatThread: React.FC<ChatThreadProps> = ({ prompts, onUserMessage }) => {
  const script = useMemo(() => (prompts?.length ? prompts : DEFAULT_PROMPTS), [prompts]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [nextPromptIndex, setNextPromptIndex] = useState(0);

  useEffect(() => {
    const initialPrompt = script[0];
    if (initialPrompt) {
      setMessages([createMessage("system", initialPrompt)]);
      setNextPromptIndex(1);
    } else {
      setMessages([]);
      setNextPromptIndex(0);
    }
  }, [script]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = createMessage("user", trimmed);
    setMessages((current) => {
      const withUser = [...current, userMessage];
      const prompt = script[nextPromptIndex];
      if (prompt) {
        const systemMessage = createMessage("system", prompt);
        setNextPromptIndex((index) => index + 1);
        return [...withUser, systemMessage];
      }
      return withUser;
    });

    setInput("");
    onUserMessage?.(userMessage, [...messages, userMessage]);
  };

  return (
    <section className={styles.thread} aria-label="Reflection thread">
      <div className={styles.messages}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${message.speaker === "system" ? styles.system : styles.user}`}
            role="text"
          >
            {message.text}
          </div>
        ))}
      </div>
      <form className={styles.composer} onSubmit={handleSubmit}>
        <label htmlFor="chat-input" className="sr-only">
          Your reflection
        </label>
        <textarea
          id="chat-input"
          placeholder="Type what you noticed in the music..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button className={styles.submit} type="submit" disabled={!input.trim()}>
          Send Reflection
        </button>
      </form>
    </section>
  );
};

export default ChatThread;
