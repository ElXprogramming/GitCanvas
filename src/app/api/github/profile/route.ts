import { NextRequest, NextResponse } from 'next/server';
import {
  fetchUserProfile,
  fetchUserRepos,
  fetchUserLanguages,
  analyzeArchetype,
} from '@/lib/github';
import {
  fetchUserRawGraphQL,
  fetchPinnedProjectsItem,
  extractProfileFromUser,
  extractPinnedProjectsFromUser,
  extractLanguagesFromUser,
  clearUserCache,
} from '@/lib/github-stats';
import { globalApiCache } from '@/lib/cache';
import { GitHubUserProfile, Repository } from '@/types';

// Force dynamic server route
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
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const cacheKey = `profile_composite_${username.toLowerCase()}`;
    if (!forceRefresh) {
      const cached = globalApiCache.get(cacheKey);
      if (cached) {
        return NextResponse.json({ ...cached, cached: true });
      }
    } else {
      clearUserCache(username);
      globalApiCache.delete(cacheKey);
    }

    // Check for user-provided authorization or server environment token
    const authHeader = req.headers.get('authorization');
    const userToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    let result;

    // Fast path: Ingest full user data via unified GraphQL in a single round-trip
    try {
      const rawUser = await fetchUserRawGraphQL(username, userToken, forceRefresh);
      const profileData = extractProfileFromUser(rawUser);

      const profile: GitHubUserProfile = {
        login: rawUser.login,
        name: profileData.name,
        avatar_url: profileData.avatarUrl,
        bio: profileData.bio,
        company: profileData.company,
        location: profileData.location,
        blog: profileData.blog,
        twitter_username: profileData.twitterUsername,
        public_repos: rawUser.repositories?.totalCount ?? profileData.followers,
        public_gists: rawUser.gists?.totalCount ?? 0,
        followers: profileData.followers,
        following: profileData.following,
        created_at: profileData.createdAt,
        html_url: profileData.htmlUrl,
      };

      const repos: Repository[] = (rawUser.repositories?.nodes || []).map((r: any) => ({
        name: r.name,
        full_name: `${rawUser.login}/${r.name}`,
        description: r.description ?? null,
        html_url: r.url,
        stargazers_count: r.stargazerCount ?? 0,
        forks_count: r.forkCount ?? 0,
        language: r.primaryLanguage?.name ?? null,
        topics: [],
        homepage: r.homepageUrl ?? null,
        fork: false,
        updated_at: '',
      }));

      const pinnedProjects = extractPinnedProjectsFromUser(rawUser);
      const languagesData = extractLanguagesFromUser(rawUser);
      const languages = languagesData.languages;
      const archetype = analyzeArchetype(languages, repos, profile.bio);

      result = {
        profile,
        repos,
        pinnedProjects,
        languages,
        archetype,
      };
    } catch (graphqlError) {
      console.warn('GraphQL profile ingestion failed, falling back to REST APIs:', graphqlError);

      // Fallback: Query REST APIs
      const [profile, repos, pinnedData] = await Promise.all([
        fetchUserProfile(username, userToken),
        fetchUserRepos(username, userToken),
        fetchPinnedProjectsItem(username, userToken, forceRefresh).catch(() => ({ projects: [] })),
      ]);

      const languages = await fetchUserLanguages(username, repos, userToken);
      const archetype = analyzeArchetype(languages, repos, profile.bio);

      result = {
        profile,
        repos,
        pinnedProjects: pinnedData.projects,
        languages,
        archetype,
      };
    }

    globalApiCache.set(cacheKey, result);

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
