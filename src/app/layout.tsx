import type { Metadata } from "next";
import { Amiri, Geist, Geist_Mono } from "next/font/google";
import AdhanNotifier from "@/components/adhan-notifier";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-quran",
  subsets: ["arabic"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "BerkahID — Portal Islami Terpadu",
    template: "%s | BerkahID",
  },
  description:
    "Portal Islami terpadu: jadwal sholat, Al-Qur'an, zikir, doa, cerita Islami, dan arah kiblat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <AdhanNotifier />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
