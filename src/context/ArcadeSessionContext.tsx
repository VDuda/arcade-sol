"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Keypair, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

interface ArcadeSessionContextType {
  sessionKey: PublicKey | null;
  sessionKeypair: Keypair | null;
  balance: number;
  isLoading: boolean;
  deposit: (amountSOL: number) => Promise<string>;
  refreshBalance: () => Promise<void>;
  resetSession: () => void;
}

const ArcadeSessionContext = createContext<ArcadeSessionContextType>({
  sessionKey: null,
  sessionKeypair: null,
  balance: 0,
  isLoading: true,
  deposit: async () => "",
  refreshBalance: async () => {},
  resetSession: () => {},
});

export const useArcadeSession = () => useContext(ArcadeSessionContext);

export const ArcadeSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [sessionKeypair, setSessionKeypair] = useState<Keypair | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Session Key
  useEffect(() => {
    const storedKey = localStorage.getItem("arcade_session_key");
    if (storedKey) {
      try {
        const secretKey = bs58.decode(storedKey);
        const keypair = Keypair.fromSecretKey(secretKey);
        setSessionKeypair(keypair);
      } catch (e) {
        console.error("Failed to load session key", e);
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  const createNewSession = () => {
    const keypair = Keypair.generate();
    localStorage.setItem("arcade_session_key", bs58.encode(keypair.secretKey));
    setSessionKeypair(keypair);
  };

  const resetSession = useCallback(() => {
    localStorage.removeItem("arcade_session_key");
    createNewSession();
    setBalance(0);
  }, []);

  // Check Balance
  const refreshBalance = useCallback(async () => {
    if (!sessionKeypair || !connection) return;
    try {
      const bal = await connection.getBalance(sessionKeypair.publicKey);
      setBalance(bal);
    } catch (e) {
      console.error("Failed to fetch balance", e);
    }
  }, [sessionKeypair, connection]);

  // Poll balance every 5 seconds or when keypair changes
  useEffect(() => {
    if (sessionKeypair) {
      refreshBalance();
      const interval = setInterval(refreshBalance, 5000);
      setIsLoading(false);
      return () => clearInterval(interval);
    }
  }, [sessionKeypair, refreshBalance]);

  // Deposit Function
  const deposit = useCallback(async (amountSOL: number) => {
    if (!publicKey || !sessionKeypair) {
      throw new Error("Wallet not connected or session not initialized");
    }

    const lamports = amountSOL * LAMPORTS_PER_SOL;
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: sessionKeypair.publicKey,
        lamports,
      })
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "confirmed");
    await refreshBalance();
    return signature;
  }, [publicKey, sessionKeypair, connection, sendTransaction, refreshBalance]);

  return (
    <ArcadeSessionContext.Provider
      value={{
        sessionKey: sessionKeypair?.publicKey || null,
        sessionKeypair,
        balance,
        isLoading,
        deposit,
        refreshBalance,
        resetSession
      }}
    >
      {children}
    </ArcadeSessionContext.Provider>
  );
};
