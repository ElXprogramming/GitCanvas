import { NextRequest, NextResponse } from 'next/server';
import { fetchAllGitHubStats } from '@/lib/github-stats';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username')?.trim();
    const forceRefresh =
      searchParams.get('refresh') === 'true' ||
      searchParams.get('cache') === 'false';

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
      forceRefresh,
    });

    const cacheHeader = forceRefresh
      ? 'no-cache, no-store, must-revalidate'
      : 'public, max-age=120, s-maxage=120, stale-while-revalidate=300';

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': cacheHeader,
      },
    });
  } catch (error: any) {
    console.error('Unified GitHub Stats API Error:', error);
    const status = error.status || 500;
    const message = error.message || 'Failed to fetch GitHub stats';
    return NextResponse.json({ error: message }, { status });
  }
}
