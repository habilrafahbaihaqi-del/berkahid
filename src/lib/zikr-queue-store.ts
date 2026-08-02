"use client";

import { createStoredValue, useStoredValue } from "@/lib/storage";

export interface QueueItem {
  zikrId: string;
  targetCount: number;
  currentCount: number;
}

export interface ZikrQueue {
  date: string;
  items: QueueItem[];
}

export const ZIKR_QUEUE_KEY = "berkahid:zikr-queue";

export const DEFAULT_ZIKR_TARGETS: Record<string, number> = {
  tasbih: 33,
  tahmid: 33,
  takbir: 33,
  istighfar: 100,
  tahlil: 100,
};

export function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const queueStore = createStoredValue<ZikrQueue>(ZIKR_QUEUE_KEY);

export function useZikrQueue(): ZikrQueue {
  const stored = useStoredValue(queueStore);
  const today = localDateString();
  if (!stored || stored.date !== today) {
    return { date: today, items: [] };
  }
  return stored;
}

function persist(items: QueueItem[]) {
  queueStore.set({ date: localDateString(), items });
}

export function addToQueue(zikrId: string) {
  addToQueueWithTarget(zikrId, DEFAULT_ZIKR_TARGETS[zikrId] ?? 1);
}

export function addToQueueWithTarget(zikrId: string, targetCount: number) {
  const stored = queueStore.getSnapshot();
  const today = localDateString();
  const items =
    stored && stored.date === today ? [...stored.items] : [];
  const safeTarget = Math.max(1, Math.min(100000, Math.floor(targetCount)));
  const existing = items.find((i) => i.zikrId === zikrId);
  if (existing) {
    existing.targetCount = safeTarget;
  } else {
    items.push({
      zikrId,
      targetCount: safeTarget,
      currentCount: 0,
    });
  }
  persist(items);
}

export function seedDefaultQueue() {
  const seeds = [
    { zikrId: "tasbih", targetCount: 33, currentCount: 0 },
    { zikrId: "tahmid", targetCount: 33, currentCount: 0 },
    { zikrId: "istighfar", targetCount: 100, currentCount: 0 },
  ];
  persist(seeds);
}

export function incrementQueueItem(zikrId: string) {
  const stored = queueStore.getSnapshot();
  if (!stored) return;
  persist(
    stored.items.map((item) =>
      item.zikrId === zikrId
        ? { ...item, currentCount: Math.min(item.targetCount, item.currentCount + 1) }
        : item,
    ),
  );
}

export function decrementQueueItem(zikrId: string) {
  const stored = queueStore.getSnapshot();
  if (!stored) return;
  persist(
    stored.items.map((item) =>
      item.zikrId === zikrId
        ? { ...item, currentCount: Math.max(0, item.currentCount - 1) }
        : item,
    ),
  );
}

export function setQueueTarget(zikrId: string, targetCount: number) {
  const stored = queueStore.getSnapshot();
  if (!stored) return;
  const safeTarget = Math.max(1, Math.min(100000, Math.floor(targetCount)));
  persist(
    stored.items.map((item) =>
      item.zikrId === zikrId
        ? { ...item, targetCount: safeTarget }
        : item,
    ),
  );
}

export function removeFromQueue(zikrId: string) {
  const stored = queueStore.getSnapshot();
  if (!stored) return;
  persist(stored.items.filter((item) => item.zikrId !== zikrId));
}

export function clearQueue() {
  persist([]);
}
