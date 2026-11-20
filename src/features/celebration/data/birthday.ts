export interface BirthdayPhoto {
  src: string;
  caption: string;
}

export interface PartyWearOption {
  id: string;
  name: string;
  description: string;
  src: string;
  accent: string;
}

const birthdayName = process.env.NEXT_PUBLIC_BIRTHDAY_PERSON_NAME || "Bristi";

export const birthday = {
  name: birthdayName,
  date: process.env.NEXT_PUBLIC_BIRTH_DATE || "11-20",
  // The surprise is locked until local midnight by default. Set this to true only for previews.
  countdownEnabled: process.env.NEXT_PUBLIC_COUNTDOWN_NOT_ENABLED !== "true",
  greeting: `Happy Birthday, ${birthdayName}! 🎂✨`,
  intro: "A little birthday world, made to celebrate the friend who makes every day brighter.",
  letter: `Happy birthday to the friend who makes ordinary days feel lighter, louder, and so much more fun. Thank you for the laughs, the honest talks, the memories, and the steady way you show up. I hope this year brings you brave new beginnings, peaceful moments, and plenty of reasons to be proud of yourself. Never forget how much your friendship means and how many people are cheering for you. Here’s to your next wonderful chapter.`,
  promise: "A friend’s promise: I’ll cheer for your wins, share in the laughs, and always remind you how capable you are.",
  wishes: ["May this year bring you opportunities that feel made for you.", "May your days be full of laughter, calm, and your favourite people.", "May every goal you care about move a little closer.", "Keep being wonderfully you—the world is better with your friendship in it."],
  finale: ["Today is all about you…", "And the friend you are to so many…", "Thank you for every laugh, every memory, and every real conversation.", "May your next year be full of good surprises…", "Big dreams, and people who cheer you on.", `Happy Birthday, ${birthdayName}! ✨`],
  music: "/assets/music/birthday.mp3",
};

const photoFiles = [
  "WhatsApp Image 2026-11-19 at 22.42.27.jpeg",
  "WhatsApp Image 2026-10-20 at 22.55.21.jpeg",
  "WhatsApp Image 2026-10-18 at 23.30.16.jpeg",
  "WhatsApp Image 2026-10-24 at 16.03.37.jpeg",
  "WhatsApp Image 2026-10-20 at 22.55.29.jpeg",
  "WhatsApp Image 2026-11-19 at 22.42.28.jpeg",
  "WhatsApp Image 2026-10-20 at 22.55.23.jpeg",
] as const;

const photoCaptions = [
  "A smile that always lifts the room",
  `One of many brilliant ${birthdayName} moments`,
  `Just ${birthdayName}, being unforgettable`,
  "A memory worth keeping close",
] as const;

export const photoPaths: BirthdayPhoto[] = photoFiles.map((file, index) => ({
  src: `/assets/photos/${file}`,
  caption: photoCaptions[index % photoCaptions.length],
}));

export const partyWearChoices: PartyWearOption[] = [
  { id: "birthday-rose", name: "Birthday Rose", description: "The original embroidered celebration gown.", src: "/assets/avatars/birthday-girl-cake-cutting-avatar-cartoon-transparent.png", accent: "#df5f88" },
  { id: "emerald", name: "Emerald Bloom", description: "Satin green with golden floral embroidery.", src: "/assets/avatars/birthday-girl-emerald-party-gown.png", accent: "#14815e" },
  { id: "royal-blue", name: "Royal Blue", description: "A sparkling one-shoulder evening look.", src: "/assets/avatars/birthday-girl-royal-blue-party-gown.png", accent: "#436dcc" },
  { id: "champagne", name: "Champagne Pearl", description: "Soft tulle layers and pearl detailing.", src: "/assets/avatars/birthday-girl-champagne-party-gown.png", accent: "#d9ac70" },
  { id: "purple", name: "Velvet Violet", description: "Regal velvet with crystal embroidery.", src: "/assets/avatars/birthday-girl-purple-party-gown.png", accent: "#713574" },
  { id: "rose-gold", name: "Rose Gold", description: "Blush sequins with graceful draped sleeves.", src: "/assets/avatars/birthday-girl-rose-gold-party-gown.png", accent: "#d68a91" },
  { id: "black", name: "Midnight Crystal", description: "A sleek black gown with a crystal cape.", src: "/assets/avatars/birthday-girl-black-party-gown.png", accent: "#7f7d96" },
  { id: "turquoise", name: "Turquoise Lehenga", description: "Gold zardozi embroidery and a draped dupatta.", src: "/assets/avatars/birthday-girl-turquoise-lehenga.png", accent: "#36aabb" },
  { id: "ruby", name: "Ruby Sari", description: "Silk sari with a rich gold zari border.", src: "/assets/avatars/birthday-girl-ruby-sari.png", accent: "#c73550" },
  { id: "ivory", name: "Ivory Bloom", description: "Iridescent beading with lavender floral accents.", src: "/assets/avatars/birthday-girl-ivory-party-gown.png", accent: "#d4b8df" },
];
