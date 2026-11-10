import { NextRequest, NextResponse } from 'next/server';
import {
  fetchProfileItem,
  fetchPinnedProjectsItem,
  fetchLanguagesItem,
  fetchCommitsItem,
  fetchPRsItem,
  fetchIssuesItem,
  fetchStarsItem,
  fetchReposItem,
  fetchPolyglotItem,
  fetchOverallItem,
  fetchStreakItem,
  fetchLongestStreakItem,
  fetchActiveDaysItem,
  fetchContributionsItem,
  fetchUserOverviewStats,
  fetchUserActivityStats,
} from '@/lib/github-stats';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(
  req: NextRequest,
  { params }: { params: { item: string } }
) {
  try {
    const item = params.item?.toLowerCase().trim();
    const { searchParams } = new URL(req.url);
    const username = (
      searchParams.get('username') || searchParams.get('user')
    )?.trim();
    const forceRefresh =
      searchParams.get('refresh') === 'true' ||
      searchParams.get('cache') === 'false';

    if (!username) {
      return NextResponse.json(
        {
          error: 'Username is required',
          usage: `/api/github/stats/${item}?username=<github_username>`,
        },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get('authorization');
    const userToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    let data: any;

    switch (item) {
      case 'profile':
        data = await fetchProfileItem(username, userToken, false, forceRefresh);
        break;
      case 'pinned':
        data = await fetchPinnedProjectsItem(username, userToken, forceRefresh);
        break;
      case 'languages':
        data = await fetchLanguagesItem(username, userToken, forceRefresh);
        break;
      case 'commits':
        data = await fetchCommitsItem(username, userToken, forceRefresh);
        break;
      case 'prs':
      case 'pr':
        data = await fetchPRsItem(username, userToken, forceRefresh);
        break;
      case 'issues':
        data = await fetchIssuesItem(username, userToken, forceRefresh);
        break;
      case 'stars':
        data = await fetchStarsItem(username, userToken, forceRefresh);
        break;
      case 'repos':
        data = await fetchReposItem(username, userToken, forceRefresh);
        break;
      case 'polyglot':
        data = await fetchPolyglotItem(username, userToken, forceRefresh);
        break;
      case 'overall':
        data = await fetchOverallItem(username, userToken, forceRefresh);
        break;
      case 'streak':
        data = await fetchStreakItem(username, userToken, forceRefresh);
        break;
      case 'longest-streak':
        data = await fetchLongestStreakItem(username, userToken, forceRefresh);
        break;
      case 'active-days':
        data = await fetchActiveDaysItem(username, userToken, forceRefresh);
        break;
      case 'contributions':
        data = await fetchContributionsItem(username, userToken, forceRefresh);
        break;
      case 'overview':
        data = await fetchUserOverviewStats(username, userToken, forceRefresh);
        break;
      case 'activity':
        data = await fetchUserActivityStats(username, userToken, forceRefresh);
        break;
      default:
        return NextResponse.json(
          {
            error: `Unknown stat item '${item}'`,
            availableItems: [
              'profile',
              'pinned',
              'languages',
              'commits',
              'prs',
              'issues',
              'stars',
              'repos',
              'polyglot',
              'overall',
              'streak',
              'longest-streak',
              'active-days',
              'contributions',
            ],
          },
          { status: 404 }
        );
    }

    const cacheHeader = forceRefresh
      ? 'no-cache, no-store, must-revalidate'
      : 'public, max-age=120, s-maxage=120, stale-while-revalidate=300';

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': cacheHeader,
      },
    });
  } catch (error: any) {
    console.error(`GitHub Stat Item [${params.item}] API Error:`, error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || `Failed to fetch ${params.item} stat` },
      { status }
    );
  }
}
