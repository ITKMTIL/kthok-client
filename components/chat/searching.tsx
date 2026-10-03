import { facultyText, type FacultyId } from "@/constants/faculties";
import { DEFAULT_TOPIC, topicOf, type TopicId } from "@/constants/topics";
import { BouncingDots } from "@/components/ui/bouncing-dots";
import { Mascot } from "@/components/ui/mascot";
import { useT } from "@/hooks/use-locale";

export function Searching({
  prefers,
  topic,
  fellBack,
  connected,
  onCancel,
}: {
  prefers: FacultyId | null;
  topic: TopicId;
  fellBack: boolean;
  connected: boolean;
  onCancel: () => void;
}) {
  const t = useT();
  const preferred = prefers ? facultyText(t, prefers) : undefined;
  const topicInfo = topic !== DEFAULT_TOPIC ? topicOf(topic) : undefined;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-5 px-4 pb-16 text-center">
      <Mascot bubble={t.searching.bubble} className="w-[26rem] max-w-full" />
      <div aria-live="polite">
        <h1 className="text-2xl font-bold">
          {preferred && !fellBack
            ? t.searching.lookingFor(preferred.name)
            : t.searching.waiting}
          <BouncingDots className="ml-1.5" />
        </h1>
        <p className="mt-1 text-ink-soft">
          {preferred && fellBack
            ? t.searching.fellBack(preferred.short)
            : preferred
              ? t.searching.fallbackSoon
              : t.searching.open}
        </p>
      </div>
      {topicInfo && (
        <p className="doodle-chip flex items-center gap-1.5 bg-accent-soft font-bold">
          <topicInfo.icon className="size-4" aria-hidden />
          {t.searching.topic(t.topics[topicInfo.id])}
        </p>
      )}
      {!connected && (
        <p className="text-sm font-medium text-danger" role="status">
          {t.searching.reconnecting}
        </p>
      )}
      <button type="button" className="doodle-btn px-6 py-2" onClick={onCancel}>
        {t.common.cancel}
      </button>
    </main>
  );
}
