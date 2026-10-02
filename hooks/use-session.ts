import { createStoredValue } from "@/lib/storage";

const tokenStore = createStoredValue<string | null>(
  "kthok:session",
  (raw) => (typeof raw === "string" && raw ? raw : undefined),
  () => null,
);

export const saveSessionToken = tokenStore.set;

export function clearSession() {
  tokenStore.set(null);
}

export function useSessionToken(): string | null | undefined {
  return tokenStore.use();
}
