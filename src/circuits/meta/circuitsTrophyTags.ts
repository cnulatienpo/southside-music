import { CircuitTopic } from "../circuitsTypes";
import { StoryChain } from "./circuitsMetaTypes";

export interface TrophyTag {
  id: string;
  label: string;
  description: string;
  evidence?: Record<string, any>;
}

export function deriveTrophyTags(chain: StoryChain): TrophyTag[] {
  const candidates: TrophyTag[] = [];
  const topics = chain.nodes.map((node) => node.topic);
  const uniqueTopics = new Set<CircuitTopic>(topics);

  if (mostlyNight(chain)) {
    candidates.push({
      id: "night-owl",
      label: "Night Owl",
      description: "Most scenes glowed after dark.",
      evidence: { nightScenes: chain.nodes.length },
    });
  }

  if (uniqueTopics.size >= 5) {
    candidates.push({
      id: "wandering-ear",
      label: "Wandering Ear",
      description: "Collected a bouquet of different topics.",
      evidence: { topics: Array.from(uniqueTopics) },
    });
  }

  if (uniqueTopics.size <= 2 && chain.nodes.length > 2) {
    candidates.push({
      id: "stay-on-track",
      label: "Stay-On-Track",
      description: "Kept returning to the same idea on purpose.",
      evidence: { dominantTopic: topics[0] },
    });
  }

  if (streakCount(topics, (topic) => containsAny(topic, ["bass", "low", "sub"])) >= 2) {
    candidates.push({
      id: "bass-goblin",
      label: "Bass Goblin",
      description: "Chased the rumble across scenes.",
      evidence: { bassMoments: topics.filter((topic) => containsAny(topic, ["bass", "low", "sub"])).length },
    });
  }

  if (containsTransit(topics)) {
    candidates.push({
      id: "municipal-tourist",
      label: "Municipal Tourist",
      description: "Collected sounds from platforms, stops, and plazas.",
      evidence: { trail: topics.filter((topic) => containsAny(topic, ["bus", "metro", "platform", "courtyard"])) },
    });
  }

  if (topics.filter((topic) => containsAny(topic, ["voice", "spoken", "chant", "talk"])).length >= 2) {
    candidates.push({
      id: "talker",
      label: "Talker",
      description: "Let words and voices lead the way.",
      evidence: { voicedScenes: topics.filter((topic) => containsAny(topic, ["voice", "spoken", "chant", "talk"])) },
    });
  }

  if (uniqueTopics.size >= 3 && streakCount(topics, () => true) === topics.length) {
    candidates.push({
      id: "abstract-drifter",
      label: "Abstract Drifter",
      description: "Glitched through unexpected corners just because.",
      evidence: { hops: topics },
    });
  }

  if (!candidates.length) {
    candidates.push({
      id: "circuit-wanderer",
      label: "Circuit Wanderer",
      description: "Walked the route with curiosity and no scoreboard.",
    });
  }

  return shuffle(candidates).slice(0, Math.min(3, candidates.length));
}

function mostlyNight(chain: StoryChain): boolean {
  const nightHints = chain.nodes.filter((node) => {
    const topic = node.topic.toLowerCase();
    const sceneId = node.sceneId.toLowerCase();
    const metadata = node.metadata ?? {};
    const timeOfDay = (metadata.timeOfDay ?? metadata.time_of_day) as string | undefined;

    return (
      topic.includes("night") ||
      sceneId.includes("night") ||
      (typeof timeOfDay === "string" && timeOfDay.toLowerCase().includes("night"))
    );
  });

  return nightHints.length >= Math.max(2, Math.floor(chain.nodes.length / 2));
}

function streakCount(topics: CircuitTopic[], predicate: (topic: CircuitTopic) => boolean): number {
  let best = 0;
  let current = 0;

  for (const topic of topics) {
    if (predicate(topic)) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }

  return best;
}

function containsAny(topic: CircuitTopic, needles: string[]): boolean {
  const value = topic.toLowerCase();
  return needles.some((needle) => value.includes(needle));
}

function containsTransit(topics: CircuitTopic[]): boolean {
  return topics.some((topic) => containsAny(topic, ["bus", "metro", "stop", "station", "platform", "courtyard"]));
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}
