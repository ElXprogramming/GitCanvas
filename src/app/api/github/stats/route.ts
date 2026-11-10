import { NextRequest, NextResponse } from 'next/server';
import { fetchAllGitHubStats } from '@/lib/github-stats';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username')?.trim();

    if (!username) {
      return NextResponse.json(
        {
          error: 'Username is required',
          usage: '/api/github/stats?username=<github_username>&include=overview,streak,commits,languages,activity',
        },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get('authorization');
    const userToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    // Optional query parameter to filter sections: e.g. ?include=streak,commits
    const includeParam = searchParams.get('include');
    const include = includeParam
      ? includeParam.split(',').map((s) => s.trim().toLowerCase())
      : undefined;

    const stats = await fetchAllGitHubStats(username, {
      include,
      token: userToken,
    });

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error: any) {
    console.error('Unified GitHub Stats API Error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to fetch GitHub stats';
    return NextResponse.json({ error: message }, { status });
  }
}
