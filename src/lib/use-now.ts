"use client";

import { useSyncExternalStore } from "react";

let cachedNow: Date | null = null;

function subscribe(callback: () => void) {
  const id = window.setInterval(() => {
    cachedNow = new Date();
    callback();
  }, 1000);
  return () => window.clearInterval(id);
}

function getSnapshot() {
  if (!cachedNow) cachedNow = new Date();
  return cachedNow;
}

function getServerSnapshot() {
  return null;
}

export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
