import { CircuitConstraint, CircuitTopic } from "../circuitsTypes";

export interface StoryChainNode {
  sceneId: string;
  topic: CircuitTopic;
  npcId?: string;
  npcName?: string;
  choiceId?: string;
  choiceLabel?: string;
  constraint?: CircuitConstraint;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface StoryChain {
  id: string;
  userId: string;
  createdAt: string;
  nodes: StoryChainNode[];
  metadata?: Record<string, any>;
}

export type SouvenirType = "sticker" | "scrap" | "quote" | "shape" | "ticket";

export interface Souvenir {
  id: string;
  userId: string;
  label: string;
  type: SouvenirType | string;
  metadata: Record<string, any>;
  createdAt: string;
}
