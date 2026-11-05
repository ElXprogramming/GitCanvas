import { NextRequest, NextResponse } from 'next/server';
import {
  fetchUserProfile,
  fetchUserRepos,
  fetchUserLanguages,
  analyzeArchetype,
} from '@/lib/github';

// Force dynamic server route
export const dynamic = 'force-dynamic';

// In-memory cache for GitHub API responses (10 min TTL)
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username')?.trim();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const cacheKey = username.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return NextResponse.json({ ...cached.data, cached: true });
    }

    // Check for user-provided authorization or server environment token
    const authHeader = req.headers.get('authorization');
    const userToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    // Fetch user profile
    const profile = await fetchUserProfile(username, userToken);

    // Fetch repositories
    const repos = await fetchUserRepos(username, userToken);

    // Fetch language breakdown
    const languages = await fetchUserLanguages(username, repos, userToken);

    // Analyze developer archetype
    const archetype = analyzeArchetype(languages, repos, profile.bio);

    const result = {
      profile,
      repos,
      languages,
      archetype,
    };

    cache.set(cacheKey, {
      data: result,
      expiry: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('GitHub Profile API Error:', error);
    const status = error.status || 500;
    const message =
      error.message ||
      'Failed to fetch GitHub profile. Please check the username or token.';
    return NextResponse.json({ error: message }, { status });
  }
}
