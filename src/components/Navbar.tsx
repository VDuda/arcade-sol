"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useArcadeSession } from "@/context/ArcadeSessionContext";
import { Coins, PlusCircle, Loader2, LogOut } from "lucide-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";
import { useSoundFx } from "@/hooks/useSoundFx";

export default function Navbar() {
  const { balance, deposit, withdraw, isLoading } = useArcadeSession();
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { playCoin, playSuccess, playClick } = useSoundFx();

  const handleDeposit = async () => {
    playClick();
    setIsDepositing(true);
    try {
      await deposit(0.1); // Deposit 0.1 SOL
      playCoin();
      toast.success("Deposit successful! +0.1 SOL added to session.");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Deposit failed.");
    } finally {
      setIsDepositing(false);
    }
  };

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
    <nav className="w-full p-4 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        ARCADE.SOL
      </Link>

      <div className="flex items-center gap-4">
        {/* Session Balance Card */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Session Credit</span>
            <div className="flex items-center gap-1 font-mono text-lg text-yellow-400">
              <Coins size={16} />
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <span>{(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL</span>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleDeposit}
            disabled={isDepositing}
            className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
            title="Insert Coin (Deposit 0.1 SOL)"
          >
            {isDepositing ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} className="text-green-400" />}
          </button>

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
  );
}
