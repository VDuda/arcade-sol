"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Terminal, Coins } from "lucide-react";
import { useSoundFx } from "@/hooks/useSoundFx";

export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const { playCoin, playClick } = useSoundFx();

  useEffect(() => {
    // Sequence logic
    const timeouts = [
      setTimeout(() => setStep(1), 500), // Show "Booting"
      setTimeout(() => setStep(2), 1500), // Show "System Ready"
      setTimeout(() => setStep(3), 2500), // Show "Enter" button
    ];
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const handleEnter = () => {
    playCoin();
    setStep(4); // Exit animation
    setTimeout(onComplete, 800); 
  };

  return (
    <AnimatePresence>
      {step < 5 && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black text-green-500 font-mono flex flex-col items-center justify-center p-8 select-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            scale: 30, 
            opacity: 0, 
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
        >
          {/* CRT Overlay (Local layer + Global layer from layout makes it double retro) */}
          <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
          
          <motion.div 
            className="max-w-md w-full space-y-6 relative z-20"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 text-xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_10px_rgba(219,39,119,0.8)] font-press-start text-center leading-relaxed"
            >
              ARCADE.SOL
            </motion.div>

            <div className="h-48 flex flex-col justify-start space-y-2 text-xs md:text-base text-cyan-400/80 bg-black/50 p-4 border border-cyan-900/50 rounded font-mono shadow-inner overflow-hidden break-words whitespace-pre-wrap">
              {step >= 1 && (
                <Typewriter text="> INITIALIZING MEMORY... OK" delay={0} />
              )}
              {step >= 1 && (
                <Typewriter text="> CONNECTING SOLANA DEVNET... OK" delay={0.6} />
              )}
              {step >= 2 && (
                <Typewriter text="> LOADING ASSETS... COMPLETED" delay={0} />
              )}
              {step >= 2 && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   transition={{ delay: 1 }}
                   className="text-yellow-400 mt-2 font-bold"
                 >
                   {' > READY. INSERT COIN.'}
                 </motion.div>
              )}
            </div>

            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-4 flex justify-center"
              >
                <button
                  onClick={handleEnter}
                  className="group relative px-10 py-4 bg-transparent border-4 border-yellow-400 text-yellow-400 font-bold font-press-start hover:bg-yellow-400 hover:text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_50px_rgba(250,204,21,0.8)] animate-pulse"
                >
                  <span className="flex items-center gap-3">
                    <Coins className="w-6 h-6" /> INSERT COIN
                  </span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Typewriter({ text, delay }: { text: string; delay: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let current = "";
    let index = 0;
    
    const startTimeout = setTimeout(() => {
        const interval = setInterval(() => {
        if (index < text.length) {
            current += text[index];
            setDisplayed(current);
            index++;
        } else {
            clearInterval(interval);
        }
        }, 20); // Faster typing
        return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return <div>{displayed}<span className="animate-pulse">_</span></div>;
}