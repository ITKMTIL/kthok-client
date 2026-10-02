import { facultyOf } from "@/constants/faculties";
import { formatNumber, sumBy } from "@/lib/admin-stats";
import type { Overview } from "@/types/admin";

export function FacultyTable({ overview }: { overview: Overview }) {
  const byFaculty = (metric: string) =>
    sumBy(overview.daily, metric, (row) => row.faculty ?? "");
  const matches = byFaculty("match");
  const requested = byFaculty("preference_requested");
  const met = byFaculty("preference_met");
  const users = new Map(
    overview.usersByFaculty.map((row) => [row.faculty, row.count]),
  );

  const ids = [
    ...new Set([...users.keys(), ...matches.keys(), ...requested.keys()]),
  ].filter(Boolean);
  const rows = ids
    .map((id) => ({
      id,
      name: facultyOf(id)?.name ?? id,
      users: users.get(id) ?? 0,
      matches: matches.get(id) ?? 0,
      requested: requested.get(id) ?? 0,
      met: met.get(id) ?? 0,
    }))
    .sort((a, b) => b.users - a.users || b.matches - a.matches);
  const maxUsers = Math.max(1, ...rows.map((row) => row.users));

  if (rows.length === 0) {
    return <p className="text-sm text-ink-soft">ยังไม่มีข้อมูลรายคณะ</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-ink text-left">
            <th scope="col" className="py-2 pr-3 font-bold">คณะ</th>
            <th scope="col" className="w-2/5 py-2 pr-3 font-bold">ผู้ใช้ทั้งหมด</th>
            <th scope="col" className="py-2 pr-3 text-right font-bold">เข้าห้อง</th>
            <th scope="col" className="py-2 pr-3 text-right font-bold">ถูกขอคุยด้วย</th>
            <th scope="col" className="py-2 text-right font-bold">ได้ตรงตามขอ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-ink/15">
              <th scope="row" className="py-2 pr-3 text-left font-medium">
                {row.name}
              </th>
              <td className="py-2 pr-3">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 rounded-r bg-accent"
                    style={{ width: `${(row.users / maxUsers) * 70}%` }}
                    aria-hidden
                  />
                  <span className="tabular-nums">{formatNumber(row.users)}</span>
                </span>
              </td>
              <td className="py-2 pr-3 text-right tabular-nums">
                {formatNumber(row.matches)}
              </td>
              <td className="py-2 pr-3 text-right tabular-nums">
                {formatNumber(row.requested)}
              </td>
              <td className="py-2 text-right tabular-nums">
                {row.requested > 0
                  ? `${Math.round((row.met / row.requested) * 100)}%`
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
