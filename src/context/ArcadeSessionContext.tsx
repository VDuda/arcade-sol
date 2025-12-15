"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Keypair, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, Connection, clusterApiUrl } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { 
  getAssociatedTokenAddress, 
  getAccount, 
  createTransferInstruction, 
  createAssociatedTokenAccountInstruction, 
  TOKEN_PROGRAM_ID 
} from "@solana/spl-token";
import bs58 from "bs58";

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("devnet");
const USDC_MINT = process.env.NEXT_PUBLIC_USDC_MINT;

interface ArcadeSessionContextType {
  sessionKey: PublicKey | null;
  sessionKeypair: Keypair | null;
  balance: number;
  balanceUSDC: number;
  isLoading: boolean;
  deposit: (amountSOL: number, amountUSDC: number) => Promise<string>;
  withdraw: () => Promise<string>;
  refreshBalance: () => Promise<void>;
  resetSession: () => void;
}

const ArcadeSessionContext = createContext<ArcadeSessionContextType>({
  sessionKey: null,
  sessionKeypair: null,
  balance: 0,
  balanceUSDC: 0,
  isLoading: true,
  deposit: async () => "",
  withdraw: async () => "",
  refreshBalance: async () => {},
  resetSession: () => {},
});

export const useArcadeSession = () => useContext(ArcadeSessionContext);

