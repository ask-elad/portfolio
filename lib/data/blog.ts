export interface BlogPost {
  id: number;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  url: string;  // External link — Medium, Dev.to, Substack, personal site, etc.
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "REPLACE_ME: Post title",
    date: "REPLACE_ME: Mar 2025",
    readTime: "REPLACE_ME: 8 min",
    tags: ["AI", "REPLACE_ME"],
    url: "https://REPLACE_ME.com/post-1",
  },
  {
    id: 2,
    title: "REPLACE_ME: Post title",
    date: "REPLACE_ME: Feb 2025",
    readTime: "REPLACE_ME: 5 min",
    tags: ["Backend", "REPLACE_ME"],
    url: "https://REPLACE_ME.com/post-2",
  },
  {
    id: 3,
    title: "REPLACE_ME: Post title",
    date: "REPLACE_ME: Jan 2025",
    readTime: "REPLACE_ME: 6 min",
    tags: ["REPLACE_ME"],
    url: "https://REPLACE_ME.com/post-3",
  },
];

// Link to your full writing page
export const BLOG_URL = "https://REPLACE_ME.com";
