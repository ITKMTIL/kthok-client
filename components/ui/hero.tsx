import { Mascot } from "./mascot";

export function Hero({ bubble }: { bubble: string }) {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold leading-snug sm:text-4xl">
          คุยกับเพื่อนใหม่ในรั้ว <span className="text-accent">สจล.</span>
        </h1>
        <p className="mt-1 text-lg text-ink-soft">
          ไม่ต้องปัด ไม่ต้องแมตช์ กดแล้วจับคู่ให้เลย แบบไม่มีใครรู้ว่าใครเป็นใคร
        </p>
      </div>
      <Mascot bubble={bubble} className="w-60 max-w-full" />
    </>
  );
}
