import { unsubscribeFn } from "./types";

type Listener<T extends (...args: any[]) => void> = T; // eslint-disable-line @typescript-eslint/no-explicit-any

type ListenerMap<TEvents> = {
  [K in keyof TEvents]?: Set<Listener<TEvents[K]>>;
};

export class TypedEventEmitter<TEvents extends Record<string, (...args: any[]) => void>> {
  private listeners: ListenerMap<TEvents> = {};

  subscribe<K extends keyof TEvents>(event: K, cb: Listener<TEvents[K]>): unsubscribeFn {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event]?.add(cb as Listener<TEvents[keyof TEvents]>);
    return () => {
      this.listeners[event]?.delete(cb as Listener<TEvents[keyof TEvents]>);
    };
  }

  emit<K extends keyof TEvents>(event: K, ...args: Parameters<TEvents[K]>): void {
    const callbacks = this.listeners[event];
    if (!callbacks) return;
    callbacks.forEach((cb) => {
      (cb as Listener<TEvents[K]>)(...args);
    });
  }
}
