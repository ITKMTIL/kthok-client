import { createStoredValue } from "@/lib/storage";

export const RULES_VERSION = 1;

const rulesStore = createStoredValue<number>(
  "kthok:rules-accepted",
  (raw) => (typeof raw === "number" ? raw : undefined),
  () => 0,
);

export function useRulesAccepted() {
  const accepted = (rulesStore.use() ?? 0) >= RULES_VERSION;
  return [accepted, () => rulesStore.set(RULES_VERSION)] as const;
}
