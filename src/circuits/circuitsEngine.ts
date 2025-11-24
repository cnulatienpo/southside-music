import { CircuitChoice, CircuitContext, CircuitScene, CircuitTopic } from "./circuitsTypes";

export interface CircuitsEngine {
  selectSceneForTopic(topic: CircuitTopic, context: CircuitContext): Promise<CircuitScene>;
  logSceneExit(params: {
    userId: string;
    scene: CircuitScene;
    choice: CircuitChoice;
    context?: CircuitContext;
  }): Promise<void>;
}
