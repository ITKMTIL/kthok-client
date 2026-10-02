import { createStoredValue } from "@/lib/storage";

const mutedStore = createStoredValue<boolean>(
  "kthok:sound-muted",
  (raw) => (typeof raw === "boolean" ? raw : undefined),
  () => false,
);

export function useSoundMuted() {
  const muted = mutedStore.use() ?? false;
  return [muted, mutedStore.set] as const;
}
