import { useCallback, useState } from "react";

export const MAX_SHARED_MESSAGES = 20;

export function useMessageSelection() {
  const [selected, setSelected] = useState<ReadonlySet<string> | null>(null);

  const start = useCallback(() => setSelected(new Set()), []);
  const cancel = useCallback(() => setSelected(null), []);
  const toggle = useCallback((id: string) => {
    setSelected((current) => {
      if (!current) return current;
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_SHARED_MESSAGES) next.add(id);
      return next;
    });
  }, []);

  return { selecting: selected !== null, selected, start, cancel, toggle };
}
