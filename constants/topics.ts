import {
  BookOpen,
  Gamepad2,
  HeartHandshake,
  MessagesSquare,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export const TOPICS = [
  { id: "general", label: "คุยทั่วไป", icon: MessagesSquare },
  { id: "study", label: "ติวสอบ", icon: BookOpen },
  { id: "games", label: "เกม", icon: Gamepad2 },
  { id: "vent", label: "อยากระบาย", icon: HeartHandshake },
  { id: "food", label: "หาเพื่อนกินข้าว", icon: UtensilsCrossed },
] as const satisfies readonly { id: string; label: string; icon: LucideIcon }[];

export type TopicId = (typeof TOPICS)[number]["id"];

export const DEFAULT_TOPIC: TopicId = "general";

export function topicOf(id: string | null | undefined) {
  return TOPICS.find((topic) => topic.id === id);
}
