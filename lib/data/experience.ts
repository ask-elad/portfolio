export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  type: 'Full-time' | 'Internship' | 'Part-time' | 'Freelance' | 'Volunteer';
  period: string;
  bullets: string[];
  tech: string[];  // Shown as subtle tags — this replaces the standalone skills section
}

export const EXPERIENCE: Experience[] = [
  {
    role: "REPLACE_ME: Your Role",
    company: "REPLACE_ME: Company",
    companyUrl: "https://REPLACE_ME.com",
    type: "Internship",
    period: "REPLACE_ME: Jan 2025 — Present",
    bullets: [
      "REPLACE_ME: What you built. Add numbers if you have them.",
      "REPLACE_ME: Second bullet.",
      "REPLACE_ME: Third bullet.",
    ],
    tech: ["Python", "FastAPI", "REPLACE_ME"],
  },
  {
    role: "REPLACE_ME: Your Role",
    company: "REPLACE_ME: Company",
    type: "Part-time",
    period: "REPLACE_ME: Jun 2024 — Dec 2024",
    bullets: [
      "REPLACE_ME: What you built.",
      "REPLACE_ME: Second bullet.",
    ],
    tech: ["React", "Node.js", "REPLACE_ME"],
  },
  {
    role: "REPLACE_ME: Role or contribution",
    company: "REPLACE_ME: Project or org",
    type: "Volunteer",
    period: "REPLACE_ME: 2023 — Present",
    bullets: [
      "REPLACE_ME: What you contributed.",
    ],
    tech: ["REPLACE_ME"],
  },
];
