import { TOPICS, type TopicId } from "@/constants/topics";
import { useT } from "@/hooks/use-locale";
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
  const t = useT();
  return (
    <fieldset className="doodle-card w-full p-5 text-left">
      <legend className="sr-only">{t.lobby.topicLegend}</legend>
      <h2 className="text-lg font-bold">{t.lobby.topicTitle}</h2>
      <p className="text-sm text-ink-soft">{t.lobby.topicHint}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <PreferenceChip
            key={topic.id}
            name="topic"
            icon={topic.icon}
            label={t.topics[topic.id]}
            checked={value === topic.id}
            waiting={waiting.has(topic.id)}
            onSelect={() => onChange(topic.id)}
          />
        ))}
      </div>
    </fieldset>
  );
}
