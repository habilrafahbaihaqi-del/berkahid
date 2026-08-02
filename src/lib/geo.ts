"use client";

import { findNearestLocation, type Location } from "@/data/mock-cities";
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
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({
          coords: { latitude, longitude },
          location: findNearestLocation(latitude, longitude),
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
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
