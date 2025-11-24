export type CircuitTopic = string;

export type CircuitToolId = string;

export type CircuitLevel = "basic" | "intermediate" | "advanced";

export interface CircuitConstraint {
  requiredTools: CircuitToolId[];
  optionalTools?: CircuitToolId[];
}

export interface CircuitChoice {
  id: string;
  label: string;
  nextTopic: CircuitTopic;
  metadata?: Record<string, any>;
}

export interface CircuitScene {
  id: string;
  topic: CircuitTopic;
  npcDescription: string;
  settingText: string;
  excuse: string;
  constraint: CircuitConstraint;
  choices: CircuitChoice[];
  level?: CircuitLevel;
  metadata?: Record<string, any>;
}

export interface CircuitContext {
  topic: CircuitTopic;
  level: CircuitLevel;
  seenTools: CircuitToolId[];
  previousSceneId?: string;
  previousChoiceId?: string;
}
