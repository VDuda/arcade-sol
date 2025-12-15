import React from "react";
import Link from "next/link";
import { games } from "@/lib/games";
import { Gamepad2, Play, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <header className="text-center py-10 space-y-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 animate-pulse">
          INSERT COIN
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          The Web3 Arcade. Pay-per-life. No ads. No subscriptions. 
          <br/>Just pure gaming on Solana.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link 
            key={game.id} 
            href={`/play/${game.id}`}
            className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${game.accentColor} transition-opacity`} />
            
            <div className="aspect-video bg-black/40 flex items-center justify-center relative overflow-hidden">
               {/* Placeholder for thumbnail */}
               <Gamepad2 size={64} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs font-mono text-yellow-400 border border-yellow-500/30">
                 {(game.costPerLife / 1000000000).toFixed(5)} SOL / PLAY
               </div>
            </div>

            <div className="p-6 space-y-3">
              <h3 className="text-2xl font-bold font-mono group-hover:text-purple-400 transition-colors">
                {game.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2">
                {game.description}
              </p>
              
              <div className="pt-4 flex items-center justify-between text-xs text-gray-500 font-mono">
                <span className="flex items-center gap-1">
                  <Users size={12} /> {Math.floor(Math.random() * 1000) + 100} PLAYING
                </span>
                <span className="flex items-center gap-1 text-green-400">
                  <Play size={12} /> PLAY NOW
                </span>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Submit Card */}
        <Link 
          href="/submit"
          className="group flex flex-col items-center justify-center p-6 bg-white/5 border border-dashed border-white/20 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all text-center gap-4 min-h-[300px]"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <PlusCircleIcon />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-300">Submit Your Game</h3>
            <p className="text-sm text-gray-500 mt-2">Earn 90% rev-share.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function PlusCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
      <path d="M5 12h14"/>
      <path d="M12 5v14"/>
    </svg>
  )
}