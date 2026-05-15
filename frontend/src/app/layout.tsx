import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import AuthInitializer from "@/components/auth/AuthInitializer";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mireng Marketplace",
  description: "Marketplace digital untuk akun, file, dan lisensi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <AuthInitializer />
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
          © 2026 Mireng Marketplace. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
