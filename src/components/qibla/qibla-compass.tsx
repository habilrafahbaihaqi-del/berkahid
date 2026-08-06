"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import QiblaCalibration from "@/components/qibla/qibla-calibration";
import { detectLocation } from "@/lib/geo";
import { useStoredLocation } from "@/lib/location-store";
import {
  compassDirection,
  computeQiblaBearing,
  distanceToKaabaKm,
} from "@/lib/qibla";

type SensorState = "checking" | "active" | "unsupported" | "denied";

export default function QiblaCompass() {
  const storedLocation = useStoredLocation();
  const [detectedCoords, setDetectedCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [detectedLabel, setDetectedLabel] = useState("");
  const [heading, setHeading] = useState(0);
  const [sensorState, setSensorState] = useState<SensorState>(() =>
    typeof window !== "undefined" && "DeviceOrientationEvent" in window
      ? "checking"
      : "unsupported",
  );
  const [simulating, setSimulating] = useState(false);
  const [calibrationOpen, setCalibrationOpen] = useState(false);
  const [calibrationDone, setCalibrationDone] = useState(false);
  const [apiBearing, setApiBearing] = useState<number | null>(null);
  const [apiError, setApiError] = useState(false);
  const simulationRef = useRef<number | null>(null);

  const storedCoords =
    storedLocation?.latitude && storedLocation?.longitude
      ? {
          latitude: storedLocation.latitude,
          longitude: storedLocation.longitude,
        }
      : null;
  const coords = storedCoords ?? detectedCoords;
  const locationLabel =
    storedCoords && storedLocation
      ? `${storedLocation.city}${storedLocation.district ? `, ${storedLocation.district}` : ""}${storedLocation.kabupaten && storedLocation.kabupaten !== storedLocation.city ? ` · ${storedLocation.kabupaten}` : ""}`
      : detectedLabel || "Mendeteksi lokasi…";

  const requestSensorPermission =
    typeof window !== "undefined" &&
    "DeviceOrientationEvent" in window &&
    typeof (
      DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<PermissionState>;
      }
    ).requestPermission === "function";

  if (
    typeof window !== "undefined" &&
    "DeviceOrientationEvent" in window &&
    !requestSensorPermission &&
    sensorState === "checking"
  ) {
    setSensorState("active");
  }

  useEffect(() => {
    let cancelled = false;

    if (storedLocation?.latitude && storedLocation?.longitude) return;

    detectLocation()
      .then((result) => {
        if (cancelled) return;
        setDetectedCoords(result.coords);
        setDetectedLabel(
          `${result.location.city}, ${result.location.district}`,
        );
      })
      .catch(() => {
        if (cancelled) return;
        setDetectedCoords({ latitude: -7.7956, longitude: 110.3695 });
        setDetectedLabel("Yogyakarta (tiruan)");
      });

    return () => {
      cancelled = true;
    };
  }, [storedLocation]);

  useEffect(() => {
    if (!requestSensorPermission) return;
    (
      DeviceOrientationEvent as unknown as {
        requestPermission: () => Promise<PermissionState>;
      }
    )
      .requestPermission()
      .then((permission) => {
        setSensorState(permission === "granted" ? "active" : "denied");
      })
      .catch(() => setSensorState("denied"));
  }, [requestSensorPermission]);

  const lat = coords?.latitude;
  const lon = coords?.longitude;

  useEffect(() => {
    if (lat == null || lon == null) return;
    let cancelled = false;
    fetch(
      `/api/muslim/qibla?lat=${lat.toFixed(6)}&lon=${lon.toFixed(6)}`,
      { cache: "no-store" },
    )
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("failed"))))
      .then((payload: { data?: { direction?: number } }) => {
        if (cancelled) return;
        if (typeof payload.data?.direction === "number") {
          setApiBearing(payload.data.direction);
          setApiError(false);
        } else {
          setApiError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setApiError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  useEffect(() => {
    if (sensorState !== "active") return;
    const handler = (event: DeviceOrientationEvent) => {
      const iosHeading = (
        event as DeviceOrientationEvent & { webkitCompassHeading?: number }
      ).webkitCompassHeading;
      if (typeof iosHeading === "number") {
        setHeading(iosHeading);
      } else if (typeof event.alpha === "number") {
        setHeading(360 - event.alpha);
      }
    };
    window.addEventListener("deviceorientation", handler, true);
    return () => window.removeEventListener("deviceorientation", handler, true);
  }, [sensorState]);

  useEffect(() => {
    return () => {
      if (simulationRef.current !== null) {
        window.clearInterval(simulationRef.current);
      }
    };
  }, []);

  const toggleSimulation = () => {
    if (simulating) {
      if (simulationRef.current !== null) {
        window.clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
      setSimulating(false);
      return;
    }
    setSimulating(true);
    simulationRef.current = window.setInterval(() => {
      setHeading((h) => (h + 2) % 360);
    }, 50);
  };

  const bearing = coords
    ? computeQiblaBearing(coords.latitude, coords.longitude)
    : null;
  const needleBearing = apiBearing ?? bearing;
  const distance = coords ? distanceToKaabaKm(coords.latitude, coords.longitude) : null;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:max-w-lg">
      <header className="flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Kembali ke beranda"
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
          <h1 className="text-base font-bold">Arah Kiblat</h1>
          <p className="text-[11px] text-emerald-200/70">
            {locationLabel || "Mendeteksi lokasi…"}
          </p>
        </div>
      </header>

      <section className="flex flex-col items-center gap-5 rounded-3xl bg-white/10 px-5 py-8 ring-1 ring-white/20">
        <div
          className="relative h-64 w-64 rounded-full bg-emerald-950/50 ring-2 ring-white/15"
          role="img"
          aria-label="Kompas arah kiblat"
        >
          <div
            className="absolute inset-0 transition-transform duration-150"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <span
                key={deg}
                className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/50"
                style={{
                  transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-124px)`,
                }}
              />
            ))}
            {[
              { deg: 0, label: "U" },
              { deg: 90, label: "T" },
              { deg: 180, label: "S" },
              { deg: 270, label: "B" },
            ].map(({ deg, label }) => (
              <span
                key={deg}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-200/80"
                style={{
                  transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-108px) rotate(${-deg}deg)`,
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {needleBearing !== null && (
            <div
              className="absolute inset-0 transition-transform duration-150"
              style={{ transform: `rotate(${-heading + needleBearing}deg)` }}
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                <div className="mx-auto h-24 w-1.5 rounded-t-full bg-gradient-to-b from-amber-400 to-emerald-500" />
                <div className="mx-auto mt-0.5 h-16 w-1.5 rounded-b-full bg-white/60" />
              </div>
            </div>
          )}

          <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-700 ring-2 ring-emerald-400">
            <span className="text-[9px] font-bold leading-tight text-center text-white">
              KA&apos;BAH
            </span>
          </div>
        </div>

        {needleBearing !== null && (
          <div className="text-center">
            <p className="text-3xl font-bold tabular-nums text-white">
              {needleBearing.toFixed(1)}°
            </p>
            <p className="mt-1 text-sm font-semibold text-emerald-200">
              Kiblat: arah {compassDirection(needleBearing)}
            </p>
            {apiBearing !== null && bearing !== null && (
              <p className="mt-1 text-[11px] text-emerald-100/60">
                Resmi (api.myquran.com): {apiBearing.toFixed(1)}° · Lokal:{" "}
                {bearing.toFixed(1)}°
              </p>
            )}
            {distance !== null && (
              <p className="mt-1 text-xs text-emerald-100/60">
                ±{Math.round(distance).toLocaleString("id-ID")} km dari Ka&apos;bah
              </p>
            )}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
        <h2 className="text-sm font-bold text-emerald-100">
          Status Sensor Kompas
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-emerald-100/70">
          {sensorState === "active" &&
            "Sensor kompas aktif — putar perangkat pelan-pelan agar jarum mengikuti arah kiblat."}
          {sensorState === "checking" &&
            "Memeriksa dukungan sensor kompas…"}
          {sensorState === "denied" &&
            "Izin sensor kompas belum diberikan. Aktifkan melalui pengaturan browser."}
          {sensorState === "unsupported" &&
            "Perangkat/browser tidak mendukung sensor kompas. Gunakan mode tiruan untuk melihat arah."}
        </p>
        {sensorState !== "active" && (
          <button
            type="button"
            onClick={toggleSimulation}
            className="mt-3 w-full rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-400"
          >
            {simulating ? "Hentikan Simulasi" : "Mulai Simulasi Kompas"}
          </button>
        )}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCalibrationOpen(true)}
            className="flex-1 rounded-2xl border border-emerald-300/30 bg-emerald-400/15 px-4 py-2.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-400/25"
          >
            Kalibrasi Kompas
          </button>
          {calibrationDone && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-1.5 text-[10px] font-bold text-emerald-200 ring-1 ring-emerald-300/30">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
              Terkalibrasi
            </span>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
        <h2 className="text-sm font-bold text-emerald-100">
          Panduan Kalibrasi
        </h2>
        <ol className="mt-3 flex flex-col gap-2.5 text-xs leading-relaxed text-emerald-100/70">
          <li className="flex gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-200">
              1
            </span>
            Jauhkan perangkat dari benda logam dan magnet.
          </li>
          <li className="flex gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-200">
              2
            </span>
            Gerakkan perangkat membentuk angka delapan beberapa kali.
          </li>
          <li className="flex gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-200">
              3
            </span>
            Pegang perangkat datar, arahkan mengikuti jarum hingga menunjuk kiblat.
          </li>
        </ol>
      </section>

      <p className="text-center text-[11px] text-emerald-200/50">
        {apiError
          ? "Gagal mengambil data resmi — arah dihitung dari lokasi ke Ka'bah di Makkah."
          : "Arah kiblat resmi dari api.myquran.com, dihitung dari lokasi ke Ka'bah di Makkah."}
      </p>

      <QiblaCalibration
        open={calibrationOpen}
        onClose={() => setCalibrationOpen(false)}
        onDone={() => {
          setCalibrationDone(true);
          setCalibrationOpen(false);
        }}
      />
    </main>
  );
}
