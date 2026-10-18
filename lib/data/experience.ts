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
    logo: '/logos/kde.png',
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
      { label: 'Final work', url: 'https://mentorship.kde.org', kind: 'design' },
      { label: 'Status Report', url: 'https://community.kde.org/SoK/2026/StatusReport/Aryan_Rai', kind: 'article' },
    ],
  },
  {
    role: 'Backend AI Intern',
    company: 'FlyRank',
    companyUrl: 'https://flyrank.ai/',
    logo: '/logos/flyrank.png',
    type: 'Internship',
    period: 'Jun 2026 — Present',
    location: 'Remote',
    summary: 'Shipping internal AI tooling — CI triage automation and a multi-agent PR review pipeline.',
    bullets: [
      'Built an MCP server over the GitHub Actions + Slack APIs that parses failed CI logs, extracts root cause, failing commit, and author, and posts structured triage alerts.',
      'Designed a multi-agent PR review pipeline: an orchestrator fans each diff out to specialized agents in parallel and aggregates their findings into one review.',
      'Wired the pipeline into GitHub via webhooks to post inline PR comments, deduplicating overlapping findings across agents.',
    ],
    tech: ['Python', 'MCP', 'GitHub Actions', 'Slack API', 'Multi-agent'],
    // proofs: [
    //   { label: 'Final work', url: 'https://mentorship.kde.org', kind: 'design' },
    //   { label: 'Status Report', url: 'https://community.kde.org/SoK/2026/StatusReport/Aryan_Rai', kind: 'article' },
    // ],
  },
  {
    role: 'Open Source Contributor',
    company: 'Inspektor Gadget',
    companyUrl: 'https://www.inspektor-gadget.io/',
    logo: '/logos/inspektor-gadget.png',
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
      { label: 'Contribution in v0.47.0 release', url: 'https://github.com/inspektor-gadget/inspektor-gadget/releases/tag/v0.47.0', kind: 'pr' },
      { label: 'Contribution in v0.53.0 release', url: 'https://github.com/inspektor-gadget/inspektor-gadget/releases/#release-v0.53.0', kind: 'pr' },
    ],
  },
];
