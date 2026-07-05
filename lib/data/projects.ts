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
    name: "TwinMind AI",
    description: "A real-time AI meeting copilot that listens to live audio, transcribes speech via Whisper, and continuously surfaces three contextual suggestions based on what is being said. Clicking a suggestion opens a detailed answer in a streaming chat panel.",
    tags: ["React", "Node", "LLM"],
    status: "Live",
    year: "2025",
      url: "https://twinmind-ai-client-u68m-git-main-ask-elads-projects.vercel.app/",
    github: "https://github.com/ask-elad/twinmind-ai",
    image: "/proj/twinmind.png"
  },
  {
    id: 2,
    name: "Repo Analyzer",
    description: "A tool that scans a local Git repository, maps out how its files depend on each other, and renders the whole thing as an interactive, draggable graph with AI-generated summaries on click.",
    tags: ["Python", "FastAPI", "LLM", "React"],
    status: "Building",
    year: "2026",
    //url: "https://REPLACE_ME.com",
    github: "https://github.com/ask-elad/repo-analyser",
    image: "/proj/image.png"
  },
  {
    id: 3,
    name: "Auditor",
    description: "Support Integrity Auditor (SIA) is an intelligent ticket-auditing platform designed to identify Priority Mismatches in customer support workflows. The system analyzes ticket metadata, resolution patterns, and textual signals to determine whether the assigned priority accurately reflects the underlying severity of the issue.",
    tags: ["React", "FastAPI", "Python", "Numpy", "Pandas", "Pytorch"],
    status: "Live",
    year: "2026",
    github: "https://github.com/ask-elad/Auditor",
    url: "https://auditor-git-main-ask-elads-projects.vercel.app/",
    image:"/proj/auditor.png"
  },
  {
    id: 4,
    name: "Server Proxy",
    description: "server_proxy is a powerful and flexible proxy server designed to handle HTTP, HTTPS, and TCP traffic efficiently. It integrates protocol detection, secure tunneling, and connection management to provide a seamless proxy experience for developers and network engineers.",
    tags: ["GO", "HTTP/HTTPS", "CLI"],
    status: "Archived",
    github: "https://github.com/ask-elad/server_proxy",
    year: "2025",
    image: "/proj/server.png"
  },
  {
    id: 5,
    name: "Campus Pulse",
    description: "A unified campus intelligence dashboard for IIT Roorkee that combines a modern Next.js frontend, an Express-based orchestrator, and independent MCP servers for library, cafeteria, events, and academics. The AI assistant routes user questions to the right campus source in real time and streams the answer back to the browser.",
    tags: ["GO", "HTTP/HTTPS", "CLI"],
    status: "Building",
    github: "https://github./-https://github.com/ask-elad/Campus-Intelligence-Dashboard-with-AI-Assistant/server_proxy",
    year: "2026",
    image: "/proj/campus.png"
  },
];
