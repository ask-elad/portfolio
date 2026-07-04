export const revalidate = 3600;

import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';


export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
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

    return NextResponse.json({ user, repos: Array.isArray(repos) ? repos : [], contributions });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
