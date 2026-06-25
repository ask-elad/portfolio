import { NextRequest, NextResponse } from 'next/server';

const QUERY = `
query getUserProfile($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }

  matchedUser(username: $username) {
    username

    profile {
      ranking
    }

    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
  }

  userContestRanking(username: $username) {
    rating
    globalRanking
    attendedContestsCount
    topPercentage
  }
}
`;

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'username required' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
        Origin: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          username,
        },
      }),
    });

    const json = await res.json();

    const data = json.data;

    if (!data) {
      return NextResponse.json(
        { error: 'No data returned' },
        { status: 404 }
      );
    }

    const user = data.matchedUser;
    const contest = data.userContestRanking;

    const solved: Record<string, number> = {};
    const totals: Record<string, number> = {};

    for (const item of user.submitStats.acSubmissionNum) {
      solved[item.difficulty] = item.count;
    }

    for (const item of data.allQuestionsCount) {
      totals[item.difficulty] = item.count;
    }

    const totalSolved =
      (solved.Easy ?? 0) +
      (solved.Medium ?? 0) +
      (solved.Hard ?? 0);

    return NextResponse.json({
      profile: {
        username: user.username,
        ranking: user.profile.ranking,
      },

      contest: {
        rating: contest?.rating ?? null,
        globalRanking: contest?.globalRanking ?? null,
        attended: contest?.attendedContestsCount ?? 0,
        topPercentage: contest?.topPercentage ?? null,
      },

      solved: {
        total: totalSolved,

        easy: solved.Easy ?? 0,
        medium: solved.Medium ?? 0,
        hard: solved.Hard ?? 0,
      },

      totalQuestions: {
        easy: totals.Easy ?? 0,
        medium: totals.Medium ?? 0,
        hard: totals.Hard ?? 0,
      },
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Failed to fetch LeetCode data' },
      { status: 500 }
    );
  }
}