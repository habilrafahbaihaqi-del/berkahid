"use client";

import { FARDHU_KEYS, MOCK_PRAYER_TIMES, type FardhuKey } from "@/data/mock-prayer-times";
import type { NotificationSettings } from "@/lib/notification-store";

export interface AdhanTrigger {
  prayerKey: FardhuKey;
  prayerName: string;
  prayerTime: string;
  triggerAt: Date;
}

export function computeNextTrigger(
  settings: NotificationSettings,
  from: Date,
): AdhanTrigger | null {
  let best: AdhanTrigger | null = null;

  for (const key of FARDHU_KEYS) {
    if (!settings.perPrayer[key]) continue;
    const prayer = MOCK_PRAYER_TIMES.find((p) => p.key === key);
    if (!prayer) continue;

    const [hour, minute] = prayer.time.split(":").map(Number);
    const triggerAt = new Date(from);
    triggerAt.setHours(hour, minute - settings.reminderMinutes, 0, 0);
    if (triggerAt.getTime() <= from.getTime()) {
      triggerAt.setDate(triggerAt.getDate() + 1);
    }

    if (!best || triggerAt.getTime() < best.triggerAt.getTime()) {
      best = { prayerKey: key, prayerName: prayer.name, prayerTime: prayer.time, triggerAt };
    }
  }

  return best;
}

export function notificationsSupported() {
  return "Notification" in window;
}

export function notificationsGranted() {
  return notificationsSupported() && Notification.permission === "granted";
}

export function showAdhanNotification(prayerName: string, prayerTime: string) {
  if (!notificationsGranted()) return;
  const reminderText = `Sudah masuk waktu sholat ${prayerName} pukul ${prayerTime}.`;
  try {
    new Notification(`Waktu ${prayerName}`, {
      body: reminderText,
      tag: `adhan-${prayerName}`,
      requireInteraction: true,
    });
  } catch {
    // Notifikasi gagal dibuat — abaikan
  }
}

export function playAdhanSound(soundId: string) {
  try {
    const audio = new Audio(`/sounds/${soundId}.mp3`);
    audio.volume = 0.8;
    audio.play().catch(() => playChime());
  } catch {
    playChime();
  }
}

function playChime() {
  try {
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const startAt = ctx.currentTime + i * 0.35;
      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(0.3, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + 1);
    });
    window.setTimeout(() => ctx.close(), 3000);
  } catch {
    // Audio tidak tersedia — abaikan
  }
}
