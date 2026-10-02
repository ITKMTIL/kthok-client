import { useSyncExternalStore } from "react";

export interface StoredValue<T> {
  get: () => T;
  set: (value: T) => void;
  use: () => T | undefined;
}

export function createStoredValue<T>(
  key: string,
  parse: (raw: unknown) => T | undefined,
  fallback: () => T,
): StoredValue<T> {
  let cached: { value: T } | undefined;
  const listeners = new Set<() => void>();

  const persist = (value: T) => {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  const load = (): T => {
    try {
      const parsed = parse(JSON.parse(localStorage.getItem(key) ?? "null"));
      if (parsed !== undefined) {
        persist(parsed);
        return parsed;
      }
    } catch {}
    const fresh = fallback();
    persist(fresh);
    return fresh;
  };

  const get = () => (cached ??= { value: load() }).value;

  const set = (value: T) => {
    cached = { value };
    persist(value);
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    get,
    set,
    use: () => useSyncExternalStore(subscribe, get, () => undefined),
  };
}
