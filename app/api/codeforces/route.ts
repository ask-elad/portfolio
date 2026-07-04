export const runtime = 'edge';
export const revalidate = 3600;

import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get('handle');
  if (!handle) return NextResponse.json({ error: 'handle required' }, { status: 400 });

  try {
    const [infoRes, ratingRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
      fetch(`https://codeforces.com/api/user.rating?handle=${handle}`),
    ]);
    const info   = await infoRes.json();
    const rating = await ratingRes.json();
    return NextResponse.json({
      info:   info.result?.[0] ?? null,
      rating: rating.result    ?? [],
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch Codeforces data' }, { status: 500 });
  }
}
