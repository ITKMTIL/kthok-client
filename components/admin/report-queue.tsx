"use client";

import { Ban, Check, LockOpen, RefreshCw, ShieldAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { facultyOf } from "@/constants/faculties";
import { fetchReports, resolveReport, unbanUser } from "@/lib/admin-api";
import type { AdminReport, BanDays } from "@/types/admin";

const REASON_LABELS: Record<string, string> = {
  harassment: "คุกคาม ก่อกวน",
  sexual: "เรื่องทางเพศ",
  hate: "ด่าทอ เหยียด",
  spam: "สแปม หลอกลวง",
  other: "อื่น ๆ",
};

const STATUS_LABELS: Record<AdminReport["status"], string> = {
  open: "รอตรวจ",
  dismissed: "ยกฟ้อง",
  actioned: "แบนแล้ว",
};

const BAN_OPTIONS: { days: BanDays; label: string }[] = [
  { days: 1, label: "1 วัน" },
  { days: 7, label: "7 วัน" },
  { days: 30, label: "30 วัน" },
  { days: null, label: "ถาวร" },
];

const formatTime = (at: number) =>
  new Date(at).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export function ReportQueue({ token }: { token: string }) {
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [reports, setReports] = useState<AdminReport[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchReports(token, status);
    setFailed(result === null);
    setReports(result);
    setLoading(false);
  }, [token, status]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  return (
    <section className="flex flex-col gap-3" aria-label="รายงานจากผู้ใช้">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="flex flex-1 items-center gap-1.5 text-xl font-bold">
          <ShieldAlert className="size-5" aria-hidden />
          รายงานจากผู้ใช้
        </h2>
        {(["open", "closed"] as const).map((value) => (
          <label key={value} className="doodle-chip text-sm">
            <input
              type="radio"
              name="report-status"
              className="sr-only"
              checked={status === value}
              onChange={() => setStatus(value)}
            />
            {value === "open" ? "รอตรวจ" : "ตัดสินแล้ว"}
          </label>
        ))}
        <button
          type="button"
          className="doodle-btn grid size-9 place-items-center"
          aria-label="โหลดรายงานใหม่"
          disabled={loading}
          onClick={() => void load()}
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
        </button>
      </div>
      <p className="-mt-2 text-sm text-ink-soft">
        เห็นเฉพาะข้อความที่ผู้รายงานเลือกแนบ ไม่มีชื่อหรือรหัสนักศึกษา รายงานลบเองหลัง 30 วัน
      </p>

      {failed && (
        <p role="alert" className="doodle-card p-4 font-medium text-danger">
          โหลดรายงานไม่สำเร็จ
        </p>
      )}
      {reports?.length === 0 && (
        <p className="doodle-card p-4 text-ink-soft">
          {status === "open" ? "ไม่มีรายงานค้าง เยี่ยมเลย" : "ยังไม่มีรายงานที่ตัดสินแล้ว"}
        </p>
      )}
      {reports?.map((report) => (
        <ReportCard key={report.id} report={report} token={token} onChanged={() => void load()} />
      ))}
    </section>
  );
}

function ReportCard({
  report,
  token,
  onChanged,
}: {
  report: AdminReport;
  token: string;
  onChanged: () => void;
}) {
  const [days, setDays] = useState<BanDays>(7);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now] = useState(Date.now);
  const faculty = facultyOf(report.reported.faculty);
  const banned =
    report.reported.bannedUntil !== null && report.reported.bannedUntil > now;

  async function act(run: () => Promise<boolean>) {
    setBusy(true);
    setError(null);
    const ok = await run();
    setBusy(false);
    if (ok) onChanged();
    else setError("ทำรายการไม่สำเร็จ ลองใหม่อีกครั้ง");
  }

  return (
    <article className="doodle-card flex flex-col gap-3 p-4">
      <header className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border-2 border-ink bg-accent-soft px-2 text-sm font-bold">
          {REASON_LABELS[report.reason] ?? report.reason}
        </span>
        <span className="text-sm text-ink-soft">{formatTime(report.createdAt)}</span>
        {report.status !== "open" && (
          <span className="text-sm font-bold">{STATUS_LABELS[report.status]}</span>
        )}
        <span className="ml-auto text-sm">
          ผู้ใช้ #{report.reported.ref} · {faculty?.short ?? report.reported.faculty}
        </span>
      </header>

      <p className="text-sm">
        ถูกรายงาน {report.reported.reports30d} ครั้งใน 30 วัน · ถูกบล็อก {report.reported.blocks7d} ครั้งใน 7 วัน
        {banned && (
          <span className="ml-2 font-bold text-danger">
            ระงับถึง {formatTime(report.reported.bannedUntil ?? 0)}
          </span>
        )}
      </p>

      {!report.evidenceReadable ? (
        <p className="text-sm text-danger">ถอดรหัสหลักฐานไม่ได้ (SESSION_SECRET อาจถูกเปลี่ยน)</p>
      ) : (
        <>
          {report.note && (
            <blockquote className="rounded-xl border-l-4 border-ink bg-paper px-3 py-2 text-sm">
              {report.note}
            </blockquote>
          )}
          {report.messages.length > 0 ? (
            <ol className="flex flex-col gap-1">
              {report.messages.map((message, index) => (
                <li
                  key={index}
                  className={`bubble max-w-[85%] text-sm ${message.fromReported ? "bubble-theirs self-start" : "bubble-mine self-end"}`}
                >
                  <span className="mr-1 font-bold">
                    {message.fromReported ? "ผู้ถูกรายงาน:" : "ผู้รายงาน:"}
                  </span>
                  {message.text}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-ink-soft">ไม่ได้แนบข้อความ</p>
          )}
        </>
      )}

      {report.status === "open" ? (
        <div className="flex flex-col gap-2 border-t-2 border-dashed border-ink pt-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="ระยะเวลาระงับ">
            {BAN_OPTIONS.map((option) => (
              <label key={option.label} className="doodle-chip text-sm">
                <input
                  type="radio"
                  name={`ban-days-${report.id}`}
                  className="sr-only"
                  checked={days === option.days}
                  onChange={() => setDays(option.days)}
                />
                {option.label}
              </label>
            ))}
          </div>
          <input
            className="doodle-field text-sm"
            value={reason}
            maxLength={200}
            placeholder="เหตุผลการระงับ (ห้ามใส่ข้อมูลระบุตัวตน)"
            aria-label="เหตุผลการระงับ"
            onChange={(event) => setReason(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="doodle-btn flex items-center gap-1.5 bg-danger px-3 py-1.5 text-sm font-bold text-card"
              disabled={busy}
              onClick={() =>
                act(() =>
                  resolveReport(token, report.id, {
                    action: "ban",
                    days,
                    reason: reason.trim(),
                  }),
                )
              }
            >
              <Ban className="size-4" aria-hidden />
              ระงับบัญชี
            </button>
            <button
              type="button"
              className="doodle-btn flex items-center gap-1.5 px-3 py-1.5 text-sm"
              disabled={busy}
              onClick={() => act(() => resolveReport(token, report.id, { action: "dismiss" }))}
            >
              <Check className="size-4" aria-hidden />
              ยกฟ้อง
            </button>
          </div>
        </div>
      ) : (
        banned && (
          <button
            type="button"
            className="doodle-btn flex w-fit items-center gap-1.5 px-3 py-1.5 text-sm"
            disabled={busy}
            onClick={() => act(() => unbanUser(token, report.reported.ref))}
          >
            <LockOpen className="size-4" aria-hidden />
            ปลดระงับ
          </button>
        )
      )}
      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </article>
  );
}
