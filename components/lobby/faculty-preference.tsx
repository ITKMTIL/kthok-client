import { Dices } from "lucide-react";
import { FACULTIES, type FacultyId } from "@/constants/faculties";
import { PreferenceChip } from "./preference-chip";

export function FacultyPreference({
  value,
  waiting,
  onChange,
}: {
  value: FacultyId | null;
  waiting: ReadonlySet<string>;
  onChange: (value: FacultyId | null) => void;
}) {
  return (
    <fieldset className="doodle-card w-full p-5 text-left">
      <legend className="sr-only">อยากคุยกับคณะไหน</legend>
      <h2 className="text-lg font-bold">อยากคุยกับคณะไหน?</h2>
      <p className="text-sm text-ink-soft">
        ถ้าไม่มีคนคณะนั้นรออยู่ เดี๋ยวพาไปห้องที่ว่างแทน
        <span className="ml-1 inline-flex items-center gap-1 whitespace-nowrap">
          <span className="size-2.5 rounded-full border-2 border-ink bg-online" aria-hidden />
          = มีคนรออยู่
        </span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <PreferenceChip
          name="prefer-faculty"
          icon={Dices}
          label="ใครก็ได้"
          checked={value === null}
          onSelect={() => onChange(null)}
        />
        {FACULTIES.map((faculty) => (
          <PreferenceChip
            key={faculty.id}
            name="prefer-faculty"
            icon={faculty.icon}
            label={faculty.short}
            title={faculty.name}
            checked={value === faculty.id}
            waiting={waiting.has(faculty.id)}
            onSelect={() => onChange(faculty.id)}
          />
        ))}
      </div>
    </fieldset>
  );
}
