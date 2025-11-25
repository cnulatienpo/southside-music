// Custom type declarations for external modules that lack typings in this project.
declare module "better-sqlite3" {
  type Statement = any;
  interface Database {
    prepare: (...args: any[]) => Statement;
    exec: (...args: any[]) => void;
    close: () => void;
  }

  const BetterSqlite3: {
    new (filename: string, options?: any): Database;
    prototype: Database;
  };

  export default BetterSqlite3;
}

declare module "youtube-player" {
  const YouTubePlayer: any;
  export default YouTubePlayer;
}

declare module "wavesurfer.js" {
  const WaveSurfer: any;
  export default WaveSurfer;
}

declare module "lowdb" {
  export class Low<T> {
    constructor(adapter: any);
    data: T | null;
    read(): Promise<void>;
    write(): Promise<void>;
  }

  export class JSONFile<T> {
    constructor(filename: string);
  }
}

declare module "dayjs" {
  interface Dayjs {
    format(template?: string): string;
    toISOString(): string;
    diff(input?: string | number | Date | Dayjs, unit?: string, precise?: boolean): number;
  }

  function dayjs(input?: string | number | Date | null): Dayjs;
  export default dayjs;
}

// Stub audio engine module used throughout the app.
declare module "../audio/audioEngine" {
  const audioEngine: any;
  export default audioEngine;
}

// Stub speech recognition types for browsers without @types/web-speech-api support.
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  abort(): void;
  start(): void;
  stop(): void;
  interimResults?: boolean;
  continuous?: boolean;
  onresult?: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror?: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend?: ((this: SpeechRecognition, ev: Event) => any) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare const SpeechRecognition: SpeechRecognitionConstructor | undefined;
declare const webkitSpeechRecognition: SpeechRecognitionConstructor | undefined;
