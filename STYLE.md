# Arcade.sol Design System & Style Guide

## 🎨 Aesthetic Theme: "Cyberpunk Arcade"
We aim to recreate the visceral feeling of a dimly lit 1980s arcade cabinet, fused with modern Web3 cyberpunk aesthetics.

### Core Visual Elements
*   **CRT Scanlines:** Subtle horizontal lines and flickering to mimic old screens.
*   **Neon Glows:** High contrast, saturated colors (Pink, Cyan, Yellow) against deep blacks.
*   **Glitch Effects:** Occasional digital artifacts on text or transitions.
*   **Retro Typography:** Monospaced fonts for data, Pixel fonts for headings.

## 🌈 Color Palette
| Color Name | Hex | Usage |
| :--- | :--- | :--- |
| **Void Black** | `#020617` | Main Background |
| **Neon Pink** | `#db2777` | Primary Accents, Gradients |
| **Cyber Cyan** | `#06b6d4` | Secondary Accents, Borders |
| **Arcade Yellow** | `#facc15` | Action Buttons ("Insert Coin"), High Scores |
| **Terminal Green**| `#4ade80` | Success states, Positive Numbers (USDC) |
| **System Red** | `#ef4444` | Errors, "Game Over", "Quit" |

## typography
*   **Headings:** `Press Start 2P` (Google Fonts) or similar pixelated font.
*   **Body/UI:** `Inter` or `Roboto Mono` for readability.

## 🎞️ Motion & Animation (Framer Motion)
*   **Page Transitions:**
    *   **"Zoom into Cabinet":** When selecting a game, the viewport should scale up and fade into the screen.
*   **Hover States:**
    *   Cards should scale up (`scale: 1.05`) and glow brighter.
    *   Buttons should press down (`scale: 0.95`).
*   **Loading:**
    *   Blinking cursors (`_`)
    *   Progress bars filling up pixel by pixel.

## 🧩 Component Styles

### Game Card
*   **Normal:** Dark overlay, dim neon border.
*   **Hover:** Video/Gif preview plays, border glows intensely, "Insert Coin" prompt appears.

### Buttons
*   **Primary (Insert Coin):** Blinking yellow border, bold text.
*   **Secondary:** Ghost buttons with neon borders.

### Navbar
*   **Glassmorphism:** `backdrop-blur-md` with a subtle white/10 border.
*   **Session Display:** Monospaced, looks like a digital counter.
