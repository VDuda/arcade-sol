import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, clusterApiUrl } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferInstruction, getAccount, createAssociatedTokenAccountInstruction } from "@solana/spl-token";

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("devnet");

interface PaymentInfo {
  recipient: string;
  amount: number;
  token: string;
}

export async function fetchWith402(
  url: string,
  body: any,
  connection: Connection,
  sessionKeypair: Keypair
): Promise<any> {
  // 1. Initial Request
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // 2. Handle 402
  if (response.status === 402) {
    const data = await response.json();
    const { recipient, amount, token } = data.paymentInfo as PaymentInfo;

    console.log(`[x402] Payment Required: ${amount} ${token} to ${recipient}`);

    const balanceConnection = new Connection(RPC_URL, "confirmed");
    const transaction = new Transaction();

    // 3. Construct Payment
    if (!token || token === "SOL") {
      // --- Native SOL Transfer ---
      const balance = await balanceConnection.getBalance(sessionKeypair.publicKey);
      if (balance < amount) {
        throw new Error("INSUFFICIENT_FUNDS");
      }

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: sessionKeypair.publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: amount,
        })
      );
    } else {
      // --- SPL Token Transfer (e.g. USDC) ---
      const mint = new PublicKey(token);
      const recipientPubkey = new PublicKey(recipient);

      // Get ATAs
      const sourceATA = await getAssociatedTokenAddress(mint, sessionKeypair.publicKey);
      const destATA = await getAssociatedTokenAddress(mint, recipientPubkey);

      // Check Balance
      try {
        const account = await getAccount(balanceConnection, sourceATA);
        if (Number(account.amount) < amount) {
           const tokenName = token === '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU' ? 'USDC' : (token || 'USDC');
           throw new Error(`INSUFFICIENT_FUNDS: Not enough ${tokenName} in session wallet.`);
        }
      } catch (e: any) {
        // Account likely doesn't exist
        const tokenName = token === '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU' ? 'USDC' : (token || 'USDC');
        throw new Error(`INSUFFICIENT_FUNDS: Not enough ${tokenName} in session wallet (Account missing).`);
      }

      // Check if Destination ATA exists
      const destAccountInfo = await balanceConnection.getAccountInfo(destATA);
      if (!destAccountInfo) {
        console.log("[x402] Creating destination ATA for platform wallet...");
        transaction.add(
          createAssociatedTokenAccountInstruction(
            sessionKeypair.publicKey, // Payer (Session Wallet)
            destATA,
            recipientPubkey, // Owner (Platform Wallet)
            mint
          )
        );
      }

      transaction.add(
        createTransferInstruction(
          sourceATA, 
          destATA, 
          sessionKeypair.publicKey, 
          amount
        )
      );
    }

    // 4. Send & Confirm (using the session keypair to sign)
    try {
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [sessionKeypair],
        { commitment: "confirmed" }
      );

      console.log(`[x402] Payment Sent: ${signature}`);

      // 5. Retry Request with Proof
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, signature }),
      });
      
    } catch (e: any) {
      console.error("[x402] Payment Failed", e);
      throw e; // Rethrow original error
    }
  }

  if (!response.ok) {
    throw new Error("Request failed even after payment attempt.");
  }

  return response.json();
}
