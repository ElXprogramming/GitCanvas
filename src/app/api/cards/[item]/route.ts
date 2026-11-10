import { NextRequest, NextResponse } from 'next/server';
import {
  fetchProfileItem,
  fetchSingleProjectItem,
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
} from '@/lib/github-stats';
import {
  designProfileCard,
  designSocialItemCard,
  designPinnedProjectCard,
  designLanguagesBarCard,
  designGradedStatBox,
  designOverallBox,
  designStreakBox,
  designContributionsBox,
} from '@/designs/card-designs';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { item: string } }
) {
  try {
    const item = params.item?.toLowerCase().trim();
    const { searchParams } = new URL(req.url);
    const theme = searchParams.get('theme') || 'default';

    // Social icon card doesn't require a GitHub API call
    if (item === 'social') {
      const type = searchParams.get('type') || 'website';
      const label = searchParams.get('label') || type;
      const svg = designSocialItemCard(type, label, theme);
      return new NextResponse(svg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control':
            'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    const username = (
      searchParams.get('username') || searchParams.get('user')
    )?.trim();

    if (!username) {
      return NextResponse.json(
        { error: 'username query parameter is required' },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get('authorization');
    const userToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    let svg = '';

    switch (item) {
      case 'profile': {
        const data = await fetchProfileItem(username, userToken, true);
        const customName = searchParams.get('name')?.trim();
        const profileToRender = customName ? { ...data, name: customName } : data;
        svg = designProfileCard(profileToRender, theme);
        break;
      }
      case 'project':
      case 'pinned': {
        const index = parseInt(searchParams.get('index') || '0', 10);
        const repoName = searchParams.get('repo')?.trim();
        const project = await fetchSingleProjectItem(
          username,
          index,
          repoName,
          userToken
        );
        svg = designPinnedProjectCard(project, theme);
        break;
      }
      case 'languages': {
        const data = await fetchLanguagesItem(username, userToken);
        svg = designLanguagesBarCard(data, theme);
        break;
      }
      case 'commits': {
        const data = await fetchCommitsItem(username, userToken);
        svg = designGradedStatBox(data, theme, 192, 98);
        break;
      }
      case 'prs':
      case 'pr': {
        const data = await fetchPRsItem(username, userToken);
        svg = designGradedStatBox(data, theme, 192, 98);
        break;
      }
      case 'issues': {
        const data = await fetchIssuesItem(username, userToken);
        svg = designGradedStatBox(data, theme, 192, 98);
        break;
      }
      case 'stars': {
        const data = await fetchStarsItem(username, userToken);
        svg = designGradedStatBox(data, theme, 192, 98);
        break;
      }
      case 'repos': {
        const data = await fetchReposItem(username, userToken);
        svg = designGradedStatBox(data, theme, 258, 104);
        break;
      }
      case 'polyglot': {
        const data = await fetchPolyglotItem(username, userToken);
        svg = designGradedStatBox(data, theme, 258, 104);
        break;
      }
      case 'overall': {
        const data = await fetchOverallItem(username, userToken);
        svg = designOverallBox(data, theme, 258, 104);
        break;
      }
      case 'streak': {
        const data = await fetchStreakItem(username, userToken);
        svg = designStreakBox(data, theme, 258, 104);
        break;
      }
      case 'longest-streak': {
        const data = await fetchLongestStreakItem(username, userToken);
        svg = designStreakBox(data, theme, 258, 104);
        break;
      }
      case 'active-days': {
        const data = await fetchActiveDaysItem(username, userToken);
        svg = designStreakBox(data, theme, 258, 104);
        break;
      }
      case 'contributions': {
        const data = await fetchContributionsItem(username, userToken);
        svg = designContributionsBox(data, theme);
        break;
      }
      default:
        return NextResponse.json(
          { error: `Unknown card item '${item}'` },
          { status: 404 }
        );
    }

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control':
          'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error(`Card Render [${params.item}] Error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to render item card' },
      { status: 500 }
    );
  }
}
