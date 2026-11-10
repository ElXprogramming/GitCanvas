import { NextRequest, NextResponse } from 'next/server';
import { fetchUserActivityStats } from '@/lib/github-stats';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username')?.trim();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required', usage: '/api/github/stats/activity?username=<github_username>' },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get('authorization');
    const userToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    const activity = await fetchUserActivityStats(username, userToken);

    return NextResponse.json(activity, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error: any) {
    console.error('GitHub Activity Stats API Error:', error);
    const status = error.status || 500;
    return NextResponse.json({ error: error.message || 'Failed to fetch activity stats' }, { status });
  }
}
