"use client";

import { Ban, HeartHandshake, ShieldAlert, UserX } from "lucide-react";
import { useEffect, useRef } from "react";

const RULES = [
  {
    icon: HeartHandshake,
    title: "ให้เกียรติกัน",
    body: "ไม่คุกคาม ไม่ส่งเรื่องทางเพศที่อีกฝ่ายไม่ได้อยากคุย",
  },
  {
    icon: Ban,
    title: "ไม่ด่าทอ ไม่เหยียด",
    body: "ไม่ว่าเรื่องคณะ เพศ ศาสนา หน้าตา หรืออะไรก็ตาม",
  },
  {
    icon: UserX,
    title: "เคารพความเป็นนิรนาม",
    body: "ไม่คาดคั้นถามชื่อจริง รหัส หรือข้อมูลส่วนตัว ไม่สแปม ไม่ขายของ",
  },
  {
    icon: ShieldAlert,
    title: "เจอเรื่องไม่ดี?",
    body: "กดปุ่มโล่สีแดงเพื่อออกและบล็อก หรือรายงานได้ คนที่ผิดกฎอาจถูกระงับบัญชี",
  },
];

export function RulesDialog({
  onAccept,
  onClose,
}: {
  onAccept: () => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="doodle-card m-auto flex max-h-[calc(var(--app-height,100dvh)-1.5rem)] w-[min(26rem,calc(100vw-1.5rem))] flex-col gap-3 overflow-y-auto p-5 text-left backdrop:bg-ink/50"
      aria-labelledby="rules-title"
      onClose={onClose}
    >
      <h2 id="rules-title" className="text-xl font-bold">
        ก่อนเริ่มคุย ตกลงกันนิดนึง
      </h2>
      <ul className="flex flex-col gap-3">
        {RULES.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-accent-soft">
              <Icon className="size-4" aria-hidden />
            </span>
            <span>
              <span className="block font-bold">{title}</span>
              <span className="block text-sm text-ink-soft">{body}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-1 flex gap-2">
        <button
          type="button"
          className="doodle-btn flex-1 px-3 py-2"
          onClick={() => dialogRef.current?.close()}
        >
          ไว้ก่อน
        </button>
        <button
          type="button"
          className="doodle-btn doodle-btn-primary flex-[2] px-3 py-2 font-bold"
          onClick={onAccept}
        >
          ตกลง เริ่มหาเพื่อนเลย
        </button>
      </div>
    </dialog>
  );
}
