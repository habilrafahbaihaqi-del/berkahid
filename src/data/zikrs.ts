export interface Zikr {
  id: string;
  name: string;
  arabicText: string;
  meaning: string;
  explanation: string;
  category: string;
}

export const ZIKR_CATEGORIES = [
  "Tasbih & Pujian",
  "Istighfar",
  "Pagi & Petang",
  "Shalawat",
  "Benteng Diri",
] as const;

export const MOCK_ZIKRS: Zikr[] = [
  {
    id: "tasbih",
    name: "Tasbih",
    arabicText: "سُبْحَانَ اللَّهِ",
    meaning: "Maha Suci Allah.",
    explanation:
      "Dzikir yang paling ringan diucapkan namun berat dalam timbangan. Membacanya menjauhkan dari kesyirikan dan mengagungkan Allah dari segala kekurangan.",
    category: "Tasbih & Pujian",
  },
  {
    id: "tahmid",
    name: "Tahmid",
    arabicText: "الْحَمْدُ لِلَّهِ",
    meaning: "Segala puji bagi Allah.",
    explanation:
      "Kalimat yang memenuhi timbangan kebaikan, bentuk syukur atas segala nikmat yang Allah berikan.",
    category: "Tasbih & Pujian",
  },
  {
    id: "tahlil",
    name: "Tahlil",
    arabicText: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    meaning: "Tiada Tuhan yang berhak disembah selain Allah.",
    explanation:
      "Dzikir yang paling utama. Kalimat tauhid yang menjadi kunci masuk surga dan tanda keikhlasan seorang hamba.",
    category: "Tasbih & Pujian",
  },
  {
    id: "takbir",
    name: "Takbir",
    arabicText: "اللَّهُ أَكْبَرُ",
    meaning: "Allah Maha Besar.",
    explanation:
      "Mengagungkan Allah di atas segalanya, menguatkan keyakinan bahwa hanya Allah yang layak diagungkan.",
    category: "Tasbih & Pujian",
  },
  {
    id: "la-hawla",
    name: "La Hawla Wala Quwwata",
    arabicText: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    meaning: "Tiada daya dan upaya kecuali dengan pertolongan Allah.",
    explanation:
      "Simpanan pahala dari surga. Mengakui kelemahan diri dan hanya menggantungkan pertolongan kepada Allah.",
    category: "Tasbih & Pujian",
  },
  {
    id: "subhanallah-wa-bihamdih",
    name: "Tasbih & Tahmid",
    arabicText: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    meaning: "Maha Suci Allah dan segala puji bagi-Nya.",
    explanation:
      "Dua kalimat yang ringan di lisan, berat dalam timbangan, dan dicintai Allah Yang Maha Pengasih.",
    category: "Tasbih & Pujian",
  },
  {
    id: "istighfar",
    name: "Istighfar",
    arabicText: "أَسْتَغْفِرُ اللَّهَ",
    meaning: "Aku memohon ampunan kepada Allah.",
    explanation:
      "Permohonan ampun yang menghapus dosa, mendatangkan rezeki, dan menjadi sebab turunnya rahmat Allah.",
    category: "Istighfar",
  },
  {
    id: "sayyidul-istighfar",
    name: "Sayyidul Istighfar",
    arabicText:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    meaning:
      "Ya Allah, Engkau Tuhanku, tiada Tuhan selain Engkau. Engkau menciptakanku dan aku hamba-Mu…",
    explanation:
      "Penghulu istighfar. Siapa yang membacanya di pagi hari dengan yakin lalu wafat sebelum petang, ia termasuk penghuni surga.",
    category: "Istighfar",
  },
  {
    id: "istighfar-sayyidi",
    name: "Istighfar Pembuka Rezeki",
    arabicText: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ",
    meaning: "Aku memohon ampun kepada Allah Yang Maha Agung dan bertobat kepada-Nya.",
    explanation:
      "Dzikir istighfar yang diajarkan Rasulullah untuk memohon ampunan dan memperbanyak kebaikan.",
    category: "Istighfar",
  },
  {
    id: "dzikir-pagi",
    name: "Dzikir Ridha Pagi",
    arabicText: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا",
    meaning:
      "Aku ridha Allah sebagai Tuhanku, Islam sebagai agamaku, dan Muhammad sebagai nabiku.",
    explanation:
      "Barangsiapa membacanya di pagi hari, Allah menjamin keridhaan-Nya atasnya di hari kiamat.",
    category: "Pagi & Petang",
  },
  {
    id: "dzikir-petang",
    name: "Dzikir Perlindungan Petang",
    arabicText:
      "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    meaning:
      "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari keburukan makhluk-Nya.",
    explanation:
      "Dibaca saat petang untuk memohon perlindungan dari keburukan makhluk; tidak ada bahaya yang mengenainya hingga pagi.",
    category: "Pagi & Petang",
  },
  {
    id: "subhanallah-100",
    name: "Dzikir Pagi Petang",
    arabicText: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    meaning: "Maha Suci Allah dan segala puji bagi-Nya. Maha Suci Allah Yang Maha Agung.",
    explanation:
      "Dzikir seratus kali di pagi dan petang; tidak ada yang datang dengan yang lebih baik darinya kecuali yang membacanya lebih banyak.",
    category: "Pagi & Petang",
  },
  {
    id: "hasbunallah",
    name: "Hasbunallah Wanikmal Wakil",
    arabicText: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    meaning: "Cukuplah Allah bagi kami, dan Dia sebaik-baik pelindung.",
    explanation:
      "Ucapan yang diucapkan Nabi Ibrahim saat menghadapi api dan Nabi Muhammad saat menghadapi musuh — penguat tawakal kepada Allah.",
    category: "Benteng Diri",
  },
  {
    id: "qul-huwallahu-ahad",
    name: "Al-Ikhlas & Mu'awwidzatain",
    arabicText:
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
    meaning: "Katakanlah: Dialah Allah Yang Maha Esa.",
    explanation:
      "Membaca Al-Ikhlas, Al-Falaq, dan An-Nas tiga kali pagi dan petang mencukupi perlindungan dari segala keburukan.",
    category: "Benteng Diri",
  },
  {
    id: "shalawat",
    name: "Shalawat kepada Nabi",
    arabicText: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    meaning: "Ya Allah, limpahkanlah shalawat kepada Muhammad dan keluarganya.",
    explanation:
      "Siapa bershalawat sekali, Allah bershalawat kepadanya sepuluh kali; shalawat menjadi sebab diampuninya dosa.",
    category: "Shalawat",
  },
  {
    id: "shalawat-sayyidina",
    name: "Shalawat Penghilang Kesusahan",
    arabicText: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ",
    meaning: "Ya Allah, limpahkanlah shalawat kepada junjungan kami Muhammad.",
    explanation:
      "Shalawat yang biasa dibaca umat Islam untuk mendekatkan diri kepada Allah dan memuliakan Nabi-Nya.",
    category: "Shalawat",
  },
];
