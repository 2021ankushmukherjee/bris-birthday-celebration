export const birthday = {
  name: process.env.NEXT_PUBLIC_BIRTHDAY_PERSON_NAME || "Bristi",
  date: process.env.NEXT_PUBLIC_BIRTH_DATE || "11-20",
  // The surprise is locked until local midnight by default. Set this to true only for previews.
  countdownEnabled: process.env.NEXT_PUBLIC_COUNTDOWN_NOT_ENABLED !== "true",
  greeting: `Happy Birthday, ${process.env.NEXT_PUBLIC_BIRTHDAY_PERSON_NAME || "Bristi"}! 🎂✨`,
  intro: "A little birthday world, made to celebrate the friend who makes every day brighter.",
  letter: `Happy birthday to the friend who makes ordinary days feel lighter, louder, and so much more fun. Thank you for the laughs, the honest talks, the memories, and the steady way you show up. I hope this year brings you brave new beginnings, peaceful moments, and plenty of reasons to be proud of yourself. Never forget how much your friendship means and how many people are cheering for you. Here’s to your next wonderful chapter.`,
  promise: "A friend’s promise: I’ll cheer for your wins, share in the laughs, and always remind you how capable you are.",
  wishes: ["May this year bring you opportunities that feel made for you.", "May your days be full of laughter, calm, and your favourite people.", "May every goal you care about move a little closer.", "Keep being wonderfully you—the world is better with your friendship in it."],
  finale: ["Today is all about you…", "And the friend you are to so many…", "Thank you for every laugh, every memory, and every real conversation.", "May your next year be full of good surprises…", "Big dreams, and people who cheer you on.", `Happy Birthday, ${process.env.NEXT_PUBLIC_BIRTHDAY_PERSON_NAME || "Bristi"}! ✨`],
  music: "/assets/music/birthday.mp3",
};

export const photoPaths = ["WhatsApp Image 2026-11-19 at 22.42.27.jpeg", "WhatsApp Image 2026-10-20 at 22.55.21.jpeg", "WhatsApp Image 2026-10-18 at 23.30.16.jpeg", "WhatsApp Image 2026-10-24 at 16.03.37.jpeg", "WhatsApp Image 2026-10-20 at 22.55.29.jpeg", "WhatsApp Image 2026-11-19 at 22.42.28.jpeg", "WhatsApp Image 2026-10-20 at 22.55.23.jpeg"].map((file, index) => ({ src: `/assets/${file}`, caption: [`A smile that always lifts the room`, `One of many brilliant ${birthday.name} moments`, `Just ${birthday.name}, being unforgettable`, `A memory worth keeping close`][index % 4] }));
