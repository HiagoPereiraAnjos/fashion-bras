export function resolveStorage(storage?: Storage): Storage | null {
  if (storage) return storage;

  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readJson<T>(storage: Storage | null, key: string): T | null {
  if (!storage) return null;

  try {
    const rawValue = storage.getItem(key);
    if (rawValue === null) return null;
    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

export function writeJson<T>(storage: Storage | null, key: string, value: T): void {
  if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage failures to keep UI functional
  }
}

export function removeKey(storage: Storage | null, key: string): void {
  if (!storage) return;

  try {
    storage.removeItem(key);
  } catch {
    // ignore storage failures to keep UI functional
  }
}
