"use client";

import type { FardhuKey } from "@/data/prayer-times";
import { createStoredValue, useStoredValue } from "@/lib/storage";

export interface NotificationSettings {
  enabled: boolean;
  sound: string;
  reminderMinutes: number;
  perPrayer: Record<FardhuKey, boolean>;
}

export const NOTIFICATION_SETTINGS_KEY = "berkahid:notification-settings";

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  sound: "adzan-makkah",
  reminderMinutes: 5,
  perPrayer: {
    subuh: true,
    dzuhur: true,
    ashar: true,
    maghrib: true,
    isya: true,
  },
};

const notificationStore = createStoredValue<NotificationSettings>(
  NOTIFICATION_SETTINGS_KEY,
);

export function useNotificationSettings(): NotificationSettings {
  const stored = useStoredValue(notificationStore);
  return stored ?? DEFAULT_NOTIFICATION_SETTINGS;
}

export function updateNotificationSettings(
  patch: Partial<NotificationSettings>,
) {
  const current = notificationStore.getSnapshot() ?? DEFAULT_NOTIFICATION_SETTINGS;
  notificationStore.set({ ...current, ...patch });
}

export function togglePrayerNotification(key: FardhuKey, enabled: boolean) {
  const current = notificationStore.getSnapshot() ?? DEFAULT_NOTIFICATION_SETTINGS;
  notificationStore.set({
    ...current,
    perPrayer: { ...current.perPrayer, [key]: enabled },
  });
}
