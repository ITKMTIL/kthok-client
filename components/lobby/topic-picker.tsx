import { TOPICS, type TopicId } from "@/constants/topics";
import { PreferenceChip } from "./preference-chip";

export function TopicPicker({
  value,
  waiting,
  onChange,
}: {
  value: TopicId;
  waiting: ReadonlySet<string>;
  onChange: (value: TopicId) => void;
}) {
  return (
    <fieldset className="doodle-card w-full p-5 text-left">
      <legend className="sr-only">อยากคุยเรื่องอะไร</legend>
      <h2 className="text-lg font-bold">อยากคุยเรื่องอะไร?</h2>
      <p className="text-sm text-ink-soft">จับคู่เฉพาะคนที่เลือกหัวข้อเดียวกัน</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <PreferenceChip
            key={topic.id}
            name="topic"
            icon={topic.icon}
            label={topic.label}
            checked={value === topic.id}
            waiting={waiting.has(topic.id)}
            onSelect={() => onChange(topic.id)}
          />
        ))}
      </div>
    </fieldset>
  );
}
