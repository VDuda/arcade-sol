import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";

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
    const { recipient, amount } = data.paymentInfo as PaymentInfo;

    console.log(`[x402] Payment Required: ${amount} Lamports to ${recipient}`);

    // 3. Construct Payment
    // Check balance first
    const balance = await connection.getBalance(sessionKeypair.publicKey);
    if (balance < amount) {
      throw new Error("INSUFFICIENT_FUNDS");
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sessionKeypair.publicKey,
        toPubkey: new PublicKey(recipient),
        lamports: amount,
      })
    );

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
      throw e; // Rethrow original error (likely simulation failed if we didn't catch balance earlier)
    }
  }

  if (!response.ok) {
    throw new Error("Request failed even after payment attempt.");
  }

  return response.json();
}
