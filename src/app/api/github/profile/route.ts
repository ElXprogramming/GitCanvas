import { NextRequest, NextResponse } from 'next/server';
import {
  fetchUserProfile,
  fetchUserRepos,
  fetchUserLanguages,
  analyzeArchetype,
} from '@/lib/github';
import { fetchPinnedProjectsItem, clearUserCache } from '@/lib/github-stats';

// Force dynamic server route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// In-memory cache for GitHub API responses (60s TTL)
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username')?.trim();
    const forceRefresh =
      searchParams.get('refresh') === 'true' ||
      searchParams.get('cache') === 'false';

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const cacheKey = username.toLowerCase();
    if (!forceRefresh) {
      const cached = cache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        return NextResponse.json({ ...cached.data, cached: true });
      }
    } else {
      cache.delete(cacheKey);
      clearUserCache(username);
    }

    // Check for user-provided authorization or server environment token
    const authHeader = req.headers.get('authorization');
    const userToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    // Fetch user profile, repos, and actual pinned projects in parallel
    const [profile, repos, pinnedData] = await Promise.all([
      fetchUserProfile(username, userToken),
      fetchUserRepos(username, userToken),
      fetchPinnedProjectsItem(username, userToken, forceRefresh),
    ]);

    // Fetch language breakdown
    const languages = await fetchUserLanguages(username, repos, userToken);

    // Analyze developer archetype
    const archetype = analyzeArchetype(languages, repos, profile.bio);

    const result = {
      profile,
      repos,
      pinnedProjects: pinnedData.projects,
      languages,
      archetype,
    };

    cache.set(cacheKey, {
      data: result,
      expiry: Date.now() + CACHE_TTL_MS,
    });

    const cacheHeader = forceRefresh
      ? 'no-cache, no-store, must-revalidate'
      : 'public, max-age=120, s-maxage=120, stale-while-revalidate=300';

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': cacheHeader,
      },
    });
  } catch (error: any) {
    console.error('GitHub Profile API Error:', error);
    const status = error.status || 500;
    const message =
      error.message ||
      'Failed to fetch GitHub profile. Please check the username or token.';
    return NextResponse.json({ error: message }, { status });
  }
}
