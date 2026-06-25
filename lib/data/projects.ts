export interface Project {
  id: number;
  name: string;
  description: string;  // Write this like a person. What does it do? Why is it interesting?
  tags: string[];
  status: 'Live' | 'Building' | 'Archived';
  year: string;
  url?: string;
  github?: string;
  // Path or URL to a screenshot/cover image for this project's card, e.g.
  // "/projects/myapp.png" (drop the file in /public/projects/ and point here).
  // Leave unset and the card shows a placeholder so it's obvious where to add one.
  image?: string;
}

// Add, remove, or edit projects here. They appear on the main page.
// Aim for 4–6 projects. Quality > quantity.
export const PROJECTS: Project[] = [
  {
    id: 1,
    name: "REPLACE_ME",
    description: "REPLACE_ME: What it does, what problem it solves. Write conversationally, not like a resume bullet.",
    tags: ["Python", "FastAPI", "REPLACE_ME"],
    status: "Live",
    year: "2025",
    url: "https://REPLACE_ME.com",
    github: "https://github.com/askelad/REPLACE_ME",
  },
  {
    id: 2,
    name: "REPLACE_ME",
    description: "REPLACE_ME: Description. What makes this one interesting or hard?",
    tags: ["Python", "LangChain", "REPLACE_ME"],
    status: "Building",
    year: "2025",
    github: "https://github.com/askelad/REPLACE_ME",
  },
  {
    id: 3,
    name: "REPLACE_ME",
    description: "REPLACE_ME: Description.",
    tags: ["Next.js", "REPLACE_ME"],
    status: "Live",
    year: "2024",
    url: "https://REPLACE_ME.com",
  },
  {
    id: 4,
    name: "REPLACE_ME",
    description: "REPLACE_ME: Description.",
    tags: ["React", "Node.js", "REPLACE_ME"],
    status: "Live",
    year: "2023",
  },
];
