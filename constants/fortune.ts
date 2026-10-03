export const BIRTH_DAYS = [
  { id: "sun", color: "#e53935" },
  { id: "mon", color: "#f2c230" },
  { id: "tue", color: "#f48fb1" },
  { id: "wed", color: "#43a047" },
  { id: "rahu", color: "#5f5f5f" },
  { id: "thu", color: "#fb8c00" },
  { id: "fri", color: "#4fc3f7" },
  { id: "sat", color: "#8e24aa" },
] as const;

export type BirthDay = (typeof BIRTH_DAYS)[number]["id"];

export type TaksaPosition =
  | "boriwan"
  | "ayu"
  | "det"
  | "sri"
  | "mula"
  | "utsaha"
  | "montri"
  | "kalakini";
