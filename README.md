# 🌸 MemoryBloom: Gentle Mind & Pattern Care
> A thoughtful, accessible cognitive training application designed specifically for older adults and seniors experiencing short-term memory loss, mild cognitive impairment (MCI), or early dementia.

---

## 🌟 Overview & Clinical Design Philosophy

When individuals experience short-term memory loss, standard games and cognitive tests often cause stress, confusion, and anxiety due to aggressive countdown timers, confusing small buttons, and punishing "game over" sounds. 

**MemoryBloom** is designed from the ground up to be **dignified, calming, and empowering**:
- **Zero Pressure & Zero Penalties**: No harsh buzzers, red failure screens, or rushing clocks.
- **Elder-Friendly Pacing**: A gentle 3-phase flow:
  1. **Study Phase**: View the pattern at a comfortable pace with an *"I've Got It! Tap to Hide"* button so the senior is in full control.
  2. **Breathing Retention Pause**: A soothing breathing circle that asks them to gently hold the picture in mind for 2–5 seconds.
  3. **Recall & Recognition Phase**: Easy tapping to recreate or recognize the pattern.
- **Gentle Hints**: A 💡 *Gentle Hint* button is always available during recall to illuminate tiles or eliminate options without penalty.
- **Auditory & Speech Assistance**: Includes spoken voice guidance using the Web Speech API and warm, harmonic pentatonic chimes synthesized via the Web Audio API.
- **High-Contrast & Large Touch Targets**: 60px–84px touch targets, extra-large bold typography, and multiple themes (Gentle Sage, Warm Amber, High Contrast).

---

## 🎮 3 Exercise Modes & 10 Progressive Levels

### 1. 🏮 Glowing Tiles (Spatial Grid Memory)
- **Concept**: Tiles illuminate with warm golden lanterns on a grid. After a quiet pause, the user taps the tiles that were glowing.
- **Progression**:
  - **Level 1–2**: 2x2 Grid with 2 to 3 glowing lanterns (gentle warm-up)
  - **Level 3–5**: 3x3 Grid with 3 to 5 glowing lanterns
  - **Level 6–10**: 4x4 Grid with 4 to 8 glowing lanterns

### 2. 🍎 Familiar Friends (Sequence Recall)
- **Concept**: A sequence of comforting, everyday items with emotional resonance (🍎 Apple, 🌻 Sunflower, ☕ Warm Tea, 🐱 Friendly Cat, 🏠 Cozy Home, ⛵ Calm Boat, 🔔 Golden Bell, 🌿 Green Leaf).
- **Progression**:
  - **Level 1–4**: 2 to 3 items
  - **Level 5–8**: 4 to 5 items
  - **Level 9–10**: 6 items

### 3. 🔷 Pattern Match (Visual Recognition Choice)
- **Concept**: Displays a multi-shape pattern, hides it, and gives 2 or 3 large cards: *"Which pattern did you see?"*.
- **Why it matters**: Ideal for seniors who experience motor fatigue or tremor, offering direct recognition rather than manual sequence reconstruction.
- **Progression**:
  - **Level 1–3**: 2 shapes with 2 choices
  - **Level 4–7**: 3 to 4 shapes with 3 choices
  - **Level 8–10**: 5 shapes with 3 choices

---

## 💻 How to Run on Windows

### Quick Launch (One-Click):
1. Navigate to the project folder:
   ```
   C:\Users\nithy\pranav
   ```
2. Double-click **`Launch-MemoryBloom.bat`**.
3. The app will automatically start the lightweight local server and launch Microsoft Edge in standalone app window mode (borderless app experience without browser tabs).

### Or Run via Terminal:
```powershell
node server.js
```
Then open `http://localhost:3000` in Microsoft Edge or Google Chrome.
You can click the **Install App (⊕)** icon in the browser address bar to install it permanently to your Windows Start Menu and Taskbar!

---

## 📱 How to Run & Install on Android

MemoryBloom is a **Progressive Web App (PWA)** with a service worker and manifest, allowing it to install directly on Android phones and tablets as a native full-screen app.

### Steps to Install on Android:
1. Make sure your Android device is connected to the **same Wi-Fi network** as this computer.
2. Open **Google Chrome** on your Android phone or tablet.
3. In the Chrome address bar, enter the local network address:
   ```
   http://10.184.103.76:3000
   ```
   *(Or click "Install / Phone Link" inside the desktop app to scan the generated QR code with your phone camera).*
4. Tap Chrome's **menu button (three vertical dots ⋮)** in the top right.
5. Tap **"Install app"** or **"Add to Home screen"**.
6. The **MemoryBloom** icon will be added to your Android home screen! It runs in full-screen standalone mode with offline caching.

---

## ⚙️ Accessibility & Caregiver Settings

Tap the **⚙️ Settings** icon in the header to customize:
- **Text & Button Size**: Standard, Large (recommended for seniors), or Extra Large.
- **Visual Theme**: Gentle Sage (soothing green), Warm Amber, or High Contrast (for low vision).
- **Pattern Display Time**: Manual ("I'm Ready" only), Relaxed (8s), Standard (5s), or Quick (3s).
- **Retention Pause Time**: Brief (1s), Gentle (3s), or Extended (5s).
- **Spoken Voice Guidance**: Toggle on/off voice prompts for auditory assistance.
- **Melodic Chimes**: Toggle on/off harmonic musical feedback.
- **Reset Records**: Option for caregivers to reset streaks and stars when transitioning to a new user.

---

## 📂 Project Structure

```
memory-care-app/
├── index.html              # Main senior-accessible interface
├── styles.css              # Accessible styling, high contrast, responsive layouts
├── app.js                  # Audio synthesizer, speech synthesis, 3 exercise engines, PWA logic
├── manifest.json           # PWA manifest for Android & Windows installation
├── service-worker.js       # Offline caching service worker
├── server.js               # Lightweight local HTTP server with LAN IP detection
├── Launch-MemoryBloom.bat  # 1-click Windows desktop launcher
├── Launch-MemoryBloom.ps1  # PowerShell launcher alternative
├── generate-icons.ps1      # Icon generator script
├── icons/
│   ├── icon.svg            # Vector app emblem
│   ├── icon-192.png        # Android & desktop 192px app icon
│   └── icon-512.png        # Android & desktop 512px app icon
└── README.md               # User guide & documentation
```
