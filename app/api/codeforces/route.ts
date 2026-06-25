import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get('handle');

  if (!handle) {
    return NextResponse.json(
      { error: 'handle required' },
      { status: 400 }
    );
  }

  try {
    const [infoRes, ratingRes, statusRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
      fetch(`https://codeforces.com/api/user.rating?handle=${handle}`),
      fetch(`https://codeforces.com/api/user.status?handle=${handle}`),
    ]);

    const [infoData, ratingData, statusData] = await Promise.all([
      infoRes.json(),
      ratingRes.json(),
      statusRes.json(),
    ]);

    const profile = infoData.result?.[0] ?? null;
    const ratingHistory = ratingData.result ?? [];
    const submissions = statusData.result ?? [];

    // -----------------------------
    // Accepted submissions
    // -----------------------------

    const accepted = submissions.filter(
      (sub: any) => sub.verdict === 'OK'
    );

    // -----------------------------
    // Unique solved problems
    // -----------------------------

    const solvedMap = new Map();

    for (const sub of accepted) {
      const problem = sub.problem;

      const key = `${problem.contestId}-${problem.index}`;

      if (!solvedMap.has(key)) {
        solvedMap.set(key, problem);
      }
    }

    const solvedProblems = Array.from(solvedMap.values());

    // -----------------------------
    // Hardest solved
    // -----------------------------

    const hardestSolved = solvedProblems.reduce(
      (best: any, cur: any) => {
        if ((cur.rating ?? 0) > (best?.rating ?? 0)) {
          return cur;
        }

        return best;
      },
      null
    );

    // -----------------------------
    // Problems solved by rating
    // -----------------------------

    const ratingBuckets: Record<number, number> = {};

    for (const problem of solvedProblems) {
      if (!problem.rating) continue;

      ratingBuckets[problem.rating] =
        (ratingBuckets[problem.rating] ?? 0) + 1;
    }

    // -----------------------------
    // Language usage
    // -----------------------------

    const languageUsage: Record<string, number> = {};

    for (const sub of accepted) {
      languageUsage[sub.programmingLanguage] =
        (languageUsage[sub.programmingLanguage] ?? 0) + 1;
    }

    // -----------------------------
    // Recent Accepted
    // -----------------------------

    const recentAccepted = accepted.slice(0, 10);

    return NextResponse.json({
      profile,

      contests: {
        total: ratingHistory.length,
        history: ratingHistory,
      },

      stats: {
        solved: solvedProblems.length,
        submissions: submissions.length,
        accepted: accepted.length,
      },

      hardestSolved,

      ratingBuckets,

      languageUsage,

      recentAccepted,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to fetch Codeforces data' },
      { status: 500 }
    );
  }
}