"use client";

import React from "react";

interface GameProps {
  onGameOver: (score: number) => void;
}

const FloppySolana: React.FC<GameProps> = ({ onGameOver }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-sky-900 text-white">
      <h2 className="text-2xl">Floppy Solana (Coming Soon)</h2>
      <button 
        onClick={() => onGameOver(10)}
        className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold rounded"
      >
        Simulate Game Over
      </button>
    </div>
  );
};

export default FloppySolana;
