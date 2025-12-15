"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSoundFx } from "@/hooks/useSoundFx";

interface GameProps {
  onGameOver: (score: number) => void;
}

const SpaceInvaders: React.FC<GameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const { playClick, playCrash, playCoin } = useSoundFx();

  // Custom shoot sound
  const playShoot = () => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Constants
    const PLAYER_WIDTH = 40;
    const PLAYER_HEIGHT = 20;
    const BULLET_SPEED = 7;
    const ENEMY_WIDTH = 30;
    const ENEMY_HEIGHT = 20;
    const ENEMY_ROWS = 4;
    const ENEMY_COLS = 8;
    const ENEMY_SPEED_START = 1;

    // State
    let playerX = canvas.width / 2 - PLAYER_WIDTH / 2;
    let bullets: { x: number; y: number }[] = [];
    let enemies: { x: number; y: number; alive: boolean }[] = [];
    let enemyDirection = 1; // 1 = right, -1 = left
    let enemySpeed = ENEMY_SPEED_START;
    let animationId: number;
    let isGameOver = false;
    let currentScore = 0;
    
    // Inputs
    const keys: { [key: string]: boolean } = {};

    // Initialize Enemies
    const initEnemies = () => {
      enemies = [];
      const startX = 50;
      const startY = 50;
      const gapX = 15;
      const gapY = 15;

      for (let row = 0; row < ENEMY_ROWS; row++) {
        for (let col = 0; col < ENEMY_COLS; col++) {
          enemies.push({
            x: startX + col * (ENEMY_WIDTH + gapX),
            y: startY + row * (ENEMY_HEIGHT + gapY),
            alive: true
          });
        }
      }
    };

    // Resize handling
    const resize = () => {
        canvas.width = canvas.parentElement?.clientWidth || 800;
        canvas.height = canvas.parentElement?.clientHeight || 600;
        playerX = canvas.width / 2 - PLAYER_WIDTH / 2;
        // Re-init enemies if empty (first load)
        if (enemies.length === 0) initEnemies();
    };
    resize();
    window.addEventListener('resize', resize);

    const update = () => {
      if (isGameOver) return;

      // Player Movement
      if (keys["ArrowLeft"] && playerX > 0) playerX -= 5;
      if (keys["ArrowRight"] && playerX < canvas.width - PLAYER_WIDTH) playerX += 5;

      // Update Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= BULLET_SPEED;
        if (bullets[i].y < 0) bullets.splice(i, 1);
      }

      // Update Enemies
      let touchEdge = false;
      let activeEnemies = 0;

      enemies.forEach(enemy => {
        if (!enemy.alive) return;
        activeEnemies++;
        enemy.x += enemySpeed * enemyDirection;
        
        if (enemy.x <= 0 || enemy.x + ENEMY_WIDTH >= canvas.width) {
          touchEdge = true;
        }

        // Collision: Enemy vs Player (Game Over)
        if (enemy.y + ENEMY_HEIGHT >= canvas.height - 50) {
            endGame();
        }
      });

      if (touchEdge) {
        enemyDirection *= -1;
        enemies.forEach(e => e.y += 20); // Move down
        enemySpeed += 0.2; // Speed up
      }

      if (activeEnemies === 0) {
        // Level cleared - respawn
        initEnemies();
        enemySpeed = ENEMY_SPEED_START + 0.5;
        playCoin(); // Sound for level clear
      }

      // Collision: Bullet vs Enemy
      bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy) => {
          if (!enemy.alive) return;
          if (
            bullet.x > enemy.x &&
            bullet.x < enemy.x + ENEMY_WIDTH &&
            bullet.y > enemy.y &&
            bullet.y < enemy.y + ENEMY_HEIGHT
          ) {
            enemy.alive = false;
            bullets.splice(bIndex, 1);
            currentScore += 100;
            setScore(currentScore);
            // Small pitch shift for hit?
          }
        });
      });
    };

    const draw = () => {
      // Clear
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield
      ctx.fillStyle = "white";
      if (Math.random() > 0.9) ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);

      // Player
      ctx.fillStyle = "#22c55e"; // Green ship
      ctx.beginPath();
      ctx.moveTo(playerX + PLAYER_WIDTH / 2, canvas.height - 30 - PLAYER_HEIGHT);
      ctx.lineTo(playerX + PLAYER_WIDTH, canvas.height - 30);
      ctx.lineTo(playerX, canvas.height - 30);
      ctx.fill();

      // Bullets
      ctx.fillStyle = "#ef4444"; // Red lasers
      bullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 10));

      // Enemies
      enemies.forEach(e => {
        if (!e.alive) return;
        ctx.fillStyle = "#a855f7"; // Purple Aliens
        ctx.fillRect(e.x, e.y, ENEMY_WIDTH, ENEMY_HEIGHT);
        // Eyes
        ctx.fillStyle = "black";
        ctx.fillRect(e.x + 5, e.y + 5, 5, 5);
        ctx.fillRect(e.x + 20, e.y + 5, 5, 5);
      });
    };

    const loop = () => {
      if (isGameOver) return;
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    };

    const endGame = () => {
      isGameOver = true;
      cancelAnimationFrame(animationId);
      playCrash();
      onGameOver(currentScore);
    };

    // Controls
    const handleKeyDown = (e: KeyboardEvent) => {
        keys[e.code] = true;
        if (e.code === "Space") {
            bullets.push({ x: playerX + PLAYER_WIDTH / 2, y: canvas.height - 30 - PLAYER_HEIGHT });
            playShoot();
        }
    };
    const handleKeyUp = (e: KeyboardEvent) => keys[e.code] = false;

    // Mobile/Touch Controls
    const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        const touchX = e.touches[0].clientX;
        const rect = canvas.getBoundingClientRect();
        const relativeX = touchX - rect.left;
        
        if (relativeX < canvas.width / 2) {
            keys["ArrowLeft"] = true;
        } else {
            keys["ArrowRight"] = true;
        }
        
        // Auto shoot on touch for now or double tap? Let's just add a fire button later or shoot on tap center.
        // Simple tap to shoot logic:
        bullets.push({ x: playerX + PLAYER_WIDTH / 2, y: canvas.height - 30 - PLAYER_HEIGHT });
        playShoot();
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
        keys["ArrowLeft"] = false;
        keys["ArrowRight"] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onGameOver, playCrash, playCoin]);

  return (
    <div className="w-full h-full relative">
       <canvas ref={canvasRef} className="block w-full h-full" />
       <div className="absolute top-4 left-4 text-white text-2xl font-mono select-none pointer-events-none">
         SCORE: {score}
       </div>
       <div className="absolute bottom-4 w-full text-center text-gray-500 text-xs select-none pointer-events-none">
         ARROWS TO MOVE • SPACE TO SHOOT
       </div>
    </div>
  );
};

export default SpaceInvaders;
