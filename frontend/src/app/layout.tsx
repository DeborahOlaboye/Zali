import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { MiniPayBanner } from "@/components/MiniPayBanner";
import { AutoFaucetProvider } from "@/contexts/AutoFaucetContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zali - Learn, Play, Earn",
  description: "Educational play-to-earn trivia game on Celo. Learn about blockchain while earning cUSD rewards.",
  keywords: "Zali, Celo, trivia, play-to-earn, blockchain, education, cUSD, MiniPay",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-green-50 to-yellow-50 min-h-screen`}>
        <Providers>
          <AutoFaucetProvider>
            <MiniPayBanner />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster position="top-right" />
          </AutoFaucetProvider>
        </Providers>
      </body>
    </html>
  );
}