"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SubmitGame() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
        <CheckCircle size={64} className="text-green-400" />
        <h2 className="text-3xl font-bold">Submission Received!</h2>
        <p className="text-gray-400 max-w-md">
          Your game "Cyber Blaster" is now pending review. The smart contract registry will update shortly.
        </p>
        <Link href="/" className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors mt-4">
          Back to Arcade
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={20} /> Back to Arcade
      </Link>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Your Game</h1>
          <p className="text-gray-400">Join the Arcade.sol network. You keep 90% of all play fees.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Game Title</label>
            <input 
              type="text" 
              required
              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="e.g. Cyber Blaster 2077"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Cost Per Life (SOL)</label>
              <input 
                type="number" 
                step="0.0001"
                defaultValue="0.0001"
                required
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Payout Address (SOL)</label>
              <input 
                type="text" 
                required
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Your Wallet Address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Game Component URL / Bundle</label>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer">
              <Upload size={32} className="mb-2" />
              <span className="text-sm">Drag & drop game bundle or click to upload</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.01]"
          >
            Submit to Registry
          </button>
        </form>
      </div>
    </div>
  );
}
