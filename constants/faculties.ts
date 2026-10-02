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

export const FACULTIES = [
  { id: "engineering", name: "วิศวกรรมศาสตร์", short: "วิศวะ", icon: Cog },
  { id: "architecture", name: "สถาปัตยกรรม ศิลปะและการออกแบบ", short: "สถาปัตย์", icon: DraftingCompass },
  { id: "industrial-education", name: "ครุศาสตร์อุตสาหกรรมและเทคโนโลยี", short: "ครุฯ", icon: Presentation },
  { id: "agricultural-technology", name: "เทคโนโลยีการเกษตร", short: "เกษตร", icon: Sprout },
  { id: "science", name: "วิทยาศาสตร์", short: "วิทยา", icon: Microscope },
  { id: "food-industry", name: "อุตสาหกรรมอาหาร", short: "อุตฯ อาหาร", icon: Soup },
  { id: "information-technology", name: "เทคโนโลยีสารสนเทศ", short: "ไอที", icon: Laptop },
  { id: "business", name: "บริหารธุรกิจ", short: "บริหาร", icon: TrendingUp },
  { id: "liberal-arts", name: "ศิลปศาสตร์", short: "ศิลปศาสตร์", icon: BookOpen },
  { id: "medicine", name: "แพทยศาสตร์", short: "แพทย์", icon: Stethoscope },
  { id: "dentistry", name: "ทันตแพทยศาสตร์", short: "ทันตะ", icon: Smile },
  { id: "international-college", name: "วิทยาลัยนานาชาติ", short: "อินเตอร์", icon: Globe },
  { id: "materials-innovation", name: "วิทยาลัยเทคโนโลยีและนวัตกรรมวัสดุ", short: "วัสดุ", icon: FlaskConical },
  { id: "advanced-manufacturing", name: "วิทยาลัยนวัตกรรมการผลิตขั้นสูง", short: "AMI", icon: Bot },
  { id: "aviation", name: "วิทยาลัยอุตสาหกรรมการบินนานาชาติ", short: "การบิน", icon: Plane },
  { id: "music-engineering", name: "วิทยาลัยวิศวกรรมสังคีต", short: "สังคีต", icon: AudioLines },
] as const;

export type Faculty = (typeof FACULTIES)[number];
export type FacultyId = Faculty["id"];

export function facultyOf(id: string): Faculty | undefined {
  return FACULTIES.find((faculty) => faculty.id === id);
}
