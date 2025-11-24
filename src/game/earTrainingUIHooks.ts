import { EarExercise } from "./earExercises";

export interface EarTrainingUIHooks {
  requestSoundPlayback(exercise: EarExercise): Promise<void>;
  requestGestureInput(exercise: EarExercise): Promise<void>;
  requestTapInput(exercise: EarExercise): Promise<void>;
  renderPrompt(prompt: string): Promise<void>;
  renderFollowUp(followUp: string): Promise<void>;
  renderAcknowledgement(ack: string): Promise<void>;
  renderTermIntroduction(term: string): Promise<void>;
}

export class EarTrainingUI implements EarTrainingUIHooks {
  // These hooks are stubs for the UI layer. Implementations should connect to actual UI rendering and I/O.
  public async requestSoundPlayback(): Promise<void> {
    return Promise.resolve();
  }

  public async requestGestureInput(): Promise<void> {
    return Promise.resolve();
  }

  public async requestTapInput(): Promise<void> {
    return Promise.resolve();
  }

  public async renderPrompt(): Promise<void> {
    return Promise.resolve();
  }

  public async renderFollowUp(): Promise<void> {
    return Promise.resolve();
  }

  public async renderAcknowledgement(): Promise<void> {
    return Promise.resolve();
  }

  public async renderTermIntroduction(): Promise<void> {
    return Promise.resolve();
  }
}
