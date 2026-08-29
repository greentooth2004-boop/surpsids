/**
 * ============================================================================
 *  FOR THE GIRL WHO FIXED EVERYTHING  —  PERSONALIZE HERE (and ONLY here)
 * ============================================================================
 *
 *  This is the ONLY file you need to edit to make the whole website about her.
 *  Everything personal lives in this one object. Nothing private ever needs to
 *  touch the code logic. Drop your words and photos in, and the site is done.
 *
 *  HOW TO USE:
 *   1. Replace every "PASTE_..." placeholder below with your own words.
 *   2. Put real photos in  public/photos/  with the exact filenames mentioned.
 *      (Until you do, the site shows beautiful illustrated placeholders.)
 *   3. Deploy. Send her the link. Cry. (Optional but recommended.)
 *
 *  You can write freely. emojis are fine. Roman Urdu / Hyderabadi lines go in
 *  the `urdu` arrays — keep them short so they fit nicely on screen.
 * ============================================================================
 */

export const content = {
  /* ---- THE BASICS ---------------------------------------------------------- */
  herName: "PASTE_HER_NAME_HERE", // shown huge at the fireworks finale
  herAge: "PASTE_AGE_HERE", // used in the RPG "LEVEL X UNLOCKED" screen
  nextBirthday: "2026-12-31", // YYYY-MM-DD — powers the time-locked gift countdown

  /* ---- THE BIG LETTER (Chapter 4, the tear-jerker) -------------------------
   * Write the letter you always wanted to say. One string per line — the site
   * reveals them one by one like petals. This is the emotional peak, so take
   * your time. The site already promises you're telling her she's special,
   * beautiful, and that she changed your life — say it in YOUR words.
   */
  bigLetter: [
    "PASTE_LINE_1 — tell her this is real and it's all for her.",
    "PASTE_LINE_2 — the first time you noticed how special she was.",
    "PASTE_LINE_3 — what she looks like to you when she doesn't know you're watching.",
    "PASTE_LINE_4 — a specific moment only the two of you share.",
    "PASTE_LINE_5 — how she changed the direction of your life.",
    "PASTE_LINE_6 — the exact kind of beautiful she is.",
    "PASTE_LINE_7 — close it soft. tell her she is loved, always.",
  ],

  /* ---- ROMAN URDU / HYDERABADI LINES (sprinkled at emotional peaks) -------- */
  urdu: {
    glitch: "duniya ki sabse special ladki ke liye load ho raha hai... thoda wait karo jaan.",
    catApproval: "Billo Rani officially approve karti hain. 🐱",
    garden: "duniya mein sab kuch hai… par tu alag hai, jaan.",
    cakeCheer: "Shabaash! Mubarak ho, jaanam! 🎂",
    secret: "aur ek baat... tu meri favourite muskurahat hai.",
  },

  /* ---- CHAPTER 2: THE FERAL CAT SANCTUARY ----------------------------------
   * Add as many cats as you like (the game ships with 6). Put real photos at
   * public/photos/cat-1.jpg, cat-2.jpg ... or leave them out for placeholders.
   * `name` and `bio` are editable. Keep bios to one short line.
   */
  cats: [
    { name: "PASTE_CAT_1_NAME", bio: "PASTE_ONE_LINE about this cat & her." },
    { name: "PASTE_CAT_2_NAME", bio: "PASTE_ONE_LINE about this cat & her." },
    { name: "PASTE_CAT_3_NAME", bio: "PASTE_ONE_LINE about this cat & her." },
    { name: "PASTE_CAT_4_NAME", bio: "PASTE_ONE_LINE about this cat & her." },
    { name: "PASTE_CAT_5_NAME", bio: "PASTE_ONE_LINE about this cat & her." },
    { name: "PASTE_CAT_6_NAME", bio: "PASTE_ONE_LINE about this cat & her." },
  ],

  /* ---- CHAPTER 3: HER LIFE, THE RPG ----------------------------------------
   * Each milestone is a memory card along her life-path. Write privately.
   */
  milestones: [
    { year: "PASTE_YEAR", title: "PASTE_TITLE", text: "PASTE_ONE_LINE memory." },
    { year: "PASTE_YEAR", title: "PASTE_TITLE", text: "PASTE_ONE_LINE memory." },
    { year: "PASTE_YEAR", title: "PASTE_TITLE", text: "PASTE_ONE_LINE memory." },
    { year: "PASTE_YEAR", title: "PASTE_TITLE", text: "PASTE_ONE_LINE memory." },
    { year: "PASTE_YEAR", title: "PASTE_TITLE", text: "PASTE_ONE_LINE memory." },
  ],

  /* ---- CHAPTER 5: THE CAKE ------------------------------------------------- */
  cakeSurprise: "PASTE_THE_MESSAGE hidden inside the cake (editable).",

  /* ---- CHAPTER 7: THE TIME-LOCKED GIFT ------------------------------------- */
  timeGiftHint: "Day {days} of 365. Something is growing in here for you. Come back and watch it tick anytime.",
  openNowGift: "Redeem for: one entire day where you decide absolutely everything. (No take-backs.)",

  /* ---- FINALE: THE WALL OF SPECIAL -----------------------------------------
   * Words that assemble to describe her, then the final word fills the screen.
   */
  specialWords: [
    "Kind.",
    "Brave.",
    "The softest heart in Hyderabad.",
    "Cat-whisperer.",
    "Unbearably lovely.",
    "Mine, in the best way.",
  ],
  finalWord: "SPECIAL.",
  finaleNote: "That's the word. That's the whole website. Love, me.",
  replayLabel: "Relive the Journey",
};

export type Content = typeof content;
