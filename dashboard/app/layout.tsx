import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Cormorant_Garamond, Outfit, DM_Mono } from "next/font/google";

import { Navbar } from "@/components/layout/navbar";

import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  weight: ["500", "600"],
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  weight: ["400", "500"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Nomad Dashboard — Kültürel Miras Vitrini",
  description:
    "Türkiye tarihi mekanları ve hasar raporları canlı vitrin paneli.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable} ${outfit.variable} ${dmMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border bg-surface py-6 text-center text-xs text-brown">
          Nomad v1.0.0 · Future Talent 2026
        </footer>
      </body>
    </html>
  );
}

