import { Dices, type LucideIcon } from "lucide-react";
import { FACULTIES, type FacultyId } from "@/constants/faculties";

export function FacultyPreference({
  value,
  onChange,
}: {
  value: FacultyId | null;
  onChange: (value: FacultyId | null) => void;
}) {
  return (
    <fieldset className="doodle-card w-full p-5 text-left">
      <legend className="sr-only">อยากคุยกับคณะไหน</legend>
      <h2 className="text-lg font-bold">อยากคุยกับคณะไหน?</h2>
      <p className="text-sm text-ink-soft">
        ถ้าไม่มีคนคณะนั้นรออยู่ เดี๋ยวพาไปห้องที่ว่างแทน
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <PreferenceChip
          icon={Dices}
          label="ใครก็ได้"
          checked={value === null}
          onSelect={() => onChange(null)}
        />
        {FACULTIES.map((faculty) => (
          <PreferenceChip
            key={faculty.id}
            icon={faculty.icon}
            label={faculty.short}
            title={faculty.name}
            checked={value === faculty.id}
            onSelect={() => onChange(faculty.id)}
          />
        ))}
      </div>
    </fieldset>
  );
}

function PreferenceChip({
  icon: Icon,
  label,
  title,
  checked,
  onSelect,
}: {
  icon: LucideIcon;
  label: string;
  title?: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="doodle-chip flex items-center gap-1.5" title={title}>
      <input
        type="radio"
        name="prefer-faculty"
        className="sr-only"
        checked={checked}
        onChange={onSelect}
      />
      <Icon className="size-4" aria-hidden />
      {label}
    </label>
  );
}
