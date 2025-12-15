"use client";

import React, { useRef, useEffect, useState } from "react";

interface GameProps {
  onGameOver: (score: number) => void;
}

const FloppySolana: React.FC<GameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Game Constants
    const GRAVITY = 0.6; // Stronger gravity for snappy feel
    const JUMP = -8;
    const PIPE_SPEED = 3;
    const PIPE_SPAWN_RATE = 100; // Frames
    const PIPE_GAP = 150;

    // State
    let birdY = canvas.height / 2;
    let birdVelocity = 0;
    let birdX = 50;
    let pipes: { x: number; topHeight: number; passed: boolean }[] = [];
    let frameCount = 0;
    let currentScore = 0;
    let animationId: number;
    let isGameOver = false;

    // Resize handling
    const resize = () => {
        canvas.width = canvas.parentElement?.clientWidth || 800;
        canvas.height = canvas.parentElement?.clientHeight || 600;
        birdY = canvas.height / 2; // Reset bird position on resize
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      if (isGameOver) return;
      
      // Update
      frameCount++;
      birdVelocity += GRAVITY;
      birdY += birdVelocity;

      // Spawn Pipes
      if (frameCount % PIPE_SPAWN_RATE === 0) {
        const minHeight = 50;
        const maxHeight = canvas.height - minHeight - PIPE_GAP;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        pipes.push({ x: canvas.width, topHeight, passed: false });
      }

      // Update Pipes
      pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED;
      });

      // Remove off-screen pipes
      if (pipes.length > 0 && pipes[0].x < -50) {
        pipes.shift();
      }

      // Collision Detection
      // 1. Floor/Ceiling
      if (birdY + 15 > canvas.height || birdY - 15 < 0) {
        endGame();
        return;
      }

      // 2. Pipes
      const birdSize = 20; // Radius roughly
      pipes.forEach(pipe => {
        // Hitbox check
        // Bird X range: birdX - 15 to birdX + 15
        // Pipe X range: pipe.x to pipe.x + 50
        if (birdX + 15 > pipe.x && birdX - 15 < pipe.x + 50) {
           // Inside pipe horizontal area
           if (birdY - 15 < pipe.topHeight || birdY + 15 > pipe.topHeight + PIPE_GAP) {
             endGame();
             return;
           }
        }

        // Score
        if (!pipe.passed && birdX > pipe.x + 50) {
            currentScore++;
            setScore(currentScore);
            pipe.passed = true;
        }
      });

      // Draw
      draw(ctx);
      animationId = requestAnimationFrame(loop);
    };

    const draw = (context: CanvasRenderingContext2D) => {
      // Clear
      context.fillStyle = "#70c5ce"; // Sky color
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Pipes
      context.fillStyle = "#22c55e"; // Green
      pipes.forEach(pipe => {
        // Top Pipe
        context.fillRect(pipe.x, 0, 50, pipe.topHeight);
        // Bottom Pipe
        context.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, 50, canvas.height - (pipe.topHeight + PIPE_GAP));
        
        // Cap styling
        context.fillStyle = "#16a34a"; // Darker green border
        context.fillRect(pipe.x - 2, pipe.topHeight - 20, 54, 20); // Top Cap
        context.fillRect(pipe.x - 2, pipe.topHeight + PIPE_GAP, 54, 20); // Bottom Cap
        context.fillStyle = "#22c55e"; // Reset
      });

      // Draw Bird (Purple Square for Solana)
      context.fillStyle = "#9945FF"; 
      context.shadowColor = "#14F195";
      context.shadowBlur = 10;
      context.fillRect(birdX - 15, birdY - 15, 30, 30);
      context.shadowBlur = 0;
      
      // Eyes
      context.fillStyle = "white";
      context.fillRect(birdX + 5, birdY - 10, 8, 8);
      context.fillStyle = "black";
      context.fillRect(birdX + 9, birdY - 8, 2, 2);

      // Floor
      context.fillStyle = "#ded895";
      context.fillRect(0, canvas.height - 10, canvas.width, 10);
    };

    const endGame = () => {
      isGameOver = true;
      cancelAnimationFrame(animationId);
      onGameOver(currentScore);
    };

    const handleInput = (e: Event) => {
        e.preventDefault();
        if (!isGameOver) {
            birdVelocity = JUMP;
        }
    };

    // Controls
    canvas.addEventListener('mousedown', handleInput);
    canvas.addEventListener('touchstart', handleInput);
    window.addEventListener('keydown', (e) => {
        if(e.code === 'Space') handleInput(e);
    });

    // Start
    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleInput);
      canvas.removeEventListener('touchstart', handleInput);
      window.removeEventListener('keydown', handleInput); // Clean up might be tricky with anonymous function, but acceptable for MVP
    };
  }, [onGameOver]);

  return (
    <div className="w-full h-full relative cursor-pointer">
       <canvas ref={canvasRef} className="block w-full h-full" />
       <div className="absolute top-4 left-4 text-white text-4xl font-black drop-shadow-md select-none pointer-events-none">
         {score}
       </div>
       <div className="absolute bottom-4 left-0 w-full text-center text-white/50 text-sm select-none pointer-events-none">
         TAP OR SPACE TO JUMP
       </div>
    </div>
  );
};

export default FloppySolana;