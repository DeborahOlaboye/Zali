import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { SkipNavLink } from "@/components/SkipNavLink";
import { Toaster } from "react-hot-toast";
import { AutoFaucetProvider } from "@/contexts/AutoFaucetContext";
import { Suspense } from "react";
import PageTracker from "@/components/PageTracker";
import WalletTracker from "@/components/WalletTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zali - Learn, Play, Earn",
  description: "Educational play-to-earn trivia game on Base. Learn about blockchain while earning ETH rewards.",
  keywords: "Zali, Base, trivia, play-to-earn, blockchain, education, ETH",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300`}>
        <Providers>
          <Suspense fallback={null}>
            <PageTracker />
            <WalletTracker />
          </Suspense>
          <AutoFaucetProvider>
            <SkipNavLink />
            <Navbar />
            <main id="main-content" className="min-h-screen text-foreground">
              {children}
            </main>
            <Toaster position="top-right" />
          </AutoFaucetProvider>
        </Providers>
      </body>
    </html>
  );
}