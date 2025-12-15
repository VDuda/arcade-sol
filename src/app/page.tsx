"use client";

import React from "react";
import Link from "next/link";
import { games } from "@/lib/games";
import { Gamepad2, Play, Users, Plus } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100
    }
  }
};

export default function Home() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-8"
    >
      <header className="text-center py-10 space-y-4 px-4">
        <motion.h1 
          animate={{ opacity: [1, 0.7, 1], textShadow: ["0 0 10px #facc15", "0 0 20px #facc15", "0 0 10px #facc15"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter text-yellow-400 font-press-start break-words leading-tight drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
        >
          INSERT COIN
        </motion.h1>
        <p className="text-gray-400 text-xs md:text-lg max-w-2xl mx-auto font-mono px-4">
          The Web3 Arcade. Pay-per-life. No ads. No subscriptions. 
          <br className="hidden md:block" />Just pure gaming on Solana.
        </p>
      </header>

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 w-full max-w-7xl mx-auto"
      >
        {games.map((game) => (
          <motion.div key={game.id} variants={itemVariants} whileHover={{ scale: 1.05 }} className="w-full h-full">
            <Link 
              key={game.id} 
              href={`/play/${game.id}`}
              className="group flex flex-col h-full bg-slate-900 border-2 border-white/10 rounded-xl overflow-hidden hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 relative"
            >
              {/* Cabinet Bezel / Reflection */}
              <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] rounded-xl" />
              
              {/* Scanline overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

              <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-br ${game.accentColor} transition-opacity duration-500`} />
              
              {/* Screen Area */}
              <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden group-hover:bg-gray-900 transition-colors border-b-4 border-gray-800 shrink-0">
                 <div className="relative z-0 group-hover:scale-110 transition-transform duration-300">
                    <Gamepad2 size={64} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                 </div>
                 
                 <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/90 rounded text-[10px] font-mono text-yellow-400 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                   {(game.costPerLife / 1_000_000).toFixed(2)} USDC
                 </div>
              </div>

              {/* Control Panel Area */}
              <div className="p-6 space-y-3 relative z-20 bg-gray-900 flex-grow flex flex-col">
                <h3 className="text-base md:text-xl font-bold font-press-start text-gray-100 group-hover:text-cyan-400 transition-colors break-words leading-snug">
                  {game.title}
                </h3>
                <p className="text-gray-500 text-[10px] md:text-xs font-mono h-auto min-h-[3rem] break-words whitespace-normal line-clamp-3">
                  {game.description}
                </p>
                
                <div className="pt-4 mt-auto flex items-center justify-between text-[10px] md:text-xs text-gray-500 font-mono border-t border-white/5">
                  <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                    <Users size={12} /> {Math.floor(Math.random() * 1000) + 100}
                  </span>
                  <span className="flex items-center gap-1 text-green-400 font-bold group-hover:text-green-300">
                    <Play size={12} /> INSERT COIN
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        
        {/* Submit Card */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="w-full h-full">
          <Link 
            href="/submit"
            className="group flex flex-col items-center justify-center h-full p-6 bg-white/5 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all text-center gap-4 min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/10 group-hover:border-white/30">
              <Plus className="text-gray-400 group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-300 font-press-start">Dev Mode</h3>
              <p className="text-xs text-gray-500 mt-2 font-mono">Submit Game cartridge</p>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}