"use client";

import type { Location } from "@/data/mock-cities";
import { createStoredValue, useStoredValue } from "@/lib/storage";

export type LocationSource = "auto" | "manual";

export interface AutoCoords {
  latitude: number;
  longitude: number;
}

export const LOCATION_STORAGE_KEY = "berkahid:location";
export const LOCATION_SOURCE_KEY = "berkahid:location-source";
export const PROMPT_DISMISSED_KEY = "berkahid:location-prompt-dismissed";
export const AUTO_COORDS_KEY = "berkahid:auto-coords";

const locationStore = createStoredValue<Location>(LOCATION_STORAGE_KEY);
const sourceStore = createStoredValue<LocationSource>(LOCATION_SOURCE_KEY);
const promptStore = createStoredValue<boolean>(PROMPT_DISMISSED_KEY);
const coordsStore = createStoredValue<AutoCoords>(AUTO_COORDS_KEY);

export function useStoredLocation() {
  return useStoredValue(locationStore);
}

export function saveLocation(location: Location | null) {
  locationStore.set(location);
}

export function useLocationSource() {
  return useStoredValue(sourceStore);
}

export function saveLocationSource(source: LocationSource | null) {
  sourceStore.set(source);
}

export function useLocationPromptDismissed() {
  return useStoredValue(promptStore);
}

export function dismissLocationPrompt() {
  promptStore.set(true);
}

export function useAutoCoords() {
  return useStoredValue(coordsStore);
}

export function saveAutoCoords(coords: AutoCoords | null) {
  coordsStore.set(coords);
}
