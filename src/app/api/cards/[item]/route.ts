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
  fetchFullCanvasData,
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
  designFullCanvasCard,
} from '@/designs/card-designs';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(
  req: NextRequest,
  { params }: { params: { item: string } }
) {
  try {
    const item = params.item?.toLowerCase().trim();
    const { searchParams } = new URL(req.url);
    const theme = searchParams.get('theme') || 'default';
    const forceRefresh =
      searchParams.get('refresh') === 'true' ||
      searchParams.get('cache') === 'false';

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
      case 'canvas':
      case 'full':
      case 'all': {
        const customName = searchParams.get('name')?.trim() || null;
        const tagline = searchParams.get('tagline')?.trim() || null;

        const reposParam = searchParams.get('repos');
        const customRepos = reposParam
          ? reposParam
              .split(',')
              .map((r) => r.trim())
              .filter(Boolean)
          : undefined;

        const sectionsParam = searchParams.get('sections');
        const sections =
          sectionsParam === 'none'
            ? []
            : sectionsParam
              ? sectionsParam
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              : undefined;

        const socialsParam = searchParams.get('socials');
        const socials =
          socialsParam === 'none'
            ? []
            : socialsParam
              ? socialsParam
                  .split(',')
                  .map((entry) => {
                    const [rawType, ...labelParts] = entry.split(':');
                    const type = (rawType || 'website').trim();
                    const label =
                      labelParts.join(':').trim() ||
                      (type.toLowerCase() === 'linkedin'
                        ? 'LinkedIn'
                        : type.toLowerCase() === 'website'
                          ? 'Portfolio'
                          : type);
                    return { type, label };
                  })
                  .filter((s) => s.type.length > 0)
              : undefined;

        const hideRowsParam = searchParams.get('hide_rows');
        const hideRows = hideRowsParam
          ? hideRowsParam
              .split(',')
              .map((r) => r.trim())
              .filter(Boolean)
          : undefined;

        const bioWork = searchParams.get('bio_work')?.trim();
        const bioLearn = searchParams.get('bio_learn')?.trim();
        const bioAsk = searchParams.get('bio_ask')?.trim();
        const bioFact = searchParams.get('bio_fact')?.trim();
        const bioFocusParam = searchParams.get('bio_focus')?.trim();
        const bioFocus = bioFocusParam
          ? bioFocusParam
              .split(',')
              .map((f) => f.trim())
              .filter(Boolean)
          : undefined;

        const hideProfile =
          searchParams.get('hide_profile') === '1' ||
          searchParams.get('hide_profile') === 'true';

        const fullData = await fetchFullCanvasData(username, {
          repos: customRepos,
          customName,
          token: userToken,
          forceRefresh,
        });

        svg = designFullCanvasCard(fullData, {
          theme,
          customName,
          tagline,
          hideProfile,
          socials,
          sections,
          hideRows,
          bio:
            bioWork || bioLearn || bioAsk || bioFact || bioFocus
              ? {
                  workingOn: bioWork,
                  learning: bioLearn,
                  askMeAbout: bioAsk,
                  funFact: bioFact,
                  focusAreas: bioFocus,
                }
              : undefined,
        });
        break;
      }
      case 'profile': {
        const data = await fetchProfileItem(username, userToken, true, forceRefresh);
        const customName = searchParams.get('name')?.trim();
        const profileToRender = customName ? { ...data, name: customName } : data;
        svg = designProfileCard(profileToRender, theme);
        break;
      }
      case 'project':
      case 'pinned': {
        const index = parseInt(searchParams.get('index') || '0', 10);
        const repoName = searchParams.get('repo')?.trim();
        const customW = searchParams.get('w')
          ? parseInt(searchParams.get('w')!, 10)
          : undefined;
        const customH = searchParams.get('h')
          ? parseInt(searchParams.get('h')!, 10)
          : undefined;
        const project = await fetchSingleProjectItem(
          username,
          index,
          repoName,
          userToken,
          forceRefresh
        );
        svg = designPinnedProjectCard(project, theme, customW, customH);
        break;
      }
      case 'languages': {
        const data = await fetchLanguagesItem(username, userToken, forceRefresh);
        svg = designLanguagesBarCard(data, theme);
        break;
      }
      case 'commits': {
        const data = await fetchCommitsItem(username, userToken, forceRefresh);
        svg = designGradedStatBox(data, theme, 192, 98);
        break;
      }
      case 'prs':
      case 'pr': {
        const data = await fetchPRsItem(username, userToken, forceRefresh);
        svg = designGradedStatBox(data, theme, 192, 98);
        break;
      }
      case 'issues': {
        const data = await fetchIssuesItem(username, userToken, forceRefresh);
        svg = designGradedStatBox(data, theme, 192, 98);
        break;
      }
      case 'stars': {
        const data = await fetchStarsItem(username, userToken, forceRefresh);
        svg = designGradedStatBox(data, theme, 192, 98);
        break;
      }
      case 'repos': {
        const data = await fetchReposItem(username, userToken, forceRefresh);
        svg = designGradedStatBox(data, theme, 258, 104);
        break;
      }
      case 'polyglot': {
        const data = await fetchPolyglotItem(username, userToken, forceRefresh);
        svg = designGradedStatBox(data, theme, 258, 104);
        break;
      }
      case 'overall': {
        const data = await fetchOverallItem(username, userToken, forceRefresh);
        svg = designOverallBox(data, theme, 258, 104);
        break;
      }
      case 'streak': {
        const data = await fetchStreakItem(username, userToken, forceRefresh);
        svg = designStreakBox(data, theme, 258, 104);
        break;
      }
      case 'longest-streak': {
        const data = await fetchLongestStreakItem(username, userToken, forceRefresh);
        svg = designStreakBox(data, theme, 258, 104);
        break;
      }
      case 'active-days': {
        const data = await fetchActiveDaysItem(username, userToken, forceRefresh);
        svg = designStreakBox(data, theme, 258, 104);
        break;
      }
      case 'contributions': {
        const data = await fetchContributionsItem(username, userToken, forceRefresh);
        svg = designContributionsBox(data, theme);
        break;
      }
      default:
        return NextResponse.json(
          { error: `Unknown card item '${item}'` },
          { status: 404 }
        );
    }

    const cacheHeader = forceRefresh
      ? 'no-cache, no-store, must-revalidate'
      : 'public, max-age=120, s-maxage=120, stale-while-revalidate=300';

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': cacheHeader,
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
