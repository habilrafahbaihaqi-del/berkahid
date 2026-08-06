"use client";

import { findNearestLocation, type Location } from "@/data/cities";
import {
  saveAutoCoords,
  saveLocation,
  saveLocationSource,
  type AutoCoords,
} from "@/lib/location-store";

export function detectLocation(): Promise<{ location: Location; coords: AutoCoords }> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords: AutoCoords = { latitude, longitude };
        try {
          const location = await resolveNearestLocation(latitude, longitude);
          resolve({ location, coords });
        } catch {
          resolve({ location: findNearestLocation(latitude, longitude), coords });
        }
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}

async function resolveNearestLocation(
  latitude: number,
  longitude: number,
): Promise<Location> {
  const response = await fetch(
    `/api/lokasi/nearest?lat=${latitude.toFixed(6)}&lon=${longitude.toFixed(6)}`,
    { cache: "no-store" },
  );
  if (!response.ok) throw new Error("failed");
  const payload = (await response.json()) as {
    location?: {
      city?: string;
      district?: string;
      province?: string;
    };
  };
  const location = payload.location;
  if (!location?.city) throw new Error("empty");
  return {
    city: location.city,
    district: location.district ?? "",
    province: location.province ?? "",
    latitude,
    longitude,
  };
}

export async function applyAutoLocation(): Promise<{
  location: Location;
  coords: AutoCoords;
}> {
  const result = await detectLocation();
  saveAutoCoords(result.coords);
  saveLocation(result.location);
  saveLocationSource("auto");
  return result;
}
