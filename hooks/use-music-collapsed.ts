import { createStoredValue } from "@/lib/storage";

const collapsedStore = createStoredValue<boolean>(
  "kthok:music-collapsed",
  (raw) => (typeof raw === "boolean" ? raw : undefined),
  () => true,
);

export function useMusicCollapsed() {
  const collapsed = collapsedStore.use() ?? true;
  return [collapsed, collapsedStore.set] as const;
}
