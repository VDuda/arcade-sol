"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { useConnection } from "@solana/wallet-adapter-react";
import { useArcadeSession } from "@/context/ArcadeSessionContext";
import { getGameById } from "@/lib/games";
import { fetchWith402 } from "@/lib/x402";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const router = useRouter();
  const { connection } = useConnection();
  const { sessionKeypair, balance, deposit, isLoading: isSessionLoading } = useArcadeSession();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const game = getGameById(gameId);

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl text-red-500">Game Not Found</h2>
        <Link href="/" className="mt-4 text-purple-400 hover:underline">Back to Lobby</Link>
      </div>
    );
  }

  const handleStartGame = async () => {
    if (!sessionKeypair) return;
    setIsStarting(true);
    setError(null);

    try {
      // 1. Check if we have enough balance locally first (optional UX improvement)
      // For now, let x402 handle it.
      
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
      if (e.message === "INSUFFICIENT_FUNDS" || e.message.includes("Attempt to debit an account but found no record")) {
        const msg = "Not enough coins! Please click the + button in the navbar to deposit.";
        setError(msg);
        toast.error(msg);
      } else {
        setError(e.message || "Payment Failed");
        toast.error(e.message || "Payment Failed");
      }
    } finally {
      setIsStarting(false);
    }
  };

  const handleGameOver = (score: number) => {
    // Submit score logic here if needed
    console.log("Game Over! Score:", score);
    setIsPlaying(false);
  };

  if (isPlaying && game.component) {
    const GameComponent = game.component;
    return (
      <div className="w-full h-[80vh] relative bg-black rounded-xl overflow-hidden border-4 border-gray-800 shadow-2xl">
         <GameComponent onGameOver={handleGameOver} />
         <button 
           onClick={() => setIsPlaying(false)}
           className="absolute top-4 right-4 px-3 py-1 bg-red-600/50 hover:bg-red-600 rounded text-xs"
         >
           QUIT
         </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
      <div className="w-full flex justify-start">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back to Arcade
        </Link>
      </div>

      <div className={`w-full aspect-video bg-gradient-to-br ${game.accentColor} rounded-xl p-1 relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-black/40" />
        
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%]" />

        <div className="relative z-20 w-full h-full bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-lg">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {game.title}
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-md">
            {game.description}
          </p>

          <div className="flex flex-col items-center gap-4">
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-950/50 px-4 py-2 rounded">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {!isSessionLoading && (
              <>
                 <button
                    onClick={handleStartGame}
                    disabled={isStarting}
                    className="group relative px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl tracking-widest rounded shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_40px_rgba(250,204,21,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                 >
                    {isStarting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" /> INSERTING COIN...
                      </span>
                    ) : (
                      "INSERT COIN"
                    )}
                    <div className="absolute top-0 left-0 w-full h-full border-2 border-white/20 rounded pointer-events-none" />
                 </button>
                 
                 <div className="text-sm font-mono text-gray-500 mt-2">
                   PRICE: {(game.costPerLife / 1000000000).toFixed(4)} SOL
                 </div>
              </>
            )}
            
            {/* Show Session Balance Warning if Low */}
            {balance < game.costPerLife && !isSessionLoading && (
               <p className="text-red-400 text-xs animate-pulse">
                 INSUFFICIENT FUNDS. PLEASE DEPOSIT IN TOP BAR.
               </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
