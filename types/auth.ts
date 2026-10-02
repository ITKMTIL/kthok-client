import type { FacultyId } from "@/constants/faculties";

export interface StoredProfile {
  nickname: string;
  faculty?: FacultyId;
}

export interface Profile {
  nickname: string;
  faculty: FacultyId | null;
}
