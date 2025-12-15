# DEMO SCRIPT: Arcade.sol - The Web3 "Quarter Slot"

## Video Duration: 3-4 Minutes

---

### **Scene 1: The Hook (0:00 - 0:20)**

**(Visuals: High-energy montage. A player dying in a game, hitting 'Retry', and a wallet popup appearing, ruining the moment. Sound of a record scratch. Then, cut to the Arcade.sol logo with retro synthwave music.)**

**Narrator:** "Web3 gaming has a friction problem. You want to play? Sign a transaction. Die and want to retry? Sign another transaction. It kills the flow. Today, we're fixing that. Welcome to **Arcade.sol**."

---

### **Scene 2: The Solution - "Insert Coin" (0:20 - 0:50)**

**(Visuals: smooth transition to the Arcade.sol dashboard. A cursor hovers over the "Deposit" button. An animation shows a stack of digital coins moving from a wallet to a "Session" box.)**

**Narrator:** "We're bringing back the 'Quarter Slot' model, but for the blockchain. We use **Session Keys** and the **HTTP 402** standard to create a frictionless experience. You authorize a single, small deposit—like putting a stack of quarters on the cabinet glass. From then on, the game handles the rest."

---

### **Scene 3: Live Demo - Setup (0:50 - 1:30)**

**(Visuals: Screen recording. User connects Phantom wallet. Clicks "Insert Coin" (Deposit 0.1 SOL). A single wallet approval popup appears and is confirmed.)**

**Narrator:** "Let's see it live. I connect my wallet and 'Insert Coin' to fund my session. This creates a local, ephemeral keypair—my Session Wallet. I sign *one* transaction to fund it. That's it. No more pop-ups."

---

### **Scene 4: Live Demo - The "Flow State" (1:30 - 2:30)**

**(Visuals: User plays 'Floppy Solana'. They hit a pipe. 'Game Over' screen appears with a 'Retry (0.0001 SOL)' button. User clicks it. The game restarts *instantly*. No wallet popup. Repeat this 2-3 times rapidly to prove the point.)**

**Narrator:** "Now I'm playing 'Floppy Solana'. Watch what happens when I crash. I hit retry. Boom. Instant restart. Behind the scenes, my session wallet just signed a micro-transaction, paid the developer, and authorized the new game session—all in the time it took to blink. This is the speed of Solana combined with the seamlessness of x402."

---

### **Scene 5: Under the Hood - x402 Architecture (2:30 - 3:15)**

**(Visuals: Split screen. On the left, gameplay. On the right, a simplified terminal or network tab showing the HTTP requests.)**

**Narrator:** "Here's what makes this technical. When I hit retry, the browser requests the `/api/start-game` endpoint. The server responds with `402 Payment Required`. My client automatically signs the payment with the Session Key and sends the proof back. The server verifies it on-chain and returns the game token. It's standard HTTP, powered by crypto."

**(Visuals: Diagram showing the 90/10 revenue split.)**

**Narrator:** "And for developers? It's a direct revenue stream. 90% of every quarter dropped goes straight to the game creator's wallet."

---

### **Scene 6: Conclusion (3:15 - 3:45)**

**(Visuals: The Arcade.sol "Game Select" screen. The camera zooms out to show the "Supported by Solana Foundation" badge.)**

**Narrator:** "Arcade.sol isn't just a game platform; it's a blueprint for consumer apps on Solana. We're proving that crypto payments can be invisible, fast, and fun. No subscriptions. No ads. Just pure gameplay."

**(Visuals: Text on screen: "Try the Demo: [Link]" | "Github: [Link]".)**

**Narrator:** "This is Arcade.sol. Insert coin to play."

---

## **Hackathon Focus:**

*   **Consumer App Track:** Focus on the seamless UX and "invisible" crypto elements (Session Keys).
*   **x402 Track:** Highlight the specific use of the HTTP 402 status code and the request/retry flow in Scene 5.

---

*Made with ❤️ and ⚡ by the Arcade.sol Team*