import type { LucideIcon } from "lucide-react";
import { useT } from "@/hooks/use-locale";

export function PreferenceChip({
  name,
  icon: Icon,
  label,
  title,
  checked,
  waiting,
  onSelect,
}: {
  name: string;
  icon: LucideIcon;
  label: string;
  title?: string;
  checked: boolean;
  waiting?: boolean;
  onSelect: () => void;
}) {
  const t = useT();
  return (
    <label className="doodle-chip relative flex items-center gap-1.5" title={title}>
      <input
        type="radio"
        name={name}
        className="sr-only"
        checked={checked}
        onChange={onSelect}
      />
      <Icon className="size-4" aria-hidden />
      {label}
      {waiting && (
        <>
          <span
            className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-ink bg-online"
            aria-hidden
          />
          <span className="sr-only">{t.lobby.waitingSr}</span>
        </>
      )}
    </label>
  );
}
