"use client";

import React from "react";

interface GameProps {
  onGameOver: (score: number) => void;
}

const ClickerChallenge: React.FC<GameProps> = ({ onGameOver }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
      <h2 className="text-2xl">Clicker Challenge (Coming Soon)</h2>
      <button 
        onClick={() => onGameOver(100)}
        className="mt-4 px-4 py-2 bg-green-500 text-black font-bold rounded"
      >
        Simulate Game Over
      </button>
    </div>
  );
};

export default ClickerChallenge;
