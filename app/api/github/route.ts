export const runtime = 'edge';
export const revalidate = 3600;

import { NextRequest, NextResponse } from 'next/server';

const PINNED_QUERY = `
  query($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            pushedAt
            primaryLanguage { name color }
          }
        }
      }
    }
  }
`;

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    // REST: user profile + repos + contributions (unchanged)
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=8`, { headers }),
    ]);
    const user  = await userRes.json();
    const repos = await reposRes.json();

    let contributions = null;
    try {
      const cr = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
      if (cr.ok) contributions = await cr.json();
    } catch (_) {}

    // GraphQL: pinned repos — only possible with a token
    let pinnedRepos: any[] = [];
    if (process.env.GITHUB_TOKEN) {
      try {
        const gql = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: PINNED_QUERY, variables: { login: username } }),
        });
        const gqlData = await gql.json();
        pinnedRepos = gqlData?.data?.user?.pinnedItems?.nodes ?? [];
      } catch (_) {}
    }

    return NextResponse.json({
      user,
      repos: Array.isArray(repos) ? repos : [],
      contributions,
      pinnedRepos,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}