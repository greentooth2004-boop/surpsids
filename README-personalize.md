# Make it hers — personalize in 5 minutes

Everything private lives in **ONE file**: `src/content.ts`. You never touch the code.

### 1. Open `src/content.ts`
Replace every `PASTE_...` placeholder with your own words. Write freely — emojis are fine.

| Field | What to put |
|-------|-------------|
| `herName` | Her name, as it should appear huge in the sky |
| `herAge` | The age she's turning (used in "LEVEL X UNLOCKED") |
| `nextBirthday` | `YYYY-MM-DD` of her **next** birthday (powers the countdown box) |
| `bigLetter` | The letter. One line per string. This is the tear-jerker — say it in your words |
| `urdu.*` | Roman Urdu / Hyderabadi lines at the emotional peaks (keep short) |
| `cats[]` | 6 entries: `name` + one-line `bio` about each feral cat & her |
| `milestones[]` | 5 memory cards along her life-RPG path |
| `cakeSurprise` | The message hidden inside the birthday cake |
| `openNowGift` | The redeemable promise she can open immediately |
| `timeGiftHint` | Countdown message (uses `{days}` automatically) |
| `specialWords[]` | Words that assemble to describe her at the finale |
| `finalWord` | The word that fills the screen (default `SPECIAL.`) |

### 2. Add photos (optional but magic)
Drop real images into **`public/photos/`** with these exact names:
`cat-1.jpg`, `cat-2.jpg`, … `cat-6.jpg`.
Until you add them, the site shows beautiful illustrated cats — so it looks complete either way.

### 3. Build & send
```bash
npm install
npm run build
```
Open `dist/index.html` (or deploy the `dist/` folder) and send her the link.

### Tips
- The mic is used **only** for blowing out candles (Chapter 5), with a tap-and-hold fallback.
- There's a secret: tap the final period (`.`) on the last screen 3 times.
- Mute anytime with the 🔊 button, top-left.
