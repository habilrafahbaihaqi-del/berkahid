export interface Location {
  city: string;
  district: string;
  province: string;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
  kabupaten?: string;
}

export interface CityCandidate extends Location {
  latitude: number;
  longitude: number;
}

export const CITIES: CityCandidate[] = [
  { city: "Banda Aceh", district: "Kec. Syiah Kuala", province: "Aceh", latitude: 5.5483, longitude: 95.3238 },
  { city: "Medan", district: "Kec. Medan Petisah", province: "Sumatera Utara", latitude: 3.5952, longitude: 98.6722 },
  { city: "Padang", district: "Kec. Padang Barat", province: "Sumatera Barat", latitude: -0.9471, longitude: 100.4172 },
  { city: "Pekanbaru", district: "Kec. Senapelan", province: "Riau", latitude: 0.5071, longitude: 101.4478 },
  { city: "Batam", district: "Kec. Batam Kota", province: "Kepulauan Riau", latitude: 1.0456, longitude: 104.0305 },
  { city: "Tanjung Pinang", district: "Kec. Tanjung Pinang Kota", province: "Kepulauan Riau", latitude: 0.9186, longitude: 104.4664 },
  { city: "Jambi", district: "Kec. Telanaipura", province: "Jambi", latitude: -1.5900, longitude: 103.6100 },
  { city: "Palembang", district: "Kec. Ilir Barat I", province: "Sumatera Selatan", latitude: -2.9761, longitude: 104.7754 },
  { city: "Bengkulu", district: "Kec. Ratu Agung", province: "Bengkulu", latitude: -3.8000, longitude: 102.2650 },
  { city: "Bandar Lampung", district: "Kec. Tanjung Karang Timur", province: "Lampung", latitude: -5.4500, longitude: 105.2600 },
  { city: "Pangkal Pinang", district: "Kec. Taman Sari", province: "Kepulauan Bangka Belitung", latitude: -2.1333, longitude: 106.1167 },
  { city: "Jakarta Pusat", district: "Kec. Menteng", province: "DKI Jakarta", latitude: -6.1822, longitude: 106.8422 },
  { city: "Jakarta Selatan", district: "Kec. Kebayoran Baru", province: "DKI Jakarta", latitude: -6.2667, longitude: 106.8136 },
  { city: "Jakarta Timur", district: "Kec. Jatinegara", province: "DKI Jakarta", latitude: -6.2250, longitude: 106.9000 },
  { city: "Jakarta Barat", district: "Kec. Cengkareng", province: "DKI Jakarta", latitude: -6.1513, longitude: 106.8000 },
  { city: "Jakarta Utara", district: "Kec. Kelapa Gading", province: "DKI Jakarta", latitude: -6.1250, longitude: 106.8833 },
  { city: "Kepulauan Seribu", district: "Kec. Kepulauan Seribu Utara", province: "DKI Jakarta", latitude: -5.6025, longitude: 106.6172 },
  { city: "Bogor", district: "Kec. Bogor Tengah", province: "Jawa Barat", latitude: -6.5950, longitude: 106.8167 },
  { city: "Depok", district: "Kec. Pancoran Mas", province: "Jawa Barat", latitude: -6.4000, longitude: 106.8186 },
  { city: "Tangerang", district: "Kec. Karawaci", province: "Banten", latitude: -6.1783, longitude: 106.6319 },
  { city: "Bekasi", district: "Kec. Bekasi Selatan", province: "Jawa Barat", latitude: -6.2383, longitude: 106.9896 },
  { city: "Bandung", district: "Kec. Coblong", province: "Jawa Barat", latitude: -6.9175, longitude: 107.6191 },
  { city: "Cimahi", district: "Kec. Cimahi Tengah", province: "Jawa Barat", latitude: -6.8722, longitude: 107.5425 },
  { city: "Sukabumi", district: "Kec. Cikole", province: "Jawa Barat", latitude: -6.9197, longitude: 106.9272 },
  { city: "Cirebon", district: "Kec. Kejaksan", province: "Jawa Barat", latitude: -6.7222, longitude: 108.5569 },
  { city: "Tasikmalaya", district: "Kec. Cihideung", province: "Jawa Barat", latitude: -7.3275, longitude: 108.2206 },
  { city: "Purwokerto", district: "Kec. Purwokerto Barat", province: "Jawa Tengah", latitude: -7.4214, longitude: 109.2344 },
  { city: "Surakarta", district: "Kec. Laweyan", province: "Jawa Tengah", latitude: -7.5667, longitude: 110.8167 },
  { city: "Semarang", district: "Kec. Semarang Tengah", province: "Jawa Tengah", latitude: -6.9667, longitude: 110.4167 },
  { city: "Magelang", district: "Kec. Magelang Utara", province: "Jawa Tengah", latitude: -7.4706, longitude: 110.2178 },
  { city: "Tegal", district: "Kec. Tegal Timur", province: "Jawa Tengah", latitude: -6.8694, longitude: 109.1403 },
  { city: "Pekalongan", district: "Kec. Pekalongan Timur", province: "Jawa Tengah", latitude: -6.8886, longitude: 109.6753 },
  { city: "Yogyakarta", district: "Kec. Kotagede", province: "DI Yogyakarta", latitude: -7.7956, longitude: 110.3695 },
  { city: "Sleman", district: "Kec. Gamping", province: "DI Yogyakarta", latitude: -7.7153, longitude: 110.3556 },
  { city: "Bantul", district: "Kec. Banguntapan", province: "DI Yogyakarta", latitude: -7.8881, longitude: 110.3289 },
  { city: "Kulon Progo", district: "Kec. Wates", province: "DI Yogyakarta", latitude: -7.8300, longitude: 110.1600 },
  { city: "Surabaya", district: "Kec. Wonokromo", province: "Jawa Timur", latitude: -7.2575, longitude: 112.7521 },
  { city: "Malang", district: "Kec. Lowokwaru", province: "Jawa Timur", latitude: -7.9666, longitude: 112.6326 },
  { city: "Kediri", district: "Kec. Kota Kediri", province: "Jawa Timur", latitude: -7.8167, longitude: 112.0167 },
  { city: "Blitar", district: "Kec. Kepanjenkidul", province: "Jawa Timur", latitude: -8.0983, longitude: 112.1681 },
  { city: "Madiun", district: "Kec. Manguharjo", province: "Jawa Timur", latitude: -7.6298, longitude: 111.5239 },
  { city: "Jember", district: "Kec. Kaliwates", province: "Jawa Timur", latitude: -8.1667, longitude: 113.7000 },
  { city: "Banyuwangi", district: "Kec. Banyuwangi", province: "Jawa Timur", latitude: -8.2186, longitude: 114.3669 },
  { city: "Denpasar", district: "Kec. Denpasar Barat", province: "Bali", latitude: -8.6500, longitude: 115.2167 },
  { city: "Mataram", district: "Kec. Mataram", province: "Nusa Tenggara Barat", latitude: -8.5833, longitude: 116.1167 },
  { city: "Kupang", district: "Kec. Kelapa Lima", province: "Nusa Tenggara Timur", latitude: -10.1833, longitude: 123.5833 },
  { city: "Pontianak", district: "Kec. Pontianak Kota", province: "Kalimantan Barat", latitude: -0.0333, longitude: 109.3333 },
  { city: "Palangka Raya", district: "Kec. Pahandut", province: "Kalimantan Tengah", latitude: -2.2100, longitude: 113.9100 },
  { city: "Banjarmasin", district: "Kec. Banjarmasin Tengah", province: "Kalimantan Selatan", latitude: -3.3167, longitude: 114.5903 },
  { city: "Samarinda", district: "Kec. Samarinda Ulu", province: "Kalimantan Timur", latitude: -0.5022, longitude: 117.1536 },
  { city: "Balikpapan", district: "Kec. Balikpapan Kota", province: "Kalimantan Timur", latitude: -1.2636, longitude: 116.8278 },
  { city: "Tanjung Selor", district: "Kec. Tanjung Palas", province: "Kalimantan Utara", latitude: 2.8375, longitude: 117.3653 },
  { city: "Manado", district: "Kec. Wenang", province: "Sulawesi Utara", latitude: 1.4917, longitude: 124.8428 },
  { city: "Gorontalo", district: "Kec. Kota Tengah", province: "Gorontalo", latitude: 0.5411, longitude: 123.0594 },
  { city: "Palu", district: "Kec. Palu Barat", province: "Sulawesi Tengah", latitude: -0.8960, longitude: 119.8590 },
  { city: "Makassar", district: "Kec. Makassar", province: "Sulawesi Selatan", latitude: -5.1477, longitude: 119.4327 },
  { city: "Parepare", district: "Kec. Bacukiki", province: "Sulawesi Selatan", latitude: -4.0136, longitude: 119.6256 },
  { city: "Kendari", district: "Kec. Mandonga", province: "Sulawesi Tenggara", latitude: -3.9984, longitude: 122.5129 },
  { city: "Mamuju", district: "Kec. Mamuju", province: "Sulawesi Barat", latitude: -2.6799, longitude: 118.8887 },
  { city: "Ambon", district: "Kec. Nusaniwe", province: "Maluku", latitude: -3.6954, longitude: 128.1814 },
  { city: "Ternate", district: "Kec. Ternate Tengah", province: "Maluku Utara", latitude: 0.7906, longitude: 127.3843 },
  { city: "Manokwari", district: "Kec. Manokwari Barat", province: "Papua Barat", latitude: -0.8615, longitude: 134.0620 },
  { city: "Jayapura", district: "Kec. Jayapura Utara", province: "Papua", latitude: -2.5333, longitude: 140.7167 },
  { city: "Merauke", district: "Kec. Merauke", province: "Papua Selatan", latitude: -8.4932, longitude: 140.4018 },
];

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function findNearestLocation(latitude: number, longitude: number): Location {
  const EARTH_RADIUS_KM = 6371;
  let nearest = CITIES[0];
  let nearestDistance = Infinity;

  for (const candidate of CITIES) {
    const dLat = toRadians(candidate.latitude - latitude);
    const dLon = toRadians(candidate.longitude - longitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(latitude)) *
        Math.cos(toRadians(candidate.latitude)) *
        Math.sin(dLon / 2) ** 2;
    const distance = EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = candidate;
    }
  }

  return {
    city: nearest.city,
    district: nearest.district,
    province: nearest.province,
    latitude,
    longitude,
  };
}
