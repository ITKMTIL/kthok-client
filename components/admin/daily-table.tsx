import { formatDay, formatNumber, type DayPoint } from "@/lib/admin-stats";

export function DailyTable({
  columns,
}: {
  columns: { label: string; points: DayPoint[] }[];
}) {
  const days = columns[0]?.points.map((point) => point.day) ?? [];

  return (
    <details className="doodle-card p-4">
      <summary className="cursor-pointer font-bold">ดูตัวเลขรายวันเป็นตาราง</summary>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-right">
              <th scope="col" className="py-2 pr-3 text-left font-bold">วัน</th>
              {columns.map((column) => (
                <th key={column.label} scope="col" className="py-2 pl-3 font-bold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => (
              <tr key={day} className="border-b border-ink/15 text-right">
                <th scope="row" className="py-1.5 pr-3 text-left font-medium">
                  {formatDay(day)}
                </th>
                {columns.map((column) => (
                  <td key={column.label} className="py-1.5 pl-3 tabular-nums">
                    {formatNumber(column.points[index].value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
