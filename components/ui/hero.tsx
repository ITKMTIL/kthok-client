import { Mascot } from "./mascot";
import { useT } from "@/hooks/use-locale";

export function Hero({ bubble }: { bubble: string }) {
  const t = useT();
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold leading-snug sm:text-4xl">
          {t.hero.title} <span className="text-accent">{t.hero.titleAccent}</span>
        </h1>
        <p className="mt-1 text-lg text-ink-soft">
          {t.hero.subtitle}
        </p>
      </div>
      <Mascot bubble={bubble} className="w-[26rem] max-w-full" />
    </>
  );
}
