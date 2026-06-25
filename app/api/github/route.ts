import { NextRequest, NextResponse } from 'next/server';

// ── Types ────────────────────────────────────────────────────────────────────
interface LanguageStat { name: string; color: string | null; size: number; pct: number }
interface RepoCard {
  name: string;
  description: string | null;
  url: string;
  homepageUrl?: string | null;
  stars: number;
  forks: number;
  language: { name: string; color: string | null } | null;
  updatedAt?: string;
  isArchived?: boolean;
}
interface ContributionDay { date: string; count: number; level: number }
interface Streaks { current: number; longest: number; currentStartDate: string | null; longestStartDate: string | null }

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// ── Helpers ──────────────────────────────────────────────────────────────────

// Turns a flat list of {date,count} days (chronological) into current + longest streaks.
function computeStreaks(days: { date: string; count: number }[]): Streaks {
  let longest = 0, current = 0;
  let longestStart: string | null = null, currentStart: string | null = null;
  let runStart: string | null = null;

  for (const day of days) {
    if (day.count > 0) {
      if (runStart === null) runStart = day.date;
      current += 1;
      if (current > longest) { longest = current; longestStart = runStart; }
    } else {
      current = 0;
      runStart = null;
    }
  }

  // "current" streak only counts if it reaches all the way to the most recent day
  // (today or yesterday — yesterday allows for the case where today has no
  // contributions yet but the streak isn't broken until the day actually ends).
  const last = days[days.length - 1];
  const secondLast = days[days.length - 2];
  const lastBrokenToday = last && last.count === 0;
  const lastBrokenYesterdayToo = lastBrokenToday && secondLast && secondLast.count === 0;

  let liveCurrent = current;
  let liveCurrentStart = runStart;
  if (lastBrokenYesterdayToo) {
    liveCurrent = 0;
    liveCurrentStart = null;
  } else if (lastBrokenToday) {
    // walk back from secondLast to find the still-active streak ending yesterday
    let c = 0, start: string | null = null;
    for (let i = days.length - 2; i >= 0; i--) {
      if (days[i].count > 0) { c++; start = days[i].date; }
      else break;
    }
    liveCurrent = c;
    liveCurrentStart = start;
  }

  return { current: liveCurrent, longest, currentStartDate: liveCurrentStart, longestStartDate: longestStart };
}

function aggregateLanguages(repos: Array<{ languages?: { edges: { size: number; node: { name: string; color: string | null } }[] } }>): LanguageStat[] {
  const totals = new Map<string, { size: number; color: string | null }>();
  for (const repo of repos) {
    for (const edge of repo.languages?.edges ?? []) {
      const prev = totals.get(edge.node.name);
      totals.set(edge.node.name, { size: (prev?.size ?? 0) + edge.size, color: edge.node.color });
    }
  }
  const grandTotal = Array.from(totals.values()).reduce((s, v) => s + v.size, 0) || 1;
  return Array.from(totals.entries())
    .map(([name, v]) => ({ name, color: v.color, size: v.size, pct: Math.round((v.size / grandTotal) * 1000) / 10 }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 8);
}

function calendarToDays(weeks: { contributionDays: { date: string; contributionCount: number }[] }[]): ContributionDay[] {
  const days = weeks.flatMap(w => w.contributionDays);
  const max = Math.max(1, ...days.map(d => d.contributionCount));
  return days.map(d => ({
    date: d.date,
    count: d.contributionCount,
    // 0-4 intensity level, scaled relative to this user's own busiest day
    level: d.contributionCount === 0 ? 0 : Math.min(4, Math.ceil((d.contributionCount / max) * 4)),
  }));
}

// ── GraphQL path (rich data — needs a token) ────────────────────────────────
const GRAPHQL_QUERY = /* GraphQL */ `
  query($login: String!) {
    user(login: $login) {
      name
      login
      bio
      avatarUrl
      url
      company
      location
      twitterUsername
      websiteUrl
      createdAt
      followers { totalCount }
      following { totalCount }
      organizations(first: 6) { nodes { login avatarUrl url } }
      pinned: pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            primaryLanguage { name color }
          }
        }
      }
      repos: repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: { field: STARGAZERS, direction: DESC }) {
        totalCount
        nodes {
          name
          description
          url
          homepageUrl
          stargazerCount
          forkCount
          isArchived
          updatedAt
          primaryLanguage { name color }
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            edges { size node { name color } }
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }
`;

async function fetchViaGraphQL(username: string) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: GRAPHQL_QUERY, variables: { login: username } }),
    next: { revalidate: 3600 }, // refresh at most once an hour
  });

  const json = await res.json();
  if (!res.ok || json.errors || !json.data?.user) {
    throw new Error(json.errors?.[0]?.message || 'GraphQL request failed');
  }
  const u = json.data.user;

  const totalStars = (u.repos.nodes as any[]).reduce((s, r) => s + r.stargazerCount, 0);
  const days = calendarToDays(u.contributionsCollection.contributionCalendar.weeks);
  const streaks = computeStreaks(days.map(d => ({ date: d.date, count: d.count })));

  const repoCard = (r: any): RepoCard => ({
    name: r.name,
    description: r.description,
    url: r.url,
    homepageUrl: r.homepageUrl,
    stars: r.stargazerCount,
    forks: r.forkCount,
    language: r.primaryLanguage ? { name: r.primaryLanguage.name, color: r.primaryLanguage.color } : null,
    updatedAt: r.updatedAt,
    isArchived: r.isArchived,
  });

  return {
    source: 'graphql' as const,
    user: {
      name: u.name,
      login: u.login,
      bio: u.bio,
      avatarUrl: u.avatarUrl,
      url: u.url,
      company: u.company,
      location: u.location,
      twitterUsername: u.twitterUsername,
      websiteUrl: u.websiteUrl,
      createdAt: u.createdAt,
      followers: u.followers.totalCount,
      following: u.following.totalCount,
      publicRepos: u.repos.totalCount,
      organizations: u.organizations.nodes,
    },
    pinnedRepos: (u.pinned.nodes as any[]).map(repoCard),
    topRepos: (u.repos.nodes as any[]).slice(0, 8).map(repoCard),
    totalStars,
    languages: aggregateLanguages(u.repos.nodes),
    contributions: {
      total: u.contributionsCollection.contributionCalendar.totalContributions,
      commits: u.contributionsCollection.totalCommitContributions,
      pullRequests: u.contributionsCollection.totalPullRequestContributions,
      issues: u.contributionsCollection.totalIssueContributions,
      reviews: u.contributionsCollection.totalPullRequestReviewContributions,
      calendar: days,
    },
    streaks,
  };
}

