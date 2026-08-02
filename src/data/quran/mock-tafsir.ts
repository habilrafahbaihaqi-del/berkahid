export const MOCK_TAFSIR: Record<string, string> = {
  "1:1": "Al-Fatihah adalah pembuka Al-Qur'an. Ayat ini memulai bacaan dengan nama Allah sebagai bentuk pengagungan dan pengharapan berkah kepada-Nya.",
  "1:2": "Segala pujian dipersembahkan hanya kepada Allah, yang memelihara dan mengurus seluruh alam beserta isinya.",
  "1:3": "Allah adalah Ar-Rahman dan Ar-Rahim, yaitu Yang Maha Pengasih kepada seluruh makhluk dan Yang Maha Penyayang khusus kepada orang-orang beriman.",
  "1:4": "Allah adalah penguasa Hari Pembalasan, hari ketika seluruh amal manusia dibalas secara adil.",
  "1:5": "Hanya kepada Allah kita beribadah dan hanya kepada-Nya pula kita memohon pertolongan dalam segala urusan.",
  "1:6": "Permohonan agar ditunjukkan jalan yang lurus, yaitu jalan kebenaran yang diridai Allah.",
  "1:7": "Jalan orang-orang yang diberi nikmat, bukan jalan orang-orang yang dimurkai, dan bukan pula jalan orang-orang yang sesat.",
};

export function getMockTafsir(surah: number, ayah: number): string | null {
  return MOCK_TAFSIR[`${surah}:${ayah}`] ?? null;
}
