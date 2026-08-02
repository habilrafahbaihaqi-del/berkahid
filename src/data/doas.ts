export interface Doa {
  id: string;
  title: string;
  arabicText: string;
  translation: string;
  category: string;
}

export interface DoaCategory {
  slug: string;
  name: string;
  description: string;
}

export const DOA_CATEGORIES: DoaCategory[] = [
  { slug: "bangun-tidur", name: "Bangun Tidur", description: "Doa saat bangun dari tidur" },
  { slug: "makan", name: "Sebelum & Sesudah Makan", description: "Doa di sekitar makan dan minum" },
  { slug: "rumah", name: "Masuk & Keluar Rumah", description: "Doa berlindung dan memohon kebaikan" },
  { slug: "masjid", name: "Masuk & Keluar Masjid", description: "Doa memohon rahmat dan karunia" },
  { slug: "wudhu", name: "Wudhu", description: "Doa saat bersuci" },
  { slug: "perjalanan", name: "Perjalanan", description: "Doa naik kendaraan dan musafir" },
  { slug: "malam", name: "Sebelum Tidur", description: "Doa menjelang tidur" },
  { slug: "adzan", name: "Adzan", description: "Doa setelah mendengar adzan" },
];

export const MOCK_DOAS: Doa[] = [
  {
    id: "bangun-tidur",
    title: "Doa Bangun Tidur",
    arabicText: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    translation:
      "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan hanya kepada-Nya kami dibangkitkan.",
    category: "bangun-tidur",
  },
  {
    id: "sebelum-makan",
    title: "Doa Sebelum Makan",
    arabicText: "بِسْمِ اللَّهِ",
    translation: "Dengan menyebut nama Allah.",
    category: "makan",
  },
  {
    id: "sesudah-makan",
    title: "Doa Sesudah Makan",
    arabicText: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    translation:
      "Segala puji bagi Allah yang memberi kami makan dan minum, serta menjadikan kami orang-orang muslim.",
    category: "makan",
  },
  {
    id: "lupa-baca-bismillah",
    title: "Doa Saat Lupa Membaca Basmalah",
    arabicText: "بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ",
    translation: "Dengan nama Allah di awal dan di akhirnya.",
    category: "makan",
  },
  {
    id: "keluar-rumah",
    title: "Doa Keluar Rumah",
    arabicText: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    translation:
      "Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan upaya kecuali dengan pertolongan Allah.",
    category: "rumah",
  },
  {
    id: "masuk-rumah",
    title: "Doa Masuk Rumah",
    arabicText:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    translation:
      "Ya Allah, aku memohon kebaikan tempat masuk dan tempat keluar. Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Allah Tuhan kami kami bertawakal.",
    category: "rumah",
  },
  {
    id: "masuk-masjid",
    title: "Doa Masuk Masjid",
    arabicText: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    translation: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.",
    category: "masjid",
  },
  {
    id: "keluar-masjid",
    title: "Doa Keluar Masjid",
    arabicText: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    translation: "Ya Allah, sesungguhnya aku memohon karunia-Mu.",
    category: "masjid",
  },
  {
    id: "sebelum-wudhu",
    title: "Doa Sebelum Wudhu",
    arabicText: "بِسْمِ اللَّهِ",
    translation: "Dengan menyebut nama Allah.",
    category: "wudhu",
  },
  {
    id: "sesudah-wudhu",
    title: "Doa Sesudah Wudhu",
    arabicText:
      "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    translation:
      "Aku bersaksi bahwa tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya.",
    category: "wudhu",
  },
  {
    id: "naik-kendaraan",
    title: "Doa Naik Kendaraan",
    arabicText:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    translation:
      "Maha Suci Allah yang telah menundukkan kendaraan ini untuk kami, padahal sebelumnya kami tidak mampu menguasainya. Dan sesungguhnya hanya kepada Tuhan kami kami kembali.",
    category: "perjalanan",
  },
  {
    id: "doa-musafir",
    title: "Doa Musafir",
    arabicText:
      "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى",
    translation:
      "Ya Allah, kami memohon kepada-Mu dalam perjalanan kami ini kebaikan, ketakwaan, dan amal yang Engkau ridai.",
    category: "perjalanan",
  },
  {
    id: "sebelum-tidur",
    title: "Doa Sebelum Tidur",
    arabicText: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    translation: "Dengan nama-Mu ya Allah, aku mati dan aku hidup.",
    category: "malam",
  },
  {
    id: "bangun-malam",
    title: "Doa Bangun Tengah Malam",
    arabicText:
      "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    translation:
      "Tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, dan Dia Maha Kuasa atas segala sesuatu.",
    category: "malam",
  },
  {
    id: "setelah-adzan",
    title: "Doa Setelah Adzan",
    arabicText:
      "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
    translation:
      "Ya Allah, Tuhan pemilik seruan yang sempurna ini dan shalat yang ditegakkan, berikanlah kepada Muhammad wasilah dan keutamaan, serta bangkitkanlah dia di tempat terpuji yang telah Engkau janjikan.",
    category: "adzan",
  },
];
