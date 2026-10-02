import type { Overview } from "@/types/admin";
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
