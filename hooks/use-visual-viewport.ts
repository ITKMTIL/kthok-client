import { useEffect } from "react";

export function useVisualViewportHeight() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const root = document.documentElement;

    const sync = () => {
      root.style.setProperty("--app-height", `${Math.round(viewport.height)}px`);
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };

    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
      root.style.removeProperty("--app-height");
    };
  }, []);
}
