import { useLayoutEffect, useState, type RefObject } from "react";

const GUTTER = 12;

export function usePopoverOffset(
  anchorRef: RefObject<HTMLElement | null>,
  open: boolean,
  width: number,
): number {
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const viewport = document.documentElement.clientWidth;
      const overflowLeft = GUTTER - (rect.right - width);
      const overflowRight = rect.right - (viewport - GUTTER);
      setOffset(overflowLeft > 0 ? -overflowLeft : Math.max(0, overflowRight));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [anchorRef, open, width]);

  return offset;
}
