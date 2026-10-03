"use client";

import { Plus, ShieldBan, X } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { addWord, fetchWords, removeWord, type WordList as Words } from "@/lib/admin-api";

export function WordList({ token }: { token: string }) {
  const [words, setWords] = useState<Words | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setWords(await fetchWords(token));
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  async function run(task: () => Promise<boolean>, failure: string) {
    setBusy(true);
    setError(null);
    const ok = await task();
    setBusy(false);
    if (!ok) setError(failure);
    await load();
    return ok;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const word = draft.trim();
    if (!word || busy) return;
    if (await run(() => addWord(token, word), "เพิ่มคำไม่สำเร็จ (ต้องยาว 2-40 ตัวอักษร)")) {
      setDraft("");
    }
  }

  return (
    <section className="doodle-card flex flex-col gap-3 p-4" aria-label="คำต้องห้าม">
      <h2 className="flex items-center gap-1.5 text-xl font-bold">
        <ShieldBan className="size-5" aria-hidden />
        คำต้องห้าม
      </h2>
      <p className="-mt-2 text-sm text-ink-soft">
        คำที่ตรงจะถูกเปลี่ยนเป็น *** ในข้อความ ใช้กับนามแฝงและช่องทางติดต่อด้วย ระบบจับแบบเว้นวรรคหรือใส่จุดคั่นได้
      </p>
      <form className="flex gap-2" onSubmit={submit}>
        <input
          className="doodle-field min-w-0 flex-1 text-sm"
          value={draft}
          maxLength={40}
          placeholder="เพิ่มคำ"
          aria-label="คำที่จะเพิ่ม"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="submit"
          className="doodle-btn doodle-btn-primary flex items-center gap-1 px-3 text-sm font-bold"
          disabled={busy || !draft.trim()}
        >
          <Plus className="size-4" aria-hidden />
          เพิ่ม
        </button>
      </form>
      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
      {words === null ? (
        <p className="text-sm text-ink-soft">โหลดรายการคำไม่ได้</p>
      ) : (
        <>
          <ul className="flex flex-wrap gap-2" aria-label="คำที่เพิ่มเอง">
            {words.custom.length === 0 && (
              <li className="text-sm text-ink-soft">ยังไม่มีคำที่เพิ่มเอง</li>
            )}
            {words.custom.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-1 rounded-full border-2 border-ink bg-accent-soft py-0.5 pl-3 pr-1 text-sm"
              >
                {item.word}
                <button
                  type="button"
                  className="grid size-6 cursor-pointer place-items-center rounded-full hover:bg-card"
                  aria-label={`ลบคำ ${item.word}`}
                  disabled={busy}
                  onClick={() => void run(() => removeWord(token, item.id), "ลบคำไม่สำเร็จ")}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          <details className="text-sm">
            <summary className="cursor-pointer text-ink-soft">
              คำพื้นฐานในระบบ ({words.defaults.length} คำ แก้ได้ในโค้ด)
            </summary>
            <p className="mt-2 break-words text-ink-soft">{words.defaults.join(", ")}</p>
          </details>
        </>
      )}
    </section>
  );
}
