# Arcade.sol - Master Task List

This document outlines the roadmap for transforming Arcade.sol from a Hackathon MVP into a scalable, production-ready decentralized gaming platform.

## Phase 1: Robustness & Security (Immediate Priority)
- [x] **Environment Configuration:**
    - [x] Create `.env.local` and `.env.production` for managing RPC URLs and wallet secrets.
    - [x] Replace hardcoded Devnet URLs with environment variables.
- [x] **Error Handling:**
    - [x] Create a global UI Toast/Notification system (replace `alert()`).
    - [ ] Implement retry logic for failed Solana transactions (e.g., due to congestion).
    - [ ] Handle "Wallet Disconnected" events gracefully during gameplay.
- [x] **Session Security:**
    - [ ] Encrypt the Session Key in `localStorage` (optional but good for hygiene).
    - [x] Add a "Withdraw" button to let users claim leftover SOL from their session wallet back to their main wallet.

## Phase 2: The Creator Economy (Smart Contracts)
- [ ] **On-Chain Registry (Solana Program):**
    - [x] Develop a simple Anchor program to register games on-chain.
        - [x] Struct: `Game { authority, fee_lamports, active }`.
        - [x] Program scaffold created (`Anchor.toml`, `programs/game-registry/Cargo.toml`, `programs/game-registry/src/lib.rs`).
    - [ ] Replace `lib/games.ts` with on-chain data fetching.
- [ ] **Automated Revenue Split:**
    - [ ] Update the API/Contract to perform the split (90/10) atomically in one transaction.
    - [ ] Create a "Developer Dashboard" to view earnings and game play stats.
- [ ] **Game Submission Flow:**
    - [ ] Connect the `/submit` form to the backend/smart contract.
    - [ ] Implement IPFS/Arweave storage for game assets (images, game bundles).

## Phase 3: Engagement & Social Features
- [ ] **Leaderboards:**
    - [ ] Create a database (Postgres/Supabase) to store high scores signed by the session wallet.
    - [ ] Display Global and Weekly leaderboards on the Game Page.
- [ ] **User Profiles:**
    - [ ] Allow users to set a nickname (linked to their Wallet Address).
    - [ ] Show "Last Played" and "Favorite Games".
- [ ] **NFT Achievements:**
    - [ ] Mint a "High Score" NFT when a user beats a threshold.
    - [ ] Use Metaplex Core for low-cost NFT minting.

## Phase 4: UI/UX & Polish ("Juice")
- [x] **Sound Design:**
    - [x] Add retro UI sound effects (hover, click, coin insert, game over).
    - [x] Add a background synth-wave loop (mute-able).
- [x] **Visuals:**
    - [x] Implement a CRT/Glitch shader effect on the Game Canvas.
    - [ ] Add framer-motion page transitions between Lobby and Game.
- [ ] **Responsive Mobile Design:**
    - [ ] Ensure the Canvas games handle touch events correctly.
    - [ ] Optimize the layout for portrait mode.

## Phase 5: New Games & SDK
- [ ] **Arcade SDK (`@arcade-sol/react`):**
    - [ ] Abstract the `useArcadeSession` and `fetchWith402` into a clean npm package.
    - [ ] Allow any React developer to wrap their game with `<ArcadeGame gateCost={0.01} />`.
- [x] **Game 3: "Space Invaders" Clone:**
    - [x] A shooter game to test more complex inputs.
- [ ] **Game 4: "Multiplayer Pong" (Advanced):**
    - [ ] Use a state channel or simple WebSocket server to sync two players who both paid the entry fee.

## Phase 6: Production Ops
- [ ] **Analytics:**
    - [ ] Integreate privacy-focused analytics (e.g., Plausible) to track game starts.
- [ ] **Performance:**
    - [ ] Optimize Next.js Image caching.
    - [ ] CDN setup for game assets.
- [ ] **Mainnet Launch:**
    - [ ] Audit the code.
    - [ ] Switch RPC endpoints.
    - [ ] Deploy marketing site.

---
*Last Updated: Dec 14, 2025*