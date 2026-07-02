export interface ProofOfWork {
  label: string;         // e.g. "Merged PR #482", "Live demo", "Case study"
  url: string;
  kind?: 'pr' | 'demo' | 'repo' | 'article' | 'design' | 'video' | 'other';
}

export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  logo?: string;         // /logos/kde.svg  (place files in /public/logos/)
  type: 'Full-time' | 'Internship' | 'Part-time' | 'Freelance' | 'Volunteer';
  period: string;
  location?: string;     // optional: "Remote" | "Bengaluru, IN"
  summary?: string;      // one-line editorial lede
  bullets: string[];
  tech: string[];
  proofs?: ProofOfWork[];
}

export const EXPERIENCE: Experience[] = [
  {
    role: 'SoK Mentee',
    company: 'KDE',
    companyUrl: 'https://kde.org/',
    logo: '/logos/kde.svg',
    type: 'Internship',
    period: 'Jan 2026 — Mar 2026',
    location: 'Remote',
    summary: 'Rebuilding mentorship.kde.org to modernise onboarding for thousands of new contributors.',
    bullets: [
      'Complete restructuring of mentorship.kde.org with a modern, accessible design system.',
      'Directly impacts thousands of students by streamlining their first steps into the KDE community.',
      'Built with Hugo (Go) — templating, content architecture, and CI-driven deploys.',
    ],
    tech: ['Go', 'Hugo', 'Web Development'],
    proofs: [
      // { label: 'Project page', url: 'https://mentorship.kde.org', kind: 'demo' },
      // { label: 'Tracking issue', url: 'https://…', kind: 'pr' },
    ],
  },
  {
    role: 'Open Source Contributor',
    company: 'Inspektor Gadget',
    companyUrl: 'https://www.inspektor-gadget.io/',
    logo: '/logos/inspektor-gadget.svg',
    type: 'Volunteer',
    period: 'Dec 2025 — Present',
    location: 'Remote',
    summary: 'Shipping CLI features and fixing Docker integration for a CNCF eBPF observability tool.',
    bullets: [
      'Contributed a complete new CLI feature end-to-end (design → implementation → tests).',
      'Fixed configuration handling for Docker integration with the CLI.',
    ],
    tech: ['Go', 'eBPF', 'CLI'],
    proofs: [
      // { label: 'Merged PR', url: 'https://github.com/inspektor-gadget/inspektor-gadget/pull/…', kind: 'pr' },
    ],
  },
];
