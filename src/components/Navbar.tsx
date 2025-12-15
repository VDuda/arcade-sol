"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useArcadeSession } from "@/context/ArcadeSessionContext";
import { Coins, PlusCircle, Loader2 } from "lucide-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function Navbar() {
  const { balance, deposit, isLoading } = useArcadeSession();
  const [isDepositing, setIsDepositing] = useState(false);

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      await deposit(0.1); // Deposit 0.1 SOL
    } catch (e) {
      console.error(e);
      alert("Deposit failed. Check console.");
    } finally {
      setIsDepositing(false);
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
        </div>

        <WalletMultiButton style={{ height: 40, borderRadius: 20 }} />
      </div>
    </nav>
  );
}
