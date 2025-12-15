# Arcade.sol

**The Web3 "Quarter Slot" — Seamless Micro-transactions for Gaming.**

## Pitch
Arcade.sol reclaims the nostalgia of the physical arcade cabinet using Solana and the x402 standard. Instead of annoying subscription models or ad-spam, Arcade.sol uses a "Pay-Per-Life" model. Users "Insert Coin" (deposit SOL to a session wallet) once, enabling a seamless, pop-up-free gaming experience where every retry costs a micro-penny ($0.01).

## Features
*   **Session Wallet (The "Insert Coin" Mechanism):** Uses ephemeral session keys (burner wallets) stored in the browser. Users approve ONE deposit transaction, then play hundreds of games without wallet popups.
*   **x402 Payment Gateway:** Implements HTTP 402 (Payment Required). The backend gates gameplay behind a real-time Solana transaction verification.
*   **Creator Economy:** Developers can submit games. The platform automatically routes 90% of the "Coin Drop" to the developer's wallet and 10% to the platform.

## Architecture
1.  **Next.js 16 + Bun:** Ultra-fast runtime and modern React features.
2.  **Solana Web3.js:** For blockchain interaction.
3.  **Context API:** Manages the `ArcadeSession` (Session Keypair).
4.  **Canvas API:** For the games (Floppy Solana, etc.).

## How to Run

1.  **Install Dependencies:**
    ```bash
    bun install
    ```

2.  **Run Development Server:**
    ```bash
    bun dev
    ```

3.  **Open Browser:**
    Navigate to `http://localhost:3000`.

## Games Included (MVP)
1.  **Floppy Solana:** A Flappy Bird clone where you dodge pipes to save your SOL.
2.  **Clicker Challenge:** Test your CPS (Clicks Per Second) in a 10s blitz.

## The "x402" Flow
1.  Client requests `/api/start-game`.
2.  Server returns `402 Payment Required` with `{ amount, recipient }`.
3.  Client (Session Wallet) signs a transaction sending SOL to Recipient.
4.  Client retries request with `{ signature }`.
5.  Server verifies on-chain and returns `200 OK` + Game Access.

---
*Built for the Solana Radar Hackathon (Consumer App Track).*