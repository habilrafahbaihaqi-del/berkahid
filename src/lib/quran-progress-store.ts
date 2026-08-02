"use client";

import { createStoredValue, useStoredValue } from "@/lib/storage";

export interface QuranProgress {
  surah: number;
  ayah: number;
  updatedAt: string;
}

export const QURAN_PROGRESS_KEY = "berkahid:quran-progress";

const progressStore = createStoredValue<QuranProgress>(QURAN_PROGRESS_KEY);

export function useQuranProgress() {
  return useStoredValue(progressStore);
}

export function saveQuranProgress(surah: number, ayah: number) {
  progressStore.set({
    surah,
    ayah,
    updatedAt: new Date().toISOString(),
  });
}
