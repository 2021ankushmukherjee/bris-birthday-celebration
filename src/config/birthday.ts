export const birthday = {
  name: process.env.NEXT_PUBLIC_BIRTHDAY_PERSON_NAME || "Bristi",
  date: process.env.NEXT_PUBLIC_BIRTH_DATE || "11-20",
  countdownEnabled: process.env.NEXT_PUBLIC_COUNTDOWN_ENABLED !== "false",
  greeting: `Happy Birthday, ${process.env.NEXT_PUBLIC_BIRTHDAY_PERSON_NAME || "Bristi"}. 🎂❤️`,
  intro: "Someone has created a little world, just for you.",
  letter: `Today is a celebration of the gentleness you bring into ordinary moments, the light in your smile, and all the wonderful dreams still waiting for you. I hope this year meets you with the same kindness, warmth, and magic you give so freely. May every new day remind you how deeply you deserve to be cherished. Happy birthday, beautiful.`,
  promise: "A little promise: I’ll always hope for your happiest days, cheer for your dreams, and remind you that you are more loved than you know.",
  wishes: ["May every dream of yours find its way to reality.", "You deserve a thousand reasons to smile.", "May this year bring you endless happiness.", "Keep shining, because the world is more beautiful with you in it."],
  finale: ["On this special day…", "I just want you to know…", "That your smile makes the world a little brighter.", "And I hope every beautiful dream you carry…", "Finds its way into reality.", `Happy Birthday, ${process.env.NEXT_PUBLIC_BIRTHDAY_PERSON_NAME || "Bristi"}. ❤️`],
  music: "/assets/music/birthday.mp3",
};

export const photoPaths = ["WhatsApp Image 2026-11-15 at 00.02.02.jpeg", "WhatsApp Image 2026-11-19 at 22.42.27.jpeg", "WhatsApp Image 2026-11-19 at 22.42.30.jpeg", "WhatsApp Image 2026-10-20 at 22.55.21.jpeg", "WhatsApp Image 2026-10-16 at 22.25.56.jpeg", "WhatsApp Image 2026-10-18 at 23.30.16.jpeg", "WhatsApp Image 2026-10-24 at 16.03.37.jpeg", "WhatsApp Image 2026-10-20 at 22.55.29.jpeg", "WhatsApp Image 2026-11-14 at 22.45.54.jpeg", "WhatsApp Image 2026-11-19 at 22.42.29.jpeg", "WhatsApp Image 2026-11-19 at 22.42.28.jpeg", "WhatsApp Image 2026-10-20 at 22.55.23.jpeg"].map((file, index) => ({ src: `/assets/${file}`, caption: [`${birthday.name}'s beautiful smile`, `A radiant moment for ${birthday.name}`, `${birthday.name} in her golden glow`, `Made of magic — ${birthday.name}`][index % 4] }));