// ── REST fallback (works without a token, but lighter on detail) ───────────
async function fetchViaRest(username: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 } }),
    fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`, { headers, next: { revalidate: 3600 } }),
  ]);
  const user = await userRes.json();
  const reposRaw = await reposRes.json();
  const repos: any[] = Array.isArray(reposRaw) ? reposRaw : [];

  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);

  // Fetch byte-level language breakdown for the top 12 repos only, to stay
  // well within the unauthenticated rate limit (60 req/hour).
  const topForLanguages = repos.slice(0, 12);
  const languageResults = await Promise.all(
    topForLanguages.map(r =>
      fetch(r.languages_url, { headers, next: { revalidate: 3600 } })
        .then(res => (res.ok ? res.json() : {}))
        .catch(() => ({}))
    )
  );
  const languages = aggregateLanguages(
    topForLanguages.map((_, i) => ({
      languages: {
        edges: Object.entries(languageResults[i] as Record<string, number>).map(([name, size]) => ({
          size: size as number,
          node: { name, color: null },
        })),
      },
    }))
  );

  let contributions: { total: number; calendar: ContributionDay[] } | null = null;
  let streaks: Streaks | null = null;
  try {
    const cr = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, { next: { revalidate: 3600 } });
    if (cr.ok) {
      const data = await cr.json();
      const flat: ContributionDay[] = (data.contributions || []).map((d: any) => ({ date: d.date, count: d.count, level: d.level ?? 0 }));
      contributions = { total: data.total?.[Object.keys(data.total || {})[0]] ?? flat.reduce((s, d) => s + d.count, 0), calendar: flat };
      streaks = computeStreaks(flat.map(d => ({ date: d.date, count: d.count })));
    }
  } catch (_) {}

  const repoCard = (r: any): RepoCard => ({
    name: r.name,
    description: r.description,
    url: r.html_url,
    homepageUrl: r.homepage,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language ? { name: r.language, color: null } : null,
    updatedAt: r.updated_at,
    isArchived: r.archived,
  });

  return {
    source: 'rest' as const,
    user: {
      name: user.name,
      login: user.login,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      url: user.html_url,
      company: user.company,
      location: user.location,
      twitterUsername: user.twitter_username,
      websiteUrl: user.blog,
      createdAt: user.created_at,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      organizations: [],
    },
    // No pinned-repo API in REST — best substitute is just the top starred repos.
    pinnedRepos: repos.slice(0, 6).map(repoCard),
    topRepos: repos.slice(0, 8).map(repoCard),
    totalStars,
    languages,
    contributions,
    streaks,
  };
}

// ── Route handler ────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  try {
    const data = GITHUB_TOKEN ? await fetchViaGraphQL(username) : await fetchViaRest(username);
    return NextResponse.json(data);
  } catch (err) {
    // If GraphQL fails for any reason (bad/expired token, rate limit, etc.),
    // don't just error out — fall back to the REST path so the page still works.
    if (GITHUB_TOKEN) {
      try {
        const data = await fetchViaRest(username);
        return NextResponse.json(data);
      } catch (fallbackErr) {
        return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}