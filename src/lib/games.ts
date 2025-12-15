import React from 'react';
import FloppySolana from '@/components/games/FloppySolana';
import ClickerChallenge from '@/components/games/ClickerChallenge';
import SpaceInvaders from '@/components/games/SpaceInvaders';

export interface GameConfig {
  id: string;
  title: string;
  description: string;
  developerAddress: string;
  costPerLife: number; // in Lamports
  component: React.FC<{ onGameOver: (score: number) => void }>;
  thumbnail: string;
  accentColor: string;
}

export const games: GameConfig[] = [
  {
    id: 'floppy-solana',
    title: 'Floppy Solana',
    description: 'Tap to fly. Avoid the pipes. The classic frustration, now on-chain.',
    developerAddress: 'So11111111111111111111111111111111111111112', // Wrapped SOL as placeholder dev
    costPerLife: 100000, // 0.0001 SOL
    component: FloppySolana,
    thumbnail: '/thumbnails/floppy.png',
    accentColor: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'clicker-challenge',
    title: 'Clicker Challenge',
    description: 'How fast can you click in 10 seconds? Break your mouse, earn high scores.',
    developerAddress: 'So11111111111111111111111111111111111111112',
    costPerLife: 50000, // 0.00005 SOL
    component: ClickerChallenge,
    thumbnail: '/thumbnails/clicker.png',
    accentColor: 'from-green-400 to-emerald-600'
  },
  {
    id: 'space-invaders',
    title: 'Solana Invaders',
    description: 'Defend the network from FUD aliens. Classic arcade shooter action.',
    developerAddress: 'So11111111111111111111111111111111111111112',
    costPerLife: 150000, // 0.00015 SOL
    component: SpaceInvaders,
    thumbnail: '/thumbnails/invaders.png',
    accentColor: 'from-purple-500 to-indigo-600'
  }
];

export function getGameById(id: string): GameConfig | undefined {
  return games.find(g => g.id === id);
}
