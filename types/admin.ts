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
  totals: {
    users: number;
    activeLastDay: number;
    banned: number;
    blocks: number;
    openReports?: number;
  };
  usersByFaculty: { faculty: string; count: number }[];
  daily: DailyRow[];
}

export interface AdminReport {
  id: number;
  reason: string;
  status: "open" | "dismissed" | "actioned";
  createdAt: number;
  expiresAt: number;
  resolvedAt: number | null;
  note: string;
  messages: { fromReported: boolean; text: string }[];
  evidenceReadable: boolean;
  reported: {
    ref: number;
    faculty: string;
    bannedUntil: number | null;
    reports30d: number;
    blocks7d: number;
  };
}

export type BanDays = 1 | 7 | 30 | null;
