export interface Story {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
}

export const STORY_CATEGORIES = [
  "Kisah Nabi",
  "Kisah Sahabat",
  "Inspirasi",
] as const;

export const MOCK_STORIES: Story[] = [
  {
    id: "nabi-ibrahim-api",
    title: "Nabi Ibrahim dan Api yang Dingin",
    category: "Kisah Nabi",
    summary:
      "Keteguhan Nabi Ibrahim menghadapi pembakaran kaumnya dan pertolongan Allah yang ajaib.",
    content:
      "Nabi Ibrahim berdiri teguh di hadapan kaumnya yang menyembah berhala. Ketika dakwahnya ditolak, kaumnya memutuskan untuk membakarnya hidup-hidup. Mereka membangun tungku besar dan melemparkan Nabi Ibrahim ke dalamnya.\n\nNamun Allah berfirman kepada api: 'Hai api, jadilah dingin dan keselamatan bagi Ibrahim.' Api itu pun menjadi dingin, dan Nabi Ibrahim keluar dengan selamat.\n\nKisah ini mengajarkan bahwa pertolongan Allah datang kepada hamba-Nya yang bertawakal, sebesar apa pun cobaan yang dihadapi.",
  },
  {
    id: "nabi-yusuf-mimpi",
    title: "Nabi Yusuf dan Mimpi Sang Raja",
    category: "Kisah Nabi",
    summary:
      "Perjalanan Nabi Yusuf dari sumur hingga menjadi pembesar Mesir melalui mimpi raja.",
    content:
      "Nabi Yusuf pernah bermimpi sebelas bintang, matahari, dan bulan bersujud kepadanya. Mimpi itu menjadi awal perjalanan panjang yang penuh ujian: dibuang ke sumur oleh saudara-saudaranya, dijual sebagai budak, hingga dipenjara.\n\nDi penjara, Yusuf menafsirkan mimpi para tahanan. Kemudian raja Mesir bermimpi tentang tujuh sapi gemuk yang dimakan tujuh sapi kurus. Yusuf menafsirkannya sebagai tujuh tahun subur dan tujuh tahun kering.\n\nBerkat penafsirannya, Yusuf diangkat menjadi pembesar Mesir dan menyelamatkan negeri dari masa kelaparan. Kesabaran dan kejujurannya menjadi teladan hingga akhir hayat.",
  },
  {
    id: "nabi-muhammad-khulud",
    title: "Rasulullah dan Si Pengemis Yahudi",
    category: "Kisah Nabi",
    summary:
      "Akhlak mulia Rasulullah yang tetap memberi sedekah kepada pengemis yang mencacinya.",
    content:
      "Di dekat rumah Rasulullah tinggal seorang pengemis Yahudi yang setiap pagi mencela beliau. Namun setiap hari, seseorang selalu memberinya sedekah dengan sembunyi-sembunyi.\n\nSuatu hari pengemis itu tidak menerima sedekahnya. Ia bertanya-tanya, lalu diberitahu bahwa orang yang biasa memberinya sedekah adalah Muhammad yang kini sedang sakit.\n\nPengemis itu tersentuh. Ia mengunjungi Rasulullah dan akhirnya memeluk Islam. Akhlak mulia beliau mengalahkan kebencian dengan kebaikan.",
  },
  {
    id: "sahabat-bilal-adzan",
    title: "Bilal bin Rabah, Muazin Pertama",
    category: "Kisah Sahabat",
    summary:
      "Kesetiaan Bilal yang rela disiksa demi mempertahankan keimanannya kepada Allah.",
    content:
      "Bilal bin Rabah adalah seorang budak dari Habasyah. Ketika memeluk Islam, ia disiksa oleh majikannya dengan dibaringkan di atas pasir panas dan ditindih batu besar.\n\nNamun yang keluar dari mulutnya hanyalah 'Ahad, Ahad' — Allah Yang Maha Esa. Abu Bakar kemudian memerdekakannya.\n\nSetelah hijrah, Bilal dipercaya menjadi muazin Rasulullah. Suaranya yang merdu mengumandangkan adzan pertama dalam sejarah Islam. Kisahnya membuktikan bahwa kemuliaan di sisi Allah bukan karena keturunan, melainkan ketakwaan.",
  },
  {
    id: "sahabat-umar-keadilan",
    title: "Umar bin Khattab dan Ibu yang Menangis",
    category: "Kisah Sahabat",
    summary:
      "Kepemimpinan Umar yang memilih keadilan daripada kenyamanan demi rakyatnya.",
    content:
      "Suatu malam, Khalifah Umar bin Khattab berkeliling mengamati keadaan rakyatnya. Ia mendengar tangisan seorang ibu dan anaknya yang kelaparan.\n\nUmar segera pulang, memikul sekarung gandum di punggungnya, dan memasak makanan untuk mereka. Ketika ditanya mengapa ia memilih sendiri, Umar menjawab bahwa ia akan dimintai pertanggungjawaban atas setiap rakyatnya di hari kiamat.\n\nKepemimpinan Umar dikenal dengan keadilannya yang luar biasa, hingga ia dijuluki Al-Faruq, pembeda antara yang hak dan batil.",
  },
  {
    id: "sahabat-abu-bakar-ukhuwah",
    title: "Abu Bakar di Gua Tsur",
    category: "Kisah Sahabat",
    summary:
      "Pengorbanan Abu Bakar menemani Rasulullah dalam hijrah yang penuh bahaya.",
    content:
      "Saat Rasulullah hijrah ke Madinah, Abu Bakar mendampinginya bersembunyi di Gua Tsur selama tiga hari. Ketika para pengejar hampir tiba di mulut gua, Abu Bakar khawatir Rasulullah terbuka.\n\nRasulullah menenangkannya: 'Jangan bersedih, sesungguhnya Allah bersama kita.' Allah pun menurunkan ketenangan dan menyelamatkan mereka.\n\nAbu Bakar menyerahkan seluruh hartanya demi perjuangan Islam, sehingga Rasulullah bersabda bahwa tidak ada harta Abu Bakar yang lebih bermanfaat baginya selain harta yang ia infakkan.",
  },
  {
    id: "inspirasi-ikhlash",
    title: "Amalan yang Sembunyi",
    category: "Inspirasi",
    summary:
      "Kisah seorang hamba yang mengamalkan ibadah tanpa diketahui siapa pun demi keikhlasan.",
    content:
      "Di sebuah kota, hidup seorang lelaki yang setiap malam berjalan menuju masjid lebih awal. Ia shalat sunnah dan membaca Al-Qur'an dalam keheningan malam, tanpa diketahui siapa pun.\n\nTahun berganti, rumahnya berpindah, dan tak ada yang mengenalnya. Namun warga menyadari bahwa lingkungan mereka selalu aman dan tentram.\n\nKisah ini mengingatkan bahwa amalan terbaik adalah yang dilakukan dengan ikhlas karena Allah, meskipun tak seorang pun mengetahuinya. Allah melihat setiap amal, sekecil apa pun.",
  },
  {
    id: "inspirasi-sedekah",
    title: "Sedekah di Tengah Kesulitan",
    category: "Inspirasi",
    summary:
      "Seorang fakir yang tetap bersedekah dan Allah menggantinya dengan berkah yang melimpah.",
    content:
      "Seorang lelaki miskin berjalan-jalan setiap pagi mencari rezeki. Suatu hari ia hanya memiliki beberapa keping uang, cukup untuk membeli sepotong roti.\n\nNamun di tengah jalan ia melihat orang tua yang lebih membutuhkan. Ia pun memberikan rotinya sambil menahan lapar.\n\nSesampainya di rumah, ia menemukan tetangganya telah meninggalkan bingkisan makanan. Sejak itu, rezekinya terus mengalir dari arah yang tak ia duga. Allah berfirman bahwa siapa yang memberi pinjaman kepada Allah dengan pinjaman yang baik, Allah akan melipatgandakannya.",
  },
  {
    id: "inspirasi-tawakal",
    title: "Tawakal Setelah Ikhtiar",
    category: "Inspirasi",
    summary:
      "Seorang petani yang rajin bekerja lalu berserah diri kepada Allah atas hasil panennya.",
    content:
      "Di sebuah desa, tinggal seorang petani yang selalu bekerja keras sejak subuh. Ia membajak, menanam, dan merawat ladangnya dengan teliti.\n\nKetika tetangganya bertanya mengapa ia begitu rajin, ia menjawab bahwa ia berikhtiar semaksimal mungkin, lalu bertawakal kepada Allah atas hasilnya.\n\nMusim panen tiba, ladangnya menghasilkan lebih banyak dari sebelumnya. Para tetangga pun belajar bahwa tawakal tidak berarti berpangku tangan, melainkan berserah diri setelah berusaha sebaik-baiknya.",
  },
];
