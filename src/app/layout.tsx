import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/ui/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const pressStart = Press_Start_2P({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-press-start" 
});

export const metadata: Metadata = {
  title: "Arcade.sol",
  description: "The Web3 Quarter Slot. Pay-per-life gaming on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${pressStart.variable} font-sans bg-slate-950 text-white min-h-screen selection:bg-pink-500 selection:text-white`}>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8 relative z-10">
            {children}
          </main>
          {/* Background Grid / Atmosphere */}
          <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          <ToastProvider />
          
          {/* Global CRT Overlay */}
          <div className="fixed inset-0 pointer-events-none z-[9999] crt-scanline opacity-20 mix-blend-overlay" />
        </Providers>
      </body>
    </html>
  );
}