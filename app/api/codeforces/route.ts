export const runtime = 'edge';
export const revalidate = 3600;

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get('handle');
  if (!handle) return NextResponse.json({ error: 'handle required' }, { status: 400 });

  try {
    const [infoRes, ratingRes, statusRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
      fetch(`https://codeforces.com/api/user.rating?handle=${handle}`),
      fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=300`),
    ]);
    const info   = await infoRes.json();
    const rating = await ratingRes.json();
    const status = await statusRes.json();

    // Always return 60 days so the page can slice to any ACTIVITY_DAYS value ≤ 60
    const submissions: any[] = status.result ?? [];
    const now        = Math.floor(Date.now() / 1000);
    const todayStart = now - (now % 86400);
    const MAX_DAYS   = 60;
    const countsByDay: Record<number, number> = {};
    for (const sub of submissions) {
      const dayStart = sub.creationTimeSeconds - (sub.creationTimeSeconds % 86400);
      if (dayStart >= todayStart - (MAX_DAYS - 1) * 86400) {
        countsByDay[dayStart] = (countsByDay[dayStart] ?? 0) + 1;
      }
    }
    const recentActivity = Array.from({ length: MAX_DAYS }, (_, i) => {
      const ts = todayStart - (MAX_DAYS - 1 - i) * 86400;
      return {
        date:  new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: countsByDay[ts] ?? 0,
      };
    });

    return NextResponse.json({
      info:   info.result?.[0]  ?? null,
      rating: rating.result     ?? [],
      recentActivity,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch Codeforces data' }, { status: 500 });
  }
}