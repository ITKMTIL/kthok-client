import { createStoredValue } from "@/lib/storage";

const receiptsStore = createStoredValue<boolean>(
  "kthok:read-receipts",
  (raw) => (typeof raw === "boolean" ? raw : undefined),
  () => true,
);

export function useReadReceipts() {
  const enabled = receiptsStore.use() ?? true;
  return [enabled, receiptsStore.set] as const;
}
