import { facultyOf, type FacultyId } from "@/constants/faculties";
import { DEFAULT_TOPIC, topicOf, type TopicId } from "@/constants/topics";
import { BouncingDots } from "@/components/ui/bouncing-dots";
import { Mascot } from "@/components/ui/mascot";

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
  const preferred = prefers ? facultyOf(prefers) : undefined;
  const topicInfo = topic !== DEFAULT_TOPIC ? topicOf(topic) : undefined;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-5 px-4 pb-16 text-center">
      <Mascot bubble="แป๊บนะ…" className="w-[26rem] max-w-full" />
      <div aria-live="polite">
        <h1 className="text-2xl font-bold">
          {preferred && !fellBack
            ? `กำลังหาเพื่อนจาก${preferred.name}`
            : "กำลังรอเพื่อนเข้าห้อง"}
          <BouncingDots className="ml-1.5" />
        </h1>
        <p className="mt-1 text-ink-soft">
          {preferred && fellBack
            ? `ตอนนี้ยังไม่มีเด็ก${preferred.short}รออยู่ เลยเปิดห้องรับทุกคณะแล้ว`
            : preferred
              ? "ถ้าไม่เจอในไม่กี่วินาที จะพาไปห้องที่ว่างแทน"
              : "เปิดห้องไว้ให้แล้ว ใครกดหาคนถัดไปจะเข้ามาห้องนี้"}
        </p>
      </div>
      {topicInfo && (
        <p className="doodle-chip flex items-center gap-1.5 bg-accent-soft font-bold">
          <topicInfo.icon className="size-4" aria-hidden />
          หัวข้อ: {topicInfo.label}
        </p>
      )}
      {!connected && (
        <p className="text-sm font-medium text-danger" role="status">
          หลุดการเชื่อมต่อ กำลังต่อกลับให้…
        </p>
      )}
      <button type="button" className="doodle-btn px-6 py-2" onClick={onCancel}>
        ยกเลิก
      </button>
    </main>
  );
}
