export const KAABA_COORDS = { latitude: 21.4225, longitude: 39.8262 };

export function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

export function computeQiblaBearing(latitude: number, longitude: number) {
  const lat1 = toRadians(latitude);
  const lat2 = toRadians(KAABA_COORDS.latitude);
  const dLon = toRadians(KAABA_COORDS.longitude - longitude);

  const y = Math.sin(dLon);
  const x =
    Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLon);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

export function distanceToKaabaKm(latitude: number, longitude: number) {
  const EARTH_RADIUS_KM = 6371;
  const dLat = toRadians(KAABA_COORDS.latitude - latitude);
  const dLon = toRadians(KAABA_COORDS.longitude - longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latitude)) *
      Math.cos(toRadians(KAABA_COORDS.latitude)) *
      Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function compassDirection(bearing: number) {
  const directions = [
    "Utara",
    "Timur Laut",
    "Timur",
    "Tenggara",
    "Selatan",
    "Barat Daya",
    "Barat",
    "Barat Laut",
  ];
  const index = Math.round(((bearing % 360) + 360) % 360 / 45) % 8;
  return directions[index];
}
