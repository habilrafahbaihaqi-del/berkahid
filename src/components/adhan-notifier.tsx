"use client";

import { useEffect, useState } from "react";
import {
  computeNextTrigger,
  notificationsGranted,
  playAdhanSound,
  showAdhanNotification,
} from "@/lib/adhan-scheduler";
import { useNotificationSettings } from "@/lib/notification-store";

export default function AdhanNotifier() {
  const settings = useNotificationSettings();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!settings.enabled || !notificationsGranted()) return;

    const next = computeNextTrigger(settings, new Date());
    if (!next) return;

    const delay = Math.max(0, next.triggerAt.getTime() - Date.now());
    const timeoutId = window.setTimeout(() => {
      showAdhanNotification(next.prayerName, next.prayerTime);
      playAdhanSound(settings.sound);
      setTick((t) => t + 1);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [settings, tick]);

  return null;
}
