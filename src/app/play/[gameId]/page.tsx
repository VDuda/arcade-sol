"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"; 
import { useConnection } from "@solana/wallet-adapter-react";
import { useArcadeSession } from "@/context/ArcadeSessionContext";
import { getGameById } from "@/lib/games";
import { fetchWith402 } from "@/lib/x402";
import { Loader2, AlertCircle, ArrowLeft, Coins } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import DepositModal from "@/components/DepositModal";

export default function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const router = useRouter();
  const { connection } = useConnection();
  const { sessionKeypair, balance, balanceUSDC, isLoading: isSessionLoading } = useArcadeSession();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const game = getGameById(gameId);

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl text-red-500 font-press-start">Game Not Found</h2>
        <Link href="/" className="mt-4 text-purple-400 hover:underline font-mono">Back to Lobby</Link>
      </div>
    );
  }

  const handleStartGame = async () => {
    if (!sessionKeypair) return;
    setIsStarting(true);
    setError(null);

    try {
      const response = await fetchWith402(
        "/api/start-game",
        { gameId: game.id },
        connection,
        sessionKeypair
      );

      if (response.success) {
        setIsPlaying(true);
        toast.success("COIN INSERTED! GOOD LUCK!");
      } else {
        setError(response.error || "Failed to start game");
      }
    } catch (e: any) {
      console.error(e);
      if (e.message.includes("INSUFFICIENT_FUNDS")) {
        setError("OUT OF CREDITS");
        setIsDepositOpen(true);
      } else {
        setError(e.message || "Payment Failed");
        toast.error(e.message || "Payment Failed");
      }
    } finally {
      setIsStarting(false);
    }
  };

  const handleGameOver = (score: number) => {
    console.log("Game Over! Score:", score);
    setIsPlaying(false);
  };

  if (isPlaying && game.component) {
    const GameComponent = game.component;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="w-full h-[80vh] relative bg-black rounded-xl overflow-hidden border-4 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] crt-scanline"
      >
         <GameComponent onGameOver={handleGameOver} />
         <button 
           onClick={() => setIsPlaying(false)}
           className="absolute top-4 right-4 px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded text-xs z-50 font-press-start text-white border border-red-400"
         >
           QUIT
         </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
      <div className="w-full flex justify-start">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-mono uppercase text-sm">
          <ArrowLeft size={16} /> Back to Arcade
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full aspect-video bg-gradient-to-br ${game.accentColor} rounded-xl p-1 relative overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.5)]`}
      >
        <div className="absolute inset-0 bg-black/40" />
        
        {/* CRT Scanline Effect (Preview) */}
        <div className="absolute inset-0 crt-scanline z-10 pointer-events-none opacity-50" />

        <div className="relative z-20 w-full h-full bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-lg">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] font-press-start">
            {game.title}
          </h1>
          <p className="text-gray-400 text-sm md:text-lg mb-8 max-w-md font-mono">
            {game.description}
          </p>

          <div className="flex flex-col items-center gap-4">
            {error && (
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-red-400 bg-red-950/80 px-6 py-3 rounded border border-red-500/50 mb-4"
              >
                <AlertCircle size={20} /> 
                <span className="font-press-start text-xs">{error}</span>
              </motion.div>
            )}

            {!isSessionLoading && (
              <>
                 <button
                    onClick={handleStartGame}
                    disabled={isStarting}
                    className="group relative px-10 py-5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl tracking-widest rounded shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_40px_rgba(250,204,21,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                 >
                    {isStarting ? (
                      <span className="flex items-center gap-2 font-press-start text-sm">
                        <Loader2 className="animate-spin" /> PROCESSING...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3 font-press-start">
                        <Coins className="w-6 h-6" /> INSERT COIN
                      </span>
                    )}
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-white/20 rounded pointer-events-none" />
                 </button>
                 
                 <div className="text-xs md:text-sm font-mono text-gray-500 mt-4 bg-black/50 px-3 py-1 rounded border border-white/10">
                   COST: <span className="text-yellow-400">{(game.costPerLife / 1_000_000).toFixed(2)} USDC</span> / LIFE
                 </div>
              </>
            )}
            
            {/* Show Session Balance Warning if Low */}
            {(balanceUSDC < game.costPerLife) && !isSessionLoading && !error && (
               <p className="text-red-400 text-[10px] md:text-xs font-mono animate-pulse mt-2">
                 * INSUFFICIENT CREDITS
               </p>
            )}
          </div>
        </div>
      </motion.div>

      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </div>
  );
}
