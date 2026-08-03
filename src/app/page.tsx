import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import AuthRedirect from "@/components/auth/auth-redirect";
import Navbar from "@/components/landing/navbar";
import { createInsForgeServerClient } from "@/lib/insforge/server";

export const metadata: Metadata = {
  title: "BerkahID — Portal Islami Terpadu",
};

const FEATURES = [
  {
    title: "Jadwal Sholat",
    description: "Jadwal akurat sesuai lokasi dengan notifikasi adzan.",
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </>
    ),
  },
  {
    title: "Al-Qur'an",
    description: "Baca ayat, terjemahan, dan tafsir dengan progress tersimpan.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    ),
  },
  {
    title: "Zikir Harian",
    description: "Atur target zikir dan pantau amalan harianmu.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    ),
  },
  {
    title: "Doa Harian",
    description: "Kumpulan doa lengkap dengan arti, dikelompokkan per tema.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    ),
  },
  {
    title: "Cerita Islami",
    description: "Kisah Nabi, sahabat, dan inspirasi untuk menambah keimanan.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    ),
  },
  {
    title: "Arah Kiblat",
    description: "Kompas digital untuk menemukan arah kiblat dari lokasimu.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    ),
  },
];

const STATS = [
  { icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    ), value: "10K+", label: "Pengguna Aktif", sublabel: "Bergabung setiap hari" },
  { icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    ), value: "50K+", label: "Target Zikir Tercapai", sublabel: "Diamalkan oleh pengguna" },
  { icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    ), value: "100K+", label: "Ayat Dibaca", sublabel: "Setiap harinya" },
  { icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    ), value: "100%", label: "Gratis & Aman", sublabel: "Tanpa iklan, data aman" },
];

const TESTIMONIALS = [
  { text: "Aplikasi ini sangat membantu saya menjaga ibadah harian. Notifikasi sholatnya tepat waktu dan fitur zikirnya luar biasa!", name: "Ahmad Fauzi", role: "Mahasiswa" },
  { text: "Al-Qur'an dengan progress baca sangat memotivasi saya untuk lebih rutin. Desainnya juga nyaman digunakan.", name: "Siti Aisyah", role: "Ibu Rumah Tangga" },
  { text: "Fitur arah kiblat akurat sekali, berguna saat saya bepergian. Semoga BERKAHID terus berkembang!", name: "Rizky Pratama", role: "Karyawan Swasta" },
];

