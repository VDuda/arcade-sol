"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useArcadeSession } from "@/context/ArcadeSessionContext";
import { Coins, PlusCircle, Loader2, LogOut } from "lucide-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";
import { useSoundFx } from "@/hooks/useSoundFx";
import DepositModal from "@/components/DepositModal";

// Dynamically import WalletMultiButton to avoid hydration mismatch
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export default function Navbar() {
  const { balance, balanceUSDC, withdraw, isLoading } = useArcadeSession();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { playSuccess, playClick } = useSoundFx();

  const handleWithdraw = async () => {
    playClick();
    if (!confirm("Withdraw all funds from session wallet to your main wallet?")) return;
    setIsWithdrawing(true);
    try {
      const signature = await withdraw();
      playSuccess();
      toast.success("Withdraw successful! Funds returned to wallet.");
      console.log("Withdraw tx:", signature);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Withdraw failed.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <>
      <nav className="w-full p-4 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 font-press-start hover:animate-pulse">
          ARCADE.SOL
        </Link>

        <div className="flex items-center gap-4">
          {/* Session Balance Card */}
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <div className="flex flex-col items-end leading-none">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Session Credit</span>
              <div className="flex items-center gap-3 font-mono text-sm text-yellow-400">
                {isLoading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <>
                    <span className="text-green-400 font-bold">{(balanceUSDC / 1_000_000).toFixed(2)} USDC</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-400">{(balance / LAMPORTS_PER_SOL).toFixed(3)} SOL</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <button 
                onClick={() => { playClick(); setIsDepositModalOpen(true); }}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                title="Insert Coin (Deposit)"
              >
                <PlusCircle size={20} className="text-green-400" />
              </button>
              {balanceUSDC === 0 && (
                <a 
                  href="https://faucet.circle.com/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[9px] text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
                >
                  Need USDC?
                </a>
              )}
            </div>

            {balance > 5000 && (
               <button 
                 onClick={handleWithdraw}
                 disabled={isWithdrawing}
                 className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                 title="Withdraw Funds"
               >
                 {isWithdrawing ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} className="text-red-400" />}
               </button>
            )}
          </div>

          <WalletMultiButton style={{ height: 40, borderRadius: 20 }} />
        </div>
      </nav>
      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
    </>
  );
}
