import { useT } from "@/hooks/use-locale";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="mt-auto pt-4 text-center text-xs text-ink-soft">
      {t.footer.inspired}{" "}
      <a
        href="https://drinksonme.live/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline underline-offset-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
      >
        Drinks On Me
      </a>
    </footer>
  );
}
