export const FACULTIES = [
  { id: "engineering", name: "วิศวกรรมศาสตร์", short: "วิศวะ", emoji: "⚙️" },
  { id: "architecture", name: "สถาปัตยกรรม ศิลปะและการออกแบบ", short: "สถาปัตย์", emoji: "📐" },
  { id: "industrial-education", name: "ครุศาสตร์อุตสาหกรรมและเทคโนโลยี", short: "ครุฯ", emoji: "🧑‍🏫" },
  { id: "agricultural-technology", name: "เทคโนโลยีการเกษตร", short: "เกษตร", emoji: "🌱" },
  { id: "science", name: "วิทยาศาสตร์", short: "วิทยา", emoji: "🔬" },
  { id: "food-industry", name: "อุตสาหกรรมอาหาร", short: "อุตฯ อาหาร", emoji: "🍜" },
  { id: "information-technology", name: "เทคโนโลยีสารสนเทศ", short: "ไอที", emoji: "💻" },
  { id: "business", name: "บริหารธุรกิจ", short: "บริหาร", emoji: "📈" },
  { id: "liberal-arts", name: "ศิลปศาสตร์", short: "ศิลปศาสตร์", emoji: "📚" },
  { id: "medicine", name: "แพทยศาสตร์", short: "แพทย์", emoji: "🩺" },
  { id: "dentistry", name: "ทันตแพทยศาสตร์", short: "ทันตะ", emoji: "🦷" },
  { id: "international-college", name: "วิทยาลัยนานาชาติ", short: "อินเตอร์", emoji: "🌏" },
] as const;

export type Faculty = (typeof FACULTIES)[number];
export type FacultyId = Faculty["id"];

export function facultyOf(id: string): Faculty | undefined {
  return FACULTIES.find((faculty) => faculty.id === id);
}