export default async function LandingPage() {
  try {
    const insforge = await createInsForgeServerClient();
    const { data } = await insforge.auth.getCurrentUser();
    if (data?.user) {
      redirect("/dashboard");
    }
  } catch {
    // Sesi tidak dapat diverifikasi — tampilkan landing page
  }

  return (
    <div className="min-h-dvh bg-emerald-950 font-sans text-emerald-50 selection:bg-emerald-500/30">
      <AuthRedirect />
      <Navbar />

      {/* Hero Section */}
      <main>
        <section id="beranda" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-800/40 via-emerald-950 to-emerald-950 -z-10"></div>
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-8">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/50 bg-emerald-900/50 px-3 py-1.5 text-xs font-medium text-emerald-300 mb-6">
                  <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Portal Islami Terpadu
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Ibadah Harian, <br />
                  <span className="text-emerald-400">Lebih Teratur & Bermakna</span>
                </h1>
                <p className="text-emerald-100/80 text-base md:text-lg mb-8 max-w-2xl mx-auto lg:mx-0">
                  Jadwal sholat akurat, bacaan Al-Qur&apos;an dengan progress, target zikir harian, doa, cerita Islami, dan arah kiblat — semua dalam satu aplikasi yang menemanimu setiap hari.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link href="/daftar" className="flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-emerald-400 hover:scale-105 shadow-lg shadow-emerald-500/25">
                    Daftar Sekarang
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link href="/masuk" className="rounded-full border border-emerald-700 bg-transparent px-8 py-4 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-800/50">
                    Masuk
                  </Link>
                </div>
              </div>
              <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                <div className="aspect-[4/3] sm:aspect-square relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/50 border border-emerald-800/50">
                  <Image src="/hero-illustration.jpg" alt="Ibadah Harian" fill className="object-cover" priority />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="fitur" className="py-20 bg-emerald-950 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Fitur Lengkap untuk Ibadahmu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, i) => (
                <div key={i} className="group rounded-3xl bg-emerald-900/40 border border-emerald-800/50 p-6 transition-all hover:bg-emerald-800/60 hover:-translate-y-1">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-400 ring-1 ring-emerald-800/50 group-hover:scale-110 transition-transform">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {feature.icon}
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-emerald-50">{feature.title}</h3>
                  <p className="text-sm text-emerald-200/70 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white text-emerald-950">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {STATS.map((stat, i) => (
                <div key={i} className="flex flex-col items-start rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {stat.icon}
                    </svg>
                  </div>
                  <div className="text-3xl font-black tracking-tight">{stat.value}</div>
                  <div className="mt-1 text-sm font-bold">{stat.label}</div>
                  <p className="mt-1 text-xs text-emerald-700">{stat.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Showcase / Tentang */}
        <section id="tentang" className="py-24 bg-emerald-950 relative overflow-hidden scroll-mt-20">
          <div className="absolute top-1/2 left-0 w-96 h-96 -translate-y-1/2 -translate-x-1/2 bg-emerald-800/20 rounded-full blur-3xl"></div>
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 lg:pr-12">
                <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-4 block">Kenapa BerkahID?</span>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                  Teman Ibadah Setia <br className="hidden md:block"/>
                  <span className="text-emerald-400">Setiap Hari</span>
                </h2>
                <p className="text-emerald-100/80 text-base mb-8">
                  BERKAHID dirancang untuk membantumu membangun kebiasaan ibadah yang konsisten dengan fitur yang lengkap, mudah digunakan, dan relevan dengan kebutuhanmu.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    "Desain modern, ringan & mudah digunakan",
                    "Notifikasi pintar sesuai kebiasaan ibadahmu",
                    "Fitur lengkap dalam satu aplikasi",
                    "Privasi terjaga, tanpa iklan mengganggu"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-emerald-100/90 text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="#fitur" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-400">
                  Pelajari Lebih Lanjut
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
              <div className="flex-1 w-full flex justify-center">
                <div className="relative w-full max-w-sm aspect-[9/16] rounded-[2.5rem] overflow-hidden border-[8px] border-emerald-900 shadow-2xl shadow-emerald-950">
                  <Image src="/app-mockup.jpg" alt="Aplikasi BerkahID" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-emerald-950 border-t border-emerald-900/50">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Apa Kata Mereka?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="rounded-3xl bg-emerald-900/30 border border-emerald-800/50 p-8 flex flex-col justify-between">
                  <div>
                    <svg className="h-8 w-8 text-emerald-500/50 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-emerald-100/90 text-sm leading-relaxed mb-8">{t.text}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-700/50 overflow-hidden flex items-center justify-center">
                      <svg className="h-6 w-6 text-emerald-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-0.5">
                        {[...Array(5)].map((_, j) => (
                          <svg key={j} className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="text-sm font-bold text-emerald-50">{t.name}</div>
                      <div className="text-xs text-emerald-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-emerald-50 py-16 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row items-center gap-12 bg-emerald-950 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-800/60 via-emerald-950 to-emerald-950 -z-10"></div>
              
              <div className="flex-1 z-10 w-full flex justify-center md:justify-start">
                <svg className="w-full max-w-[280px] h-auto text-emerald-900 opacity-60" viewBox="0 0 512 512" fill="currentColor">
                  {/* Mosque silhouette simplified */}
                  <path d="M256 0c-26.51 0-48 21.49-48 48 0 16.5 8.44 31 21 39.73V192H144v-56c17.67 0 32-14.33 32-32s-14.33-32-32-32H96c-17.67 0-32 14.33-32 32s14.33 32 32 32v56H32v320h448V192h-64v-56c17.67 0 32-14.33 32-32s-14.33-32-32-32-32 14.33-32 32 14.33 32 32 32v56H283V87.73C295.56 79 304 64.5 304 48c0-26.51-21.49-48-48-48zm0 32c8.84 0 16 7.16 16 16s-7.16 16-16 16-16-7.16-16-16 7.16-16 16-16zm-144 88c8.84 0 16 7.16 16 16s-7.16 16-16 16-16-7.16-16-16 7.16-16 16-16zm288 0c8.84 0 16 7.16 16 16s-7.16 16-16 16-16-7.16-16-16 7.16-16 16-16zM176 224h160v288H176V224zM64 224h80v288H64V224zm304 0h80v288h-80V224zm48 64c0 17.67-14.33 32-32 32v192h-32V320c-17.67 0-32-14.33-32-32v-32h96v32zM128 288c17.67 0 32 14.33 32 32v192h-32V320c-17.67 0-32-14.33-32-32v-32h32v32zM256 256c35.35 0 64 28.65 64 64v192H192V320c0-35.35 28.65-64 64-64z"/>
                </svg>
              </div>

              <div className="flex-[1.5] text-center md:text-left z-10">
                <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-4 block">Mulai Perjalanan Ibadahmu</span>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                  Siap Membangun Kebiasaan Ibadah yang <span className="text-emerald-400">Konsisten?</span>
                </h2>
                <p className="text-emerald-100/80 mb-8 max-w-lg mx-auto md:mx-0">
                  Buat akun gratis — hanya butuh email dan kata sandi.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  <Link href="/daftar" className="flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    Buat Akun Gratis
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link href="/masuk" className="rounded-full bg-white/10 border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20">
                    Masuk ke Akun
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 pt-16 pb-8 border-t border-emerald-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z" />
                    <circle cx="12" cy="11" r="2.2" />
                  </svg>
                </div>
                <span className="text-lg font-bold tracking-wider text-emerald-50">
                  BERKAHID
                </span>
              </div>
              <p className="text-sm text-emerald-200/60 leading-relaxed">
                Portal Islami terintegrasi untuk membantumu beribadah lebih teratur, bermakna, dan konsisten setiap hari.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a href="#" aria-label="Twitter / X" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900/80 text-emerald-400 transition-colors hover:bg-emerald-800 hover:text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900/80 text-emerald-400 transition-colors hover:bg-emerald-800 hover:text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0 5.838a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8Zm6.24-11.177a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                  </svg>
                </a>
                <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900/80 text-emerald-400 transition-colors hover:bg-emerald-800 hover:text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
                  </svg>
                </a>
                <a href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900/80 text-emerald-400 transition-colors hover:bg-emerald-800 hover:text-white">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Navigasi</h4>
              <ul className="space-y-3 text-sm text-emerald-200/70">
                <li><Link href="#beranda" className="hover:text-emerald-400 transition-colors">Beranda</Link></li>
                <li><Link href="#fitur" className="hover:text-emerald-400 transition-colors">Fitur</Link></li>
                <li><Link href="#tentang" className="hover:text-emerald-400 transition-colors">Tentang</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Informasi</h4>
              <ul className="space-y-3 text-sm text-emerald-200/70">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Tentang Kami</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Kebijakan Privasi</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Bantuan</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Kontak</h4>
              <ul className="space-y-3 text-sm text-emerald-200/70">
                <li>
                  <span className="block text-emerald-500 mb-1 text-xs">Email</span>
                  hello@berkahid.com
                </li>
                <li>
                  <span className="block text-emerald-500 mb-1 text-xs mt-4">Lokasi</span>
                  Jakarta, Indonesia
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-900 pt-8 text-center text-xs text-emerald-200/40">
            &copy; {new Date().getFullYear()} BERKAHID. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
