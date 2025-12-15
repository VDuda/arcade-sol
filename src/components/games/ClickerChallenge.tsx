"use client";

import React, { useState, useEffect, useRef } from "react";
import { MousePointer2, Timer, Trophy } from "lucide-react";

interface GameProps {
  onGameOver: (score: number) => void;
}

const GAME_DURATION = 10;

const ClickerChallenge: React.FC<GameProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      onGameOver(score);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onGameOver, score]);

  const handleClick = () => {
    if (isFinished) return;
    
    if (!isActive && timeLeft === GAME_DURATION) {
      setIsActive(true);
    }
    
    setScore(s => s + 1);

    // Visual feedback
    if (buttonRef.current) {
      buttonRef.current.style.transform = "scale(0.95)";
      setTimeout(() => {
        if (buttonRef.current) buttonRef.current.style.transform = "scale(1)";
      }, 50);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white relative select-none">
      <div className="absolute top-4 left-4 flex items-center gap-2 text-xl font-mono">
        <Timer className="text-yellow-400" />
        <span className={timeLeft < 3 ? "text-red-500 animate-pulse" : "text-white"}>
          {timeLeft}s
        </span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2 text-xl font-mono">
        <Trophy className="text-yellow-400" />
        <span>{score}</span>
      </div>

      {!isActive && !isFinished && (
        <div className="absolute top-20 text-center animate-bounce text-gray-400">
          Click the button to start!
        </div>
      )}

      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`
          w-64 h-64 rounded-full flex flex-col items-center justify-center gap-4
          transition-all duration-75 shadow-lg
          ${isFinished 
            ? "bg-gray-700 cursor-not-allowed opacity-50" 
            : "bg-gradient-to-br from-green-400 to-emerald-600 hover:from-green-300 hover:to-emerald-500 active:shadow-inner cursor-pointer"
          }
        `}
      >
        <MousePointer2 size={64} className="text-white drop-shadow-md" />
        <span className="text-4xl font-black drop-shadow-md">CLICK!</span>
      </button>
      
      {isFinished && (
         <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-2">TIME'S UP!</h2>
              <p className="text-2xl text-yellow-400 font-mono mb-4">Final Score: {score}</p>
              <p className="text-gray-400 text-sm">Game Over triggered...</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default ClickerChallenge;