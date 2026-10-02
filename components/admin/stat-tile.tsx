export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="doodle-card flex flex-col gap-0.5 p-4">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="text-3xl font-bold leading-tight tabular-nums">{value}</span>
      {hint && <span className="text-xs text-ink-soft">{hint}</span>}
    </div>
  );
}
