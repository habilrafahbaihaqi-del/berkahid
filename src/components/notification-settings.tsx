"use client";

import Link from "next/link";
import { useState } from "react";
import { FARDHU_KEYS, MOCK_PRAYER_TIMES } from "@/data/mock-prayer-times";
import {
  computeNextTrigger,
  notificationsGranted,
  notificationsSupported,
  playAdhanSound,
  showAdhanNotification,
} from "@/lib/adhan-scheduler";
import {
  togglePrayerNotification,
  updateNotificationSettings,
  useNotificationSettings,
} from "@/lib/notification-store";
import { useNow } from "@/lib/use-now";

const SOUNDS = [
  { id: "adzan-makkah", label: "Makkah" },
  { id: "adzan-madinah", label: "Madinah" },
  { id: "nada-lembut", label: "Nada Lembut" },
];

const REMINDER_OPTIONS = [
  { value: 0, label: "Tepat waktu" },
  { value: 5, label: "5 menit sebelumnya" },
  { value: 10, label: "10 menit sebelumnya" },
  { value: 15, label: "15 menit sebelumnya" },
];

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        checked ? "bg-emerald-500" : "bg-white/25"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
      <div className="border-b border-white/15 px-5 py-4">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="px-5 py-2">{children}</div>
    </section>
  );
}

export default function NotificationSettings() {
  const settings = useNotificationSettings();
  const now = useNow();
  const [permissionNotice, setPermissionNotice] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleMasterToggle = async (checked: boolean) => {
    setPermissionNotice(null);
    if (checked) {
      if (!("Notification" in window)) {
        setPermissionNotice(
          "Browser ini tidak mendukung notifikasi. Gunakan browser modern untuk fitur ini.",
        );
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPermissionNotice(
          "Izin notifikasi belum diberikan. Aktifkan izin melalui pengaturan browser, lalu coba lagi.",
        );
        return;
      }
    }
    updateNotificationSettings({ enabled: checked });
  };

  const runTestNotification = () => {
    setTestResult(null);
    if (notificationsSupported() && notificationsGranted()) {
      showAdhanNotification("Uji Notifikasi", "Notifikasi adzan bekerja dengan baik.");
    }
    playAdhanSound(settings.sound);
    setTestResult(
      "Notifikasi uji dikirim — cek ponsel/desktop dan dengarkan suaranya.",
    );
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:max-w-lg">
        <header className="flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Kembali ke jadwal sholat"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-base font-bold">Pengaturan Notifikasi</h1>
            <p className="text-[11px] text-emerald-200/70">
              Pengingat adzan sesuai waktu sholat
            </p>
          </div>
        </header>

        {permissionNotice && (
          <p className="rounded-2xl bg-amber-400/15 px-4 py-3 text-xs leading-relaxed text-amber-200 ring-1 ring-amber-300/30">
            {permissionNotice}
          </p>
        )}

        <section className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">Aktifkan notifikasi adzan</h2>
              <p className="mt-0.5 text-xs text-emerald-200/70">
                Browser akan memberi tahu saat waktu sholat tiba
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onChange={handleMasterToggle}
              label="Aktifkan notifikasi adzan"
            />
          </div>
        </section>

        {settings.enabled && (
          <>
            <section className="rounded-3xl bg-emerald-500/15 p-5 ring-1 ring-emerald-300/30">
              <h2 className="text-sm font-semibold">Status Penjadwalan</h2>
              {now ? (() => {
                const next = computeNextTrigger(settings, now);
                const granted = notificationsSupported() && notificationsGranted();
                return (
                  <>
                    <p className="mt-2 text-xs leading-relaxed text-emerald-100/90">
                      {granted ? (
                        <>
                          Penjadwalan aktif. Notifikasi berikutnya:{" "}
                          <span className="font-bold text-white">
                            {next ? `${next.prayerName} pukul ${next.prayerTime}` : "—"}
                          </span>
                          {next &&
                            settings.reminderMinutes > 0 &&
                            ` (pengingat ${settings.reminderMinutes} menit sebelumnya)`}
                        </>
                      ) : (
                        "Izin notifikasi tidak tersedia — penjadwalan tidak berjalan."
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={runTestNotification}
                      className="mt-3 w-full rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-50"
                    >
                      Kirim notifikasi uji
                    </button>
                    {testResult && (
                      <p className="mt-2 text-[11px] text-emerald-100/80">
                        {testResult}
                      </p>
                    )}
                  </>
                );
              })() : (
                <p className="mt-2 text-xs text-emerald-100/70">Memuat…</p>
              )}
            </section>

            <Card title="Waktu Sholat">
              <ul className="divide-y divide-white/10">
                {FARDHU_KEYS.map((key) => {
                  const prayer = MOCK_PRAYER_TIMES.find((p) => p.key === key);
                  if (!prayer) return null;
                  return (
                    <li
                      key={key}
                      className="flex items-center justify-between py-3"
                    >
                      <span className="text-sm font-medium">{prayer.name}</span>
                      <Switch
                        checked={settings.perPrayer[key]}
                        onChange={(checked) =>
                          togglePrayerNotification(key, checked)
                        }
                        label={`Notifikasi ${prayer.name}`}
                      />
                    </li>
                  );
                })}
              </ul>
            </Card>

            <Card title="Suara Adzan">
              <div className="grid grid-cols-3 gap-2 py-2">
                {SOUNDS.map((sound) => {
                  const active = settings.sound === sound.id;
                  return (
                    <button
                      key={sound.id}
                      type="button"
                      onClick={() => updateNotificationSettings({ sound: sound.id })}
                      aria-pressed={active}
                      className={`rounded-2xl px-3 py-3 text-center text-xs font-semibold transition-colors ${
                        active
                          ? "bg-emerald-500 text-white"
                          : "bg-white/10 text-emerald-100 hover:bg-white/20"
                      }`}
                    >
                      {sound.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card title="Waktu Pengingat">
              <div className="py-2">
                <label htmlFor="reminder-select" className="sr-only">
                  Waktu pengingat sebelum adzan
                </label>
                <select
                  id="reminder-select"
                  value={settings.reminderMinutes}
                  onChange={(e) =>
                    updateNotificationSettings({
                      reminderMinutes: Number(e.target.value),
                    })
                  }
                  className="w-full appearance-none rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white outline-none [&>option]:text-emerald-950 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/40"
                >
                  {REMINDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </Card>
          </>
        )}

        <footer className="text-center text-[11px] text-emerald-200/60">
          Pengaturan tersimpan otomatis di perangkat ini.
        </footer>
      </main>
    </div>
  );
}
