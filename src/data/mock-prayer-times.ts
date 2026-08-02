export type PrayerTimeKey =
  | "imsak"
  | "subuh"
  | "terbit"
  | "dzuhur"
  | "ashar"
  | "maghrib"
  | "isya";

export const FARDHU_KEYS = ["subuh", "dzuhur", "ashar", "maghrib", "isya"] as const;

export type FardhuKey = (typeof FARDHU_KEYS)[number];

export interface PrayerTime {
  key: PrayerTimeKey;
  name: string;
  time: string;
}

export const MOCK_LOCATION = {
  city: "Yogyakarta",
  district: "Kec. Kotagede",
  method: "Data tiruan",
};

export const MOCK_PRAYER_TIMES: PrayerTime[] = [
  { key: "imsak", name: "Imsak", time: "04:22" },
  { key: "subuh", name: "Subuh", time: "04:32" },
  { key: "terbit", name: "Terbit", time: "05:44" },
  { key: "dzuhur", name: "Dzuhur", time: "11:47" },
  { key: "ashar", name: "Ashar", time: "15:06" },
  { key: "maghrib", name: "Maghrib", time: "17:50" },
  { key: "isya", name: "Isya", time: "19:01" },
];
