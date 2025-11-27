export type MicCommand = "record" | "stop" | "mark";

export class CommandRecognition {
  parse(transcript: string): MicCommand | null {
    if (transcript.includes("record")) return "record";
    if (transcript.includes("stop")) return "stop";
    if (transcript.includes("mark")) return "mark";
    return null;
  }
}
