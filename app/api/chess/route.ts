export const runtime = 'edge';
export const revalidate = 3600;

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  try {
    const res = await fetch(`https://api.chess.com/pub/player/${username}/stats`, {
      headers: { 'User-Agent': 'portfolio/1.0' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: 'Failed to fetch chess.com data' }, { status: 500 });
  }
}
