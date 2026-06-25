# Portfolio

A personal portfolio built with **Next.js 14** and **Tailwind CSS**.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Personalizing the site

**95% of your edits will happen in two places:**

### 1. `lib/data/config.ts`
Your name, bio, roles, contact info, social handles, and the "Now" page content.
Search `REPLACE_ME` to find every placeholder.

### 2. `lib/data/`
| File | What to edit |
|---|---|
| `projects.ts` | Your projects |
| `experience.ts` | Work history |
| `blog.ts` | Blog post links |
| `hobbies.ts` | Chess + stand-up lines, recordings |

---

## Live API integrations

Stats are fetched at runtime — no manual updates needed once your handles are set.

| Platform | Config key | What it shows |
|---|---|---|
| GitHub | `social.github` | Repos, stars, contribution heatmap |
| LeetCode | `social.leetcode` | Problems solved, contest rating |
| Codeforces | `social.codeforces` | Rating, rank, contest history |
| Chess.com | `social.chess` | Rapid/blitz ratings, W/L/D record |

### Optional: GitHub token

Without a token you get 60 API requests/hour (usually enough).
With a token you get 5,000/hour.

```bash
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

---

## Easter egg

Type `vinland` (or `askeladd`) in the **⌘K** command palette.

---

## Deployment

```bash
npm run build
# Deploy to Vercel, Netlify, or any Node host
```

Add your `GITHUB_TOKEN` as an environment variable in your hosting dashboard if you want higher GitHub API rate limits.
