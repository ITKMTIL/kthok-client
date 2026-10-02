import type { DailyRow, Overview } from "@/types/admin";

const DAY_MS = 86_400_000;

export interface DayPoint {
  day: string;
  value: number;
}

export function dayRange(today: string, days: number): string[] {
  const end = Date.parse(`${today}T00:00:00Z`);
  return Array.from({ length: days }, (_, index) =>
    new Date(end - (days - 1 - index) * DAY_MS).toISOString().slice(0, 10),
  );
}

export function sumBy(
  rows: DailyRow[],
  metric: string,
  key: (row: DailyRow) => string,
): Map<string, number> {
  const totals = new Map<string, number>();
  for (const row of rows) {
    if (row.metric !== metric) continue;
    totals.set(key(row), (totals.get(key(row)) ?? 0) + row.count);
  }
  return totals;
}

export function series(
  overview: Overview,
  metric: string,
  scale = 1,
): DayPoint[] {
  const perDay = sumBy(overview.daily, metric, (row) => row.day);
  return dayRange(overview.today, overview.days).map((day) => ({
    day,
    value: Math.round((perDay.get(day) ?? 0) * scale),
  }));
}

export function total(points: DayPoint[]): number {
  return points.reduce((sum, point) => sum + point.value, 0);
}

export function formatNumber(value: number): string {
  return value.toLocaleString("th-TH");
}

export function formatDay(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} วิ`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes} นาที ${Math.round(seconds % 60)} วิ`;
}
