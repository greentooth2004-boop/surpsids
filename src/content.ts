export const content = {
  herName: "your beautiful name",
  herAge: 28,
  nextBirthday: "2026-09-14",
  bigLetter:
    "You are the kind of person who makes ordinary days feel like something worth keeping. This little world is a thank-you for every soft place you have made for the people you love.",
  urdu: {
    welcome: "Aaj ka din sirf tumhara hai.",
    cats: "In sab ki jaan ho tum.",
    cake: "Bas aankhein band karo aur ek wish maango.",
    finale: "Tum bohot khaas ho.",
  },
  cats: [
    { name: "Miso", bio: "Tiny paws, enormous opinions, and a soft spot for her." },
    { name: "Mochi", bio: "The professional napper who trusts her completely." },
    { name: "Pepper", bio: "A little chaos gremlin with a very loud purr." },
    { name: "Nala", bio: "Queen of the windowsill and collector of sunbeams." },
    { name: "Bean", bio: "Small, round, and convinced she is the main character." },
    { name: "Luna", bio: "A midnight shadow who always finds her way home." },
  ],
  milestones: [
    { year: "chapter one", title: "The beginning", text: "The world got a little brighter the day you arrived in it." },
    { year: "chapter two", title: "Soft heart, sharp mind", text: "You learned how to be brave without ever losing your gentleness." },
    { year: "chapter three", title: "The fixer", text: "Somehow, you became everyone's safe place — usually with a snack in hand." },
    { year: "chapter four", title: "More life to live", text: "There are still so many places to go, songs to sing, and cats to rescue." },
    { year: "next chapter", title: "Your biggest one yet", text: "This year belongs to the version of you who chooses herself, too." },
  ],
  cakeSurprise: "Make a wish. Then make it a big one — the universe is listening.",
  openNowGift: "One guilt-free day where you choose the plan, the food, the music, and absolutely everything else.",
  timeGiftHint: "Your next adventure begins in {days} days.",
  specialWords: ["kind", "brave", "hilarious", "magical", "home"],
  finalWord: "SPECIAL.",
} as const;

export type Cat = (typeof content.cats)[number];
export type Milestone = (typeof content.milestones)[number];
