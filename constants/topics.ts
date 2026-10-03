import {
  BookOpen,
  Gamepad2,
  HeartHandshake,
  MessagesSquare,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export const TOPICS = [
  { id: "general", icon: MessagesSquare },
  { id: "study", icon: BookOpen },
  { id: "games", icon: Gamepad2 },
  { id: "vent", icon: HeartHandshake },
  { id: "food", icon: UtensilsCrossed },
] as const satisfies readonly { id: string; icon: LucideIcon }[];

export type TopicId = (typeof TOPICS)[number]["id"];

export const DEFAULT_TOPIC: TopicId = "general";

export function topicOf(id: string | null | undefined) {
  return TOPICS.find((topic) => topic.id === id);
}
