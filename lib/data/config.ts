// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                      PORTFOLIO CONFIGURATION                              ║
// ║  This is the ONE file you need to edit to make the site yours.            ║
// ║  Search "REPLACE_ME" to find every placeholder.                           ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

export const CONFIG = {

  // ── WHO YOU ARE ───────────────────────────────────────────────────────────
  name:     "ARYAN RAI",
  alias:    "askelad",
  location: "ROORKEE, INDIA",
  email:    "aryanrai746@gmail.com",

  // Path to your resume PDF. Drop the file in /public/resume.pdf (same name)
  // and the Resume button in the header will just work — no code edit needed.
  resumeUrl: "/resume.pdf",

  // ── HERO ─────────────────────────────────────────────────────────────────
  roles: [
    "AI Backend Developer",
    "LLM Architect",
    "Full Stack Engineer",
  ],

  heroTagline: "'I build the backend that keeps your LLM from embarrassing you in production.'",

  // ── ABOUT ────────────────────────────────────────────────────────────────
  about: {
    paragraph1: "Hi, I'm Aryan. I enjoy solving problems and challenging myself to think differently.",
    paragraph2: "I aim to build systems, that real people use. Hopefully a product of my own some day.",
    techLine:   "'Day to day I reach for Python, Typescript and GO for backends, Next.js and React when the UI needs to be real.'",
    facts: [
    //  { label: "Currently",     value: "REPLACE_ME: What you're building" },
      { label: "Studied at",    value: "IIT Roorkee" },
      { label: "Interested in", value: "Technical interests" },
      { label: "Based in",      value: "Roorkee"},
      { label: "Open to",       value: "Full-time \u00b7 Internship \u00b7 Freelance" },
    ],
  },

  // ── CONTACT ──────────────────────────────────────────────────────────────
  contactLine: "'If you're working on something interesting in the AI space, or just want to talk systems, I'm always happy to chat.'",

  // ── SOCIAL ───────────────────────────────────────────────────────────────
  social: {
    github:     "ask-elad",
    leetcode:   "8o1pQrBIme",
    codeforces: "askelad",
    chess:      "aryan05050",
    linkedin:   "https://www.linkedin.com/in/aryan-rai-222442293/",
    twitter:    "https://x.com/ask_elad",
  },

  // ── GITHUB PAGE (curated) ─────────────────────────────────────────────────
  // Tell the GitHub page WHICH repos to feature. Put 3–5 repo names here in
  // the order you want them shown. Leave empty and it falls back to your
  // most-recently-updated repos. We DON'T sort by stars — quality over vanity.
  github: {
    pinnedRepos: [] as string[],     // e.g. ["llm-server", "fastapi-rate-limit"]
    blurb: "Github storing all my digital annecdotes, open source contributions and projects.",
  },

  // ── CP PAGE (curated headline) ────────────────────────────────────────────
  cp: {
    blurb: "Started to enjoy solving complex algorithmic problems",
  },

  // ── NOW PAGE (only via cmdk) ─────────────────────────────────────────────
  now: {
    lastUpdated: "REPLACE_ME: e.g. June 2025",
    location:   "REPLACE_ME: City",
    building: ["REPLACE_ME: Project 1", "REPLACE_ME: Project 2"],
    learning: ["REPLACE_ME: Topic 1",   "REPLACE_ME: Topic 2"],
    reading:  ["REPLACE_ME: Book - Author", "REPLACE_ME: Paper or article"],
  },
};
