import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google"; // Adding a retro font if possible, else just Inter
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-slate-950 text-white min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}