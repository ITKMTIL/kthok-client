import type { AdminReport, BanDays, Overview } from "@/types/admin";
import { CORE_URL } from "./config";

export type OverviewResult =
  | { ok: true; overview: Overview }
  | { ok: false; reason: "unauthorized" | "forbidden" | "no_database" | "failed" };

const REASONS: Record<number, "unauthorized" | "forbidden" | "no_database"> = {
  401: "unauthorized",
  403: "forbidden",
  503: "no_database",
};

export async function fetchOverview(
  token: string,
  days: number,
): Promise<OverviewResult> {
  try {
    const response = await fetch(`${CORE_URL}/admin/overview?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      return { ok: false, reason: REASONS[response.status] ?? "failed" };
    }
    return { ok: true, overview: (await response.json()) as Overview };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

export async function fetchReports(
  token: string,
  status: "open" | "closed",
): Promise<AdminReport[] | null> {
  try {
    const response = await fetch(`${CORE_URL}/admin/reports?status=${status}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return ((await response.json()) as { reports: AdminReport[] }).reports;
  } catch {
    return null;
  }
}

async function post(
  token: string,
  path: string,
  body?: unknown,
  method: "POST" | "DELETE" = "POST",
) {
  try {
    const response = await fetch(`${CORE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function resolveReport(
  token: string,
  id: number,
  decision: { action: "dismiss" } | { action: "ban"; days: BanDays; reason: string },
): Promise<boolean> {
  return post(token, `/admin/reports/${id}/resolve`, decision);
}

export function unbanUser(token: string, userRef: number): Promise<boolean> {
  return post(token, `/admin/users/${userRef}/unban`);
}

export interface WordList {
  defaults: string[];
  custom: { id: number; word: string; createdAt: number }[];
}

export async function fetchWords(token: string): Promise<WordList | null> {
  try {
    const response = await fetch(`${CORE_URL}/admin/words`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return response.ok ? ((await response.json()) as WordList) : null;
  } catch {
    return null;
  }
}

export function addWord(token: string, word: string): Promise<boolean> {
  return post(token, "/admin/words", { word });
}

export function removeWord(token: string, id: number): Promise<boolean> {
  return post(token, `/admin/words/${id}`, undefined, "DELETE");
}
