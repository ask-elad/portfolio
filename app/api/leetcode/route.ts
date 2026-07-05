export const runtime = 'edge';
export const revalidate = 3600;

import { NextRequest, NextResponse } from 'next/server';

const QUERY = `
  query getUserProfile($username: String!) {
    allQuestionsCount { difficulty count }
    matchedUser(username: $username) {
      username
      submissionCalendar
      profile { ranking }
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
      }
    }
    userContestRanking(username: $username) {
      rating globalRanking attendedContestsCount topPercentage
    }
  }
`;

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'Origin':  'https://leetcode.com',
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
    });
    const data = await res.json();
    return NextResponse.json(data?.data ?? { error: 'no data returned' });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch LeetCode data' }, { status: 500 });
  }
}