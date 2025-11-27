import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { MiniPayBanner } from "@/components/MiniPayBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Celo Knowledge Quest - Learn, Play, Earn",
  description: "Educational play-to-earn trivia game on Celo. Learn about blockchain while earning cUSD rewards.",
  keywords: "Celo, trivia, play-to-earn, blockchain, education, cUSD, MiniPay",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-green-50 to-yellow-50 min-h-screen`}
      >
        <Providers>
          <MiniPayBanner />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