export const ArcadeSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Using a dedicated connection for more control over RPC endpoint
  const connection = useMemo(() => new Connection(RPC_URL, "confirmed"), []);
  const { publicKey, sendTransaction } = useWallet();
  const [sessionKeypair, setSessionKeypair] = useState<Keypair | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [balanceUSDC, setBalanceUSDC] = useState<number>(0);
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
    setBalanceUSDC(0);
  }, []);

  // Check Balance
  const refreshBalance = useCallback(async () => {
    if (!sessionKeypair || !connection) return;
    try {
      // 1. SOL Balance
      const bal = await connection.getBalance(sessionKeypair.publicKey);
      setBalance(bal);

      // 2. USDC Balance
      if (USDC_MINT) {
        try {
          const mint = new PublicKey(USDC_MINT);
          const ata = await getAssociatedTokenAddress(mint, sessionKeypair.publicKey);
          const account = await getAccount(connection, ata);
          setBalanceUSDC(Number(account.amount));
        } catch (e) {
          // Token account likely doesn't exist or has 0 balance
          setBalanceUSDC(0);
        }
      }
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
  const deposit = useCallback(async (amountSOL: number, amountUSDC: number) => {
    if (!publicKey || !sessionKeypair) {
      throw new Error("Wallet not connected or session not initialized");
    }

    // Pre-flight Balance Checks
    const userSolBalance = await connection.getBalance(publicKey);
    const requiredSol = (amountSOL * LAMPORTS_PER_SOL) + 5000000; // Amount + 0.005 SOL Buffer for fees
    
    if (userSolBalance < requiredSol) {
      throw new Error(`Insufficient SOL. Need ${(requiredSol / LAMPORTS_PER_SOL).toFixed(4)} SOL.`);
    }

    if (amountUSDC > 0 && USDC_MINT) {
      try {
        const mint = new PublicKey(USDC_MINT);
        const sourceATA = await getAssociatedTokenAddress(mint, publicKey);
        const account = await getAccount(connection, sourceATA);
        const userUsdcBalance = Number(account.amount);
        const requiredUsdc = BigInt(Math.floor(amountUSDC * 1_000_000));
        
        if (userUsdcBalance < Number(requiredUsdc)) {
           throw new Error(`Insufficient USDC. Need ${amountUSDC.toFixed(2)} USDC.`);
        }
      } catch (e) {
        throw new Error("Failed to check USDC balance. Ensure you have USDC.");
      }
    }

    try {
      const transaction = new Transaction();
      transaction.feePayer = publicKey;
      
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // 1. SOL Transfer
      if (amountSOL > 0) {
        const lamports = amountSOL * LAMPORTS_PER_SOL;
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: sessionKeypair.publicKey,
            lamports,
          })
        );
      }

      // 2. USDC Transfer
      if (amountUSDC > 0) {
        if (!USDC_MINT) throw new Error("USDC Mint not configured");
        const mint = new PublicKey(USDC_MINT);
        const sourceATA = await getAssociatedTokenAddress(mint, publicKey);
        const destATA = await getAssociatedTokenAddress(mint, sessionKeypair.publicKey);

        // Check if Session ATA exists. If not, create it.
        const destAccountInfo = await connection.getAccountInfo(destATA);
        if (!destAccountInfo) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              publicKey, // Payer
              destATA,
              sessionKeypair.publicKey, // Owner
              mint
            )
          );
        }

        // Transfer (USDC has 6 decimals)
        const atomicAmount = BigInt(Math.floor(amountUSDC * 1_000_000));
        transaction.add(
          createTransferInstruction(sourceATA, destATA, publicKey, atomicAmount)
        );
      }

      if (transaction.instructions.length === 0) {
        throw new Error("No deposit amount specified.");
      }

      const signature = await sendTransaction(transaction, connection);
      
      // Confirm transaction
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, "confirmed");

      if (confirmation.value.err) {
        throw new Error("Transaction confirmed but failed: " + confirmation.value.err.toString());
      }

      await refreshBalance();
      return signature;

    } catch (e: any) {
      console.error("Deposit Error:", e);
      if (e.name === "WalletSendTransactionError" || e.message?.includes("User rejected")) {
        throw new Error("Transaction cancelled by user.");
      }
      throw new Error(e.message || "Deposit failed");
    }
  }, [publicKey, sessionKeypair, connection, sendTransaction, refreshBalance]);

  // Withdraw Function
  const withdraw = useCallback(async () => {
    if (!publicKey || !sessionKeypair) {
      throw new Error("Wallet not connected or session not initialized");
    }
    
    const transaction = new Transaction();
    let hasWork = false;

    // 1. Withdraw USDC if exists
    if (USDC_MINT) {
      try {
        const mint = new PublicKey(USDC_MINT);
        const sourceATA = await getAssociatedTokenAddress(mint, sessionKeypair.publicKey);
        const destATA = await getAssociatedTokenAddress(mint, publicKey);
        
        // Check if we have USDC
        const account = await getAccount(connection, sourceATA);
        const balance = Number(account.amount);
        
        if (balance > 0) {
           // Ensure user has ATA (likely does, but good to check or just try transfer)
           // We'll assume user has ATA or we'd need to create it (paying with Session SOL?) 
           // Simplest: just transfer. If fail, fail.
           transaction.add(
             createTransferInstruction(sourceATA, destATA, sessionKeypair.publicKey, balance)
           );
           hasWork = true;
        }
      } catch (e) {
        // No USDC or error
      }
    }

    // 2. Withdraw SOL
    // Refresh balance to get exact amount
    const currentBalance = await connection.getBalance(sessionKeypair.publicKey);
    const FEE_BUFFER = 5000; // Buffer for one sig
    
    if (currentBalance > FEE_BUFFER) {
      const withdrawAmount = currentBalance - FEE_BUFFER;
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: sessionKeypair.publicKey,
          toPubkey: publicKey,
          lamports: withdrawAmount,
        })
      );
      hasWork = true;
    }

    if (!hasWork) {
      throw new Error("Nothing to withdraw (or balance too low for gas).");
    }

    // Sign with the session keypair
    const signature = await connection.sendTransaction(transaction, [sessionKeypair]);
    await connection.confirmTransaction(signature, "confirmed");
    await refreshBalance();
    
    return signature;
  }, [publicKey, sessionKeypair, connection, refreshBalance]);

  return (
    <ArcadeSessionContext.Provider
      value={{
        sessionKey: sessionKeypair?.publicKey || null,
        sessionKeypair,
        balance,
        balanceUSDC,
        isLoading,
        deposit,
        withdraw,
        refreshBalance,
        resetSession
      }}
    >
      {children}
    </ArcadeSessionContext.Provider>
  );
};
