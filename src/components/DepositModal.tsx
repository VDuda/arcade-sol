"use client";

import React, { useState } from "react";
import { Loader2, X, Coins } from "lucide-react";
import { useArcadeSession } from "@/context/ArcadeSessionContext";
import { toast } from "sonner";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { deposit } = useArcadeSession();
  const [amount, setAmount] = useState("5");
  const [isDepositing, setIsDepositing] = useState(false);

  if (!isOpen) return null;

  const handleDeposit = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setIsDepositing(true);
    try {
      // 0.02 SOL Gas fixed for now, User chooses USDC
      await deposit(0.02, val); 
      toast.success(`Deposited ${val} USDC + Gas!`);
      onClose();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Deposit failed.");
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border-2 border-white/20 rounded-xl p-6 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold font-press-start text-yellow-400 mb-6 flex items-center gap-2">
          <Coins className="w-6 h-6" /> INSERT COIN
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2">AMOUNT (USDC)</label>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded p-3 text-2xl font-mono text-green-400 focus:outline-none focus:border-green-400 transition-colors"
                placeholder="0.00"
                min="0.1"
                step="0.1"
              />
              <span className="absolute right-4 top-4 text-gray-500 font-mono text-sm">USDC</span>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded text-xs font-mono text-gray-400 flex justify-between">
            <span>+ GAS FEE (SOL)</span>
            <span className="text-white">0.02 SOL</span>
          </div>

          <button
            onClick={handleDeposit}
            disabled={isDepositing}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold font-press-start rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDepositing ? <Loader2 className="animate-spin" /> : "CONFIRM"}
          </button>
          
          <p className="text-[10px] text-center text-gray-500 font-mono mt-4">
            Funds are moved to your local Session Wallet.
            <br />
            You can withdraw unused funds at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
