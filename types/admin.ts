export interface DailyRow {
  day: string;
  metric: string;
  faculty: string | null;
  count: number;
}

export interface Overview {
  days: number;
  today: string;
  generatedAt: number;
  live: { waiting: number; active: number };
  totals: { users: number; activeLastDay: number; banned: number; blocks: number };
  usersByFaculty: { faculty: string; count: number }[];
  daily: DailyRow[];
}
