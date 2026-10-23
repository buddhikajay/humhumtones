// Tiny localStorage-backed stores, read through useSyncExternalStore so the
// static HTML renders defaults and the client picks up saved values after hydration.

export type PersistentStore<T> = {
  get: () => T;
  getServerSnapshot: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
};

export function createPersistentStore<T extends object>(key: string, initial: T): PersistentStore<T> {
  let value: T | undefined;
  const listeners = new Set<() => void>();

  const get = () => {
    if (value === undefined) {
      value = initial;
      try {
        const raw = localStorage.getItem(key);
        if (raw) value = { ...initial, ...JSON.parse(raw) };
      } catch {
        // Storage unavailable or corrupt: fall back to defaults.
      }
    }
    return value!;
  };

  return {
    get,
    getServerSnapshot: () => initial,
    set(next) {
      value = typeof next === "function" ? (next as (prev: T) => T)(get()) : next;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Ignore quota / private-mode errors; state still lives in memory.
      }
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
