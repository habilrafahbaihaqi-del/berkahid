"use client";

import { computeNextTrigger, notificationsSupported } from "@/lib/adhan-scheduler";
import { useNotificationSettings } from "@/lib/notification-store";
import { usePrayerTimesSnapshot } from "@/lib/prayer-times-store";
import { useNow } from "@/lib/use-now";

function formatTrigger(triggerAt: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(triggerAt);
}

export default function NextAdhanBadge() {
  const settings = useNotificationSettings();
  const snapshot = usePrayerTimesSnapshot();
  const now = useNow();

  if (!settings.enabled || !now) return null;

  const next = computeNextTrigger(settings, now, snapshot?.times);
  if (!next) return null;

  const supported = notificationsSupported();
  const granted =
    supported && typeof Notification !== "undefined" && Notification.permission === "granted";

  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-[11px] text-emerald-100 ring-1 ring-white/15">
      {granted ? (
        <>
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
          <span>
            Notifikasi adzan aktif — berikutnya: {next.prayerName}{" "}
            <span className="font-semibold tabular-nums">
              {formatTrigger(next.triggerAt)}
            </span>
            {settings.reminderMinutes > 0 &&
              ` (${settings.reminderMinutes} menit sebelum)`}
          </span>
        </>
      ) : (
        <span className="text-amber-200">
          Izin notifikasi belum diberikan — aktifkan di Pengaturan.
        </span>
      )}
    </div>
  );
}
