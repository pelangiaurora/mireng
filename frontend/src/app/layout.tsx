import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthInitializer from "@/components/auth/AuthInitializer";
import Providers from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mireng — Marketplace Terpercaya Indonesia",
    template: "%s | Mireng",
  },
  description:
    "Belanja produk fisik dan digital terpercaya dari seluruh Indonesia. Transaksi aman, gratis ongkir, mudah return.",
  keywords: ["marketplace", "belanja online", "produk digital", "mireng", "Indonesia"],
  authors: [{ name: "Mireng" }],
  creator: "Mireng Marketplace",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Mireng Marketplace",
    title: "Mireng — Marketplace Terpercaya Indonesia",
    description: "Belanja produk fisik dan digital terpercaya dari seluruh Indonesia.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2D6BE4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <AuthInitializer />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}