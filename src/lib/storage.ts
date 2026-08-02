"use client";

import { useSyncExternalStore } from "react";

export type StoredSnapshot<T> = T | null | undefined;

export interface StoredValue<T> {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => StoredSnapshot<T>;
  getServerSnapshot: () => StoredSnapshot<T>;
  set: (value: T | null) => void;
}

export function createStoredValue<T>(key: string): StoredValue<T> {
  const eventName = `${key}:change`;
  let cached: T | null = null;
  let loaded = false;

  function subscribe(callback: () => void) {
    window.addEventListener(eventName, callback);
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener(eventName, callback);
      window.removeEventListener("storage", callback);
    };
  }

  function getSnapshot(): StoredSnapshot<T> {
    if (!loaded) {
      loaded = true;
      try {
        const raw = window.localStorage.getItem(key);
        cached = raw ? (JSON.parse(raw) as T) : null;
      } catch {
        cached = null;
      }
    }
    return cached;
  }

  function getServerSnapshot(): StoredSnapshot<T> {
    return undefined;
  }

  function set(value: T | null) {
    cached = value;
    loaded = true;
    try {
      if (value === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // localStorage tidak tersedia — abaikan
    }
    window.dispatchEvent(new Event(eventName));
  }

  return { subscribe, getSnapshot, getServerSnapshot, set };
}

export function useStoredValue<T>(store: StoredValue<T>) {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

export function readStoredValue<T>(store: StoredValue<T>): T | null {
  return store.getSnapshot() ?? null;
}
