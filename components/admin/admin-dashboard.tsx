"use client";

import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSessionToken } from "@/hooks/use-session";
import { fetchOverview, type OverviewResult } from "@/lib/admin-api";
import {
  formatDuration,
  formatNumber,
  series,
  total,
} from "@/lib/admin-stats";
import type { Overview } from "@/types/admin";
import { DailyColumns } from "./daily-columns";
import { DailyTable } from "./daily-table";
import { FacultyTable } from "./faculty-table";
import { StatTile } from "./stat-tile";

const RANGES = [7, 14, 30];

const PROBLEMS: Record<string, string> = {
  unauthorized: "ต้องล็อกอินก่อนถึงจะดูหน้านี้ได้",
  forbidden: "บัญชีนี้ไม่มีสิทธิ์ดูหน้านี้",
  no_database: "เซิร์ฟเวอร์ยังไม่ได้ต่อฐานข้อมูล เลยยังไม่มีสถิติให้ดู",
  failed: "โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้งนะ",
};

export function AdminDashboard() {
  const token = useSessionToken();
  const [days, setDays] = useState(14);
  const [result, setResult] = useState<OverviewResult | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setResult(await fetchOverview(token, days));
    setLoading(false);
  }, [token, days]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  const problem =
    token === null
      ? PROBLEMS.unauthorized
      : result && !result.ok
        ? PROBLEMS[result.reason]
        : null;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6">
      <header className="flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="doodle-btn flex items-center gap-1.5 px-3 py-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden />
          กลับหน้าแชต
        </Link>
        <h1 className="flex-1 text-2xl font-bold">
          K<span className="text-accent">-</span>THOK รายงานการใช้งาน
        </h1>
        <div className="flex items-center gap-2" role="group" aria-label="ช่วงเวลา">
          {RANGES.map((range) => (
            <label key={range} className="doodle-chip text-sm">
              <input
                type="radio"
                name="range"
                className="sr-only"
                checked={days === range}
                onChange={() => setDays(range)}
              />
              {range} วัน
            </label>
          ))}
          <button
            type="button"
            className="doodle-btn grid size-9 place-items-center"
            aria-label="โหลดข้อมูลใหม่"
            title="โหลดข้อมูลใหม่"
            disabled={loading || !token}
            onClick={() => void load()}
          >
            <RefreshCw
              className={`size-4 ${loading ? "animate-spin" : ""}`}
              aria-hidden
            />
          </button>
        </div>
      </header>

      {problem && (
        <p role="alert" className="doodle-card p-4 font-medium text-danger">
          {problem}
        </p>
      )}
      {!problem && !result && <p className="text-ink-soft">กำลังโหลดข้อมูล…</p>}
      {result?.ok && <Report overview={result.overview} />}
    </main>
  );
}

function Report({ overview }: { overview: Overview }) {
  const pairs = series(overview, "match", 0.5);
  const messages = series(overview, "message");
  const logins = series(overview, "login");
  const calls = series(overview, "call");
  const rooms = total(series(overview, "room"));
  const roomSeconds = total(series(overview, "room_seconds"));
  const up = total(series(overview, "feedback_up"));
  const down = total(series(overview, "feedback_down"));
  const peak = Math.max(0, ...series(overview, "peak_online").map((p) => p.value));
  const today = (points: typeof pairs) => points.at(-1)?.value ?? 0;

  return (
    <>
      <section aria-label="ตอนนี้" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="ห้องที่กำลังคุย"
          value={formatNumber(overview.live.active)}
          hint={`รอจับคู่อีก ${formatNumber(overview.live.waiting)} ห้อง`}
        />
        <StatTile
          label="ผู้ใช้ทั้งหมด"
          value={formatNumber(overview.totals.users)}
          hint={`ใช้งานใน 24 ชม. ${formatNumber(overview.totals.activeLastDay)} คน`}
        />
        <StatTile
          label="จับคู่วันนี้"
          value={formatNumber(today(pairs))}
          hint={`ข้อความวันนี้ ${formatNumber(today(messages))}`}
        />
        <StatTile
          label="ออนไลน์สูงสุด"
          value={formatNumber(peak)}
          hint={`ในช่วง ${overview.days} วัน`}
        />
        <StatTile
          label="เวลาคุยเฉลี่ยต่อห้อง"
          value={rooms > 0 ? formatDuration(roomSeconds / rooms) : "—"}
          hint={`จาก ${formatNumber(rooms)} ห้อง`}
        />
        <StatTile
          label="ความพอใจ"
          value={up + down > 0 ? `${Math.round((up / (up + down)) * 100)}%` : "—"}
          hint={`ชอบ ${formatNumber(up)} · ไม่ชอบ ${formatNumber(down)}`}
        />
        <StatTile
          label="การบล็อก"
          value={formatNumber(overview.totals.blocks)}
          hint="สะสมทั้งหมด"
        />
        <StatTile
          label="บัญชีที่ถูกระงับ"
          value={formatNumber(overview.totals.banned)}
          hint="ณ ตอนนี้"
        />
      </section>

      <section aria-label="รายวัน" className="grid gap-3 md:grid-cols-2">
        <DailyColumns title="การจับคู่" unit="คู่" points={pairs} />
        <DailyColumns title="ข้อความ" unit="ข้อความ" points={messages} />
        <DailyColumns title="การล็อกอิน" unit="ครั้ง" points={logins} />
        <DailyColumns title="สายโทร" unit="สาย" points={calls} />
      </section>

      <DailyTable
        columns={[
          { label: "จับคู่", points: pairs },
          { label: "ข้อความ", points: messages },
          { label: "ล็อกอิน", points: logins },
          { label: "สายโทร", points: calls },
        ]}
      />

      <section className="doodle-card flex flex-col gap-3 p-4">
        <h2 className="font-bold">แยกตามคณะ</h2>
        <p className="-mt-2 text-sm text-ink-soft">
          ผู้ใช้นับสะสม ส่วนคอลัมน์อื่นนับในช่วง {overview.days} วัน
        </p>
        <FacultyTable overview={overview} />
      </section>

      <p className="text-center text-xs text-ink-soft">
        ตัวเลขทั้งหมดเป็นยอดรวม ไม่มีข้อความหรือข้อมูลระบุตัวบุคคล · อัปเดตเมื่อ{" "}
        {new Date(overview.generatedAt).toLocaleTimeString("th-TH")}
      </p>
    </>
  );
}
