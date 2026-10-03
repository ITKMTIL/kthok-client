import {
  AudioLines,
  BookOpen,
  Bot,
  Cog,
  DraftingCompass,
  FlaskConical,
  Globe,
  Laptop,
  Microscope,
  Plane,
  Presentation,
  Smile,
  Soup,
  Sprout,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import type { Dict } from "@/lib/i18n";

export const FACULTIES = [
  { id: "engineering", icon: Cog },
  { id: "architecture", icon: DraftingCompass },
  { id: "industrial-education", icon: Presentation },
  { id: "agricultural-technology", icon: Sprout },
  { id: "science", icon: Microscope },
  { id: "food-industry", icon: Soup },
  { id: "information-technology", icon: Laptop },
  { id: "business", icon: TrendingUp },
  { id: "liberal-arts", icon: BookOpen },
  { id: "medicine", icon: Stethoscope },
  { id: "dentistry", icon: Smile },
  { id: "international-college", icon: Globe },
  { id: "materials-innovation", icon: FlaskConical },
  { id: "advanced-manufacturing", icon: Bot },
  { id: "aviation", icon: Plane },
  { id: "music-engineering", icon: AudioLines },
] as const;

export type Faculty = (typeof FACULTIES)[number];
export type FacultyId = Faculty["id"];

export function facultyOf(id: string): Faculty | undefined {
  return FACULTIES.find((faculty) => faculty.id === id);
}

export function facultyText(
  dict: Dict,
  id: string,
): { name: string; short: string } | undefined {
  const faculty = facultyOf(id);
  return faculty && dict.faculties[faculty.id];
}
