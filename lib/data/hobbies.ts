// ── CHESS ────────────────────────────────────────────────────────────────────
// Stats are fetched live from chess.com using CONFIG.social.chess
// Just set your chess.com username in lib/data/config.ts — nothing else needed.
export const CHESS_CONFIG = {
  // A personal line about chess. Write it honestly.
  // e.g. "Been playing since I was 14. Still chasing 1500 rapid."
  line: "REPLACE_ME: Your personal chess line.",

  // Which time controls to show. Options: "rapid" | "blitz" | "bullet"
  showControls: ["rapid", "blitz"] as const,
};

// ── STAND-UP COMEDY ──────────────────────────────────────────────────────────
// Fully static — edit manually whenever you perform.
export const STANDUP_CONFIG = {
  // A personal line. Write it honestly. Why do you do it? What does it feel like?
  // e.g. "I do stand-up occasionally. Failing in front of 40 strangers is surprisingly good for your code reviews."
  line: "REPLACE_ME: Your personal stand-up line.",

  // Links to recordings/clips. Leave empty if you don't have any yet.
  recordings: [
    // { title: "Open Mic @ The Comedy Store", url: "https://youtube.com/...", platform: "YouTube" },
  ] as Array<{ title: string; url: string; platform: string }>,

  // Upcoming shows. Leave empty if none.
  upcoming: [
    // { venue: "REPLACE_ME: Venue Name", date: "REPLACE_ME: July 12, 2025", city: "Pune" },
  ] as Array<{ venue: string; date: string; city: string }>,
};

// ── ADD MORE HOBBIES ─────────────────────────────────────────────────────────
// To add a new hobby, just add an entry to this array — no component changes
// needed. Everything below is optional except id/name/emoji/description.
export interface CustomHobby {
  id: string;
  name: string;
  emoji: string;
  description: string;
  // Path or URL to a photo for this hobby's card, e.g. "/hobbies/climbing.jpg"
  // (drop the file in /public/hobbies/ and point here). Leave unset and the
  // card will show a placeholder you can fill in later.
  image?: string;
  // Short freeform notes/comments — show up as a little bullet list under
  // the description. Add as many as you like, any time.
  comments?: string[];
  links?: Array<{ label: string; url: string }>;
}

export const CUSTOM_HOBBIES: CustomHobby[] = [
  // Example — copy this block to add a new hobby:
  // {
  //   id: "reading",
  //   name: "Reading",
  //   emoji: "📚",
  //   image: "/hobbies/reading.jpg",
  //   description: "Mostly technical books + philosophy.",
  //   comments: [
  //     "Currently reading: REPLACE_ME",
  //     "Favorite so far: REPLACE_ME",
  //   ],
  //   links: [{ label: "My bookshelf", url: "https://..." }],
  // },
];
