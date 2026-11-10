import { getOctokit, GITHUB_LANG_COLORS } from './github';
import { globalApiCache } from './cache';
import {
  StatGrade,
  ProfileItemData,
  PinnedProjectItem,
  PinnedProjectsItemData,
  LanguagesItemData,
  GradedMetricItemData,
  OverallItemData,
  StreakMetricItemData,
  ContributionsItemData,
  UserOverviewStats,
  UserStreakStats,
  UserCommitStats,
  UserLanguageStats,
  UserActivityStats,
  DeveloperRank,
  UnifiedGitHubStats,
  FullCanvasData,
} from '@/types/stats';

export function clearUserCache(username?: string): void {
  if (!username) {
    globalApiCache.clear();
    return;
  }
  globalApiCache.deletePrefix(username);
}

// In-flight GraphQL promise coalescing to prevent duplicate concurrent queries
const inflightGraphQL = new Map<string, Promise<any>>();

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export interface CalendarDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

// ==========================================================
// GRADING SYSTEM FOR INDIVIDUAL ITEMS (S, A, B, C, D)
// ==========================================================

export function gradeCommits(commits: number): StatGrade {
  if (commits >= 200) return 'S';
  if (commits >= 100) return 'A';
  if (commits >= 40) return 'B';
  if (commits >= 10) return 'C';
  return 'D';
}

export function gradePRs(prs: number): StatGrade {
  if (prs >= 25) return 'S';
  if (prs >= 10) return 'A';
  if (prs >= 4) return 'B';
  if (prs >= 1) return 'C';
  return 'D';
}

export function gradeIssues(issues: number): StatGrade {
  if (issues >= 20) return 'S';
  if (issues >= 8) return 'A';
  if (issues >= 3) return 'B';
  if (issues >= 1) return 'C';
  return 'D';
}

export function gradeStars(stars: number): StatGrade {
  if (stars >= 50) return 'S';
  if (stars >= 15) return 'A';
  if (stars >= 5) return 'B';
  if (stars >= 1) return 'C';
  return 'D';
}

export function gradeRepos(repos: number): StatGrade {
  if (repos >= 25) return 'S';
  if (repos >= 15) return 'A';
  if (repos >= 8) return 'B';
  if (repos >= 3) return 'C';
  return 'D';
}

export function gradePolyglot(langCount: number): StatGrade {
  if (langCount >= 12) return 'S';
  if (langCount >= 9) return 'A';
  if (langCount >= 6) return 'B';
  if (langCount >= 3) return 'C';
  return 'D';
}

const GRADE_POINTS: Record<StatGrade, number> = {
  S: 5,
  A: 4,
  B: 3,
  C: 2,
  D: 1,
};

export function computeOverallGrade(grades: StatGrade[]): {
  grade: StatGrade;
  score: number;
} {
  if (grades.length === 0) return { grade: 'C', score: 50 };
  const totalPoints = grades.reduce((sum, g) => sum + (GRADE_POINTS[g] || 1), 0);
  const avg = totalPoints / grades.length;
  const score = Math.round((avg / 5) * 100);

  if (avg >= 4.5) return { grade: 'S', score };
  if (avg >= 3.6) return { grade: 'A', score };
  if (avg >= 2.8) return { grade: 'B', score };
  if (avg >= 1.8) return { grade: 'C', score };
  return { grade: 'D', score };
}

// ==========================================================
// CORE NATIVE GITHUB GRAPHQL FETCHER
// ==========================================================

export async function fetchUserRawGraphQL(
  username: string,
  token?: string,
  forceRefresh = false
) {
  const key = `raw_graphql_${username.toLowerCase()}`;
  if (forceRefresh) {
    globalApiCache.deletePrefix(username);
  } else {
    const cached = globalApiCache.get(key);
    if (cached) return cached;
  }

  const existingPromise = !forceRefresh ? inflightGraphQL.get(key) : undefined;
  if (existingPromise) return existingPromise;

  const promise = (async () => {
    try {
      const octokit = getOctokit(token);
      const query = `
        query($login: String!) {
          user(login: $login) {
            name
            login
            avatarUrl
            bio
            company
            location
            websiteUrl
            twitterUsername
            createdAt
            url
            followers { totalCount }
            following { totalCount }
            gists(privacy: ALL) { totalCount }
            pinnedItems(first: 6, types: [REPOSITORY]) {
              nodes {
                ... on Repository {
                  name
                  description
                  url
                  homepageUrl
                  stargazerCount
                  forkCount
                  primaryLanguage {
                    name
                    color
                  }
                }
              }
            }
            repositories(
              first: 100
              ownerAffiliations: OWNER
              isFork: false
              orderBy: { field: STARGAZERS, direction: DESC }
            ) {
              totalCount
              nodes {
                name
                description
                stargazerCount
                forkCount
                url
                homepageUrl
                primaryLanguage {
                  name
                  color
                }
                languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                  edges {
                    size
                    node {
                      name
                      color
                    }
                  }
                }
              }
            }
            contributionsCollection {
              contributionYears
              totalCommitContributions
              restrictedContributionsCount
              totalPullRequestContributions
              totalIssueContributions
              totalPullRequestReviewContributions
              totalRepositoriesWithContributedCommits
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                    weekday
                  }
                }
              }
            }
          }
        }
      `;

      const response: any = await octokit.graphql(query, { login: username });
      if (!response?.user) {
        throw new Error(`GitHub user '${username}' not found.`);
      }
      globalApiCache.set(key, response.user);
      return response.user;
    } finally {
      inflightGraphQL.delete(key);
    }
  })();

  inflightGraphQL.set(key, promise);
  return promise;
}

/**
 * Fetch lifetime commits across all contribution years in a single GraphQL request
 */
export async function fetchLifetimeCommits(
  username: string,
  years: number[],
  token?: string,
  forceRefresh = false
): Promise<{ totalLifetimeCommits: number; restrictedLifetimeCommits: number }> {
  if (!years || years.length === 0) {
    return { totalLifetimeCommits: 0, restrictedLifetimeCommits: 0 };
  }

  const cacheKey = `lifetime_commits_${username.toLowerCase()}`;
  if (!forceRefresh) {
    const cached = globalApiCache.get<{ totalLifetimeCommits: number; restrictedLifetimeCommits: number }>(cacheKey);
    if (cached) return cached;
  }

  const aliases = years
    .map(
      (y) => `
    year_${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${y}-12-31T23:59:59Z") {
      totalCommitContributions
      restrictedContributionsCount
    }
  `
    )
    .join('\n');

  const fullQuery = `
    query($login: String!) {
      user(login: $login) {
        ${aliases}
      }
    }
  `;

  try {
    const octokit = getOctokit(token);
    const multiRes: any = await octokit.graphql(fullQuery, { login: username });
    let total = 0;
    let restricted = 0;

    for (const y of years) {
      const yearData = multiRes?.user?.[`year_${y}`];
      if (yearData) {
        total += yearData.totalCommitContributions || 0;
        restricted += yearData.restrictedContributionsCount || 0;
      }
    }

    const result = {
      totalLifetimeCommits: total + restricted,
      restrictedLifetimeCommits: restricted,
    };
    globalApiCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error('Failed to query lifetime commits aliases:', err);
    return { totalLifetimeCommits: 0, restrictedLifetimeCommits: 0 };
  }
}

/**
 * Helper to fetch and base64-encode avatar image
 */
export async function fetchAvatarBase64(
  username: string,
  avatarUrl: string,
  forceRefresh = false
): Promise<string | undefined> {
  if (!avatarUrl) return undefined;
  const avatarCacheKey = `avatar_b64_${username.toLowerCase()}`;
  if (!forceRefresh) {
    const cached = globalApiCache.get<string>(avatarCacheKey);
    if (cached) return cached;
  }

  try {
    const res = await fetch(`${avatarUrl}&s=160`);
    if (res.ok) {
      const buf = await res.arrayBuffer();
      const contentType = res.headers.get('content-type') || 'image/png';
      const b64 = `data:${contentType};base64,${Buffer.from(buf).toString('base64')}`;
      globalApiCache.set(avatarCacheKey, b64);
      return b64;
    }
  } catch (_) {}
  return undefined;
}

// ==========================================================
// PURE DATA EXTRACTORS FROM RAW GRAPHQL USER
// ==========================================================

export function extractProfileFromUser(
  user: any,
  avatarBase64?: string
): ProfileItemData {
  return {
    item: 'profile',
    username: user.login,
    name: user.name ?? user.login,
    avatarUrl: user.avatarUrl,
    avatarBase64,
    bio: user.bio ?? null,
    company: user.company ?? null,
    location: user.location ?? null,
    email: user.email || null,
    blog: user.websiteUrl || null,
    twitterUsername: user.twitterUsername || null,
    followers: user.followers?.totalCount ?? 0,
    following: user.following?.totalCount ?? 0,
    createdAt: user.createdAt,
    htmlUrl: user.url,
  };
}

export function extractPinnedProjectsFromUser(user: any): PinnedProjectItem[] {
  const pinnedNodes: any[] = (user.pinnedItems?.nodes || []).filter(Boolean);
  const allRepoNodes: any[] = (user.repositories?.nodes || []).filter(Boolean);

  const projectsList =
    pinnedNodes.length > 0 ? pinnedNodes.slice(0, 6) : allRepoNodes.slice(0, 4);

  return projectsList.map((r) => {
    const langName = r.primaryLanguage?.name || null;
    const langColor =
      r.primaryLanguage?.color ||
      (langName ? GITHUB_LANG_COLORS[langName] : null) ||
      '#8b949e';
    return {
      name: r.name,
      description: r.description ?? null,
      url: r.url,
      homepageUrl: r.homepageUrl || null,
      stars: r.stargazerCount ?? 0,
      forks: r.forkCount ?? 0,
      language: langName,
      languageColor: langColor,
    };
  });
}

export function extractLanguagesFromUser(user: any): LanguagesItemData {
  const repoNodes: any[] = user.repositories?.nodes || [];
  const languageBytes: Record<string, number> = {};
  const languageColors: Record<string, string> = {};

  for (const repo of repoNodes) {
    const edges = repo.languages?.edges || [];
    for (const edge of edges) {
      const langName = edge?.node?.name;
      const size = edge?.size || 0;
      if (langName && size > 0) {
        languageBytes[langName] = (languageBytes[langName] || 0) + size;
        if (edge.node.color) {
          languageColors[langName] = edge.node.color;
        }
      }
    }
  }

  const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);

  const sortedLangs = Object.entries(languageBytes)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage:
        totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
      color: languageColors[name] || GITHUB_LANG_COLORS[name] || '#8b949e',
    }))
    .sort((a, b) => b.bytes - a.bytes);

  return {
    item: 'languages',
    username: user.login,
    languages: sortedLangs,
    totalBytes,
    totalLanguagesCount: sortedLangs.length,
  };
}

export function extractCommitsFromUser(
  user: any,
  lifetime?: { totalLifetimeCommits: number; restrictedLifetimeCommits: number }
): GradedMetricItemData {
  const cc = user.contributionsCollection;
  const pastYearCommits =
    (cc?.totalCommitContributions || 0) +
    (cc?.restrictedContributionsCount || 0);

  const value = lifetime
    ? Math.max(pastYearCommits, lifetime.totalLifetimeCommits)
    : pastYearCommits;

  return {
    item: 'commits',
    username: user.login,
    label: 'commits',
    value,
    grade: gradeCommits(value),
  };
}

export function extractPRsFromUser(user: any): GradedMetricItemData {
  const value = user.contributionsCollection?.totalPullRequestContributions || 0;
  return {
    item: 'prs',
    username: user.login,
    label: 'PR',
    value,
    grade: gradePRs(value),
  };
}

export function extractIssuesFromUser(user: any): GradedMetricItemData {
  const value = user.contributionsCollection?.totalIssueContributions || 0;
  return {
    item: 'issues',
    username: user.login,
    label: 'issues',
    value,
    grade: gradeIssues(value),
  };
}

export function extractStarsFromUser(user: any): GradedMetricItemData {
  const repos = user.repositories?.nodes || [];
  const value = repos.reduce(
    (acc: number, r: any) => acc + (r.stargazerCount || 0),
    0
  );
  return {
    item: 'stars',
    username: user.login,
    label: 'stars earned',
    value,
    grade: gradeStars(value),
  };
}

export function extractReposFromUser(user: any): GradedMetricItemData {
  const value = user.repositories?.totalCount ?? 0;
  return {
    item: 'repos',
    username: user.login,
    label: 'Repos',
    value,
    grade: gradeRepos(value),
  };
}

export function extractPolyglotFromLanguages(
  langsData: LanguagesItemData
): GradedMetricItemData {
  const value = langsData.totalLanguagesCount;
  return {
    item: 'polyglot',
    username: langsData.username,
    label: 'Polyglot',
    value,
    grade: gradePolyglot(value),
  };
}

/**
 * Robust Streak calculation from calendar days.
 * Correctly accounts for future placeholder days that GitHub appends to finish the current week.
 */
export function calculateStreakStats(days: CalendarDay[]): UserStreakStats {
  if (!days || days.length === 0) {
    return {
      currentStreak: { days: 0, startDate: null, endDate: null, isActiveToday: false },
      longestStreak: { days: 0, startDate: null, endDate: null },
      totalActiveDays: 0,
      totalContributionsPastYear: 0,
      completionRate: 0,
      todayContributions: 0,
    };
  }

  let longestStreak = 0;
  let longestStreakStart: string | null = null;
  let longestStreakEnd: string | null = null;

  let tempStreak = 0;
  let tempStreakStart: string | null = null;

  // Calculate longest streak and active days across all calendar days
  let activeDays = 0;
  let totalContributions = 0;

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const count = day.contributionCount || 0;
    if (count > 0) {
      activeDays++;
      totalContributions += count;
      if (tempStreak === 0) {
        tempStreakStart = day.date;
      }
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStreakStart = tempStreakStart;
        longestStreakEnd = day.date;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Find the current active streak.
  // GitHub returns calendar weeks up to Saturday. Find the most recent day <= todayUtc,
  // or the latest day with recorded contributions (for users in ahead timezones).
  const now = new Date();
  const todayUtc = now.toISOString().slice(0, 10);

  let todayIdx = -1;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].date <= todayUtc || (days[i].contributionCount || 0) > 0) {
      todayIdx = i;
      break;
    }
  }
  if (todayIdx === -1) {
    todayIdx = days.length - 1;
  }

  const todayDay = days[todayIdx];
  const yesterdayDay = todayIdx > 0 ? days[todayIdx - 1] : null;

  let currentStreak = 0;
  let currentStreakStart: string | null = null;
  let currentStreakEnd: string | null = null;

  let startIndex = -1;
  if (todayDay && todayDay.contributionCount > 0) {
    startIndex = todayIdx;
  } else if (yesterdayDay && yesterdayDay.contributionCount > 0) {
    startIndex = todayIdx - 1;
  }

  if (startIndex !== -1) {
    currentStreakEnd = days[startIndex].date;
    for (let i = startIndex; i >= 0; i--) {
      if (days[i].contributionCount > 0) {
        currentStreak++;
        currentStreakStart = days[i].date;
      } else {
        break;
      }
    }
  }

  return {
    currentStreak: {
      days: currentStreak,
      startDate: currentStreakStart,
      endDate: currentStreakEnd,
      isActiveToday: todayDay ? todayDay.contributionCount > 0 : false,
    },
    longestStreak: {
      days: longestStreak,
      startDate: longestStreakStart,
      endDate: longestStreakEnd,
    },
    totalActiveDays: activeDays,
    totalContributionsPastYear: totalContributions,
    completionRate: days.length > 0 ? Math.round((activeDays / days.length) * 100) : 0,
    todayContributions: todayDay?.contributionCount || 0,
  };
}

export function extractStreakStatsFromCalendar(calendar: any): UserStreakStats {
  const weeks = calendar?.weeks || [];
  const days: CalendarDay[] = weeks.flatMap((w: any) => w.contributionDays || []);
  return calculateStreakStats(days);
}

export function extractContributionsFromCalendar(
  calendar: any,
  username: string
): ContributionsItemData {
  const totalCommits = calendar?.totalContributions ?? 0;
  const weeks = calendar?.weeks ?? [];
  return {
    item: 'contributions',
    username,
    label: 'contributions last year',
    totalCommits,
    rightLabel: `${totalCommits} contributions`,
    weeks,
  };
}

// ==========================================================
// SEPARATE ITEM FETCHERS (For direct item endpoints)
// ==========================================================

export async function fetchProfileItem(
  username: string,
  token?: string,
  includeBase64Avatar = false,
  forceRefresh = false
): Promise<ProfileItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const avatarBase64 = includeBase64Avatar
    ? await fetchAvatarBase64(username, user.avatarUrl, forceRefresh)
    : undefined;
  return extractProfileFromUser(user, avatarBase64);
}

export async function fetchPinnedProjectsItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<PinnedProjectsItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  return {
    item: 'pinned',
    username: user.login,
    projects: extractPinnedProjectsFromUser(user),
  };
}

export async function fetchSingleProjectItem(
  username: string,
  index = 0,
  repoName?: string | null,
  token?: string,
  forceRefresh = false
): Promise<PinnedProjectItem> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const pinnedNodes: any[] = (user.pinnedItems?.nodes || []).filter(Boolean);
  const allRepoNodes: any[] = (user.repositories?.nodes || []).filter(Boolean);

  if (repoName) {
    const targetName = repoName.toLowerCase();
    const match =
      pinnedNodes.find((r) => r?.name?.toLowerCase() === targetName) ||
      allRepoNodes.find((r) => r?.name?.toLowerCase() === targetName);

    if (match) {
      const langName = match.primaryLanguage?.name || null;
      const langColor =
        match.primaryLanguage?.color ||
        (langName ? GITHUB_LANG_COLORS[langName] : null) ||
        '#8b949e';
      return {
        name: match.name,
        description: match.description ?? null,
        url: match.url,
        homepageUrl: match.homepageUrl || null,
        stars: match.stargazerCount ?? 0,
        forks: match.forkCount ?? 0,
        language: langName,
        languageColor: langColor,
      };
    }

    try {
      const octokit = getOctokit(token);
      const res = await octokit.rest.repos.get({
        owner: username,
        repo: repoName,
      });
      const langName = res.data.language || null;
      return {
        name: res.data.name,
        description: res.data.description ?? null,
        url: res.data.html_url,
        homepageUrl: res.data.homepage || null,
        stars: res.data.stargazers_count ?? 0,
        forks: res.data.forks_count ?? 0,
        language: langName,
        languageColor:
          (langName ? GITHUB_LANG_COLORS[langName] : null) || '#8b949e',
      };
    } catch (_) {}
  }

  const pinned = extractPinnedProjectsFromUser(user);
  return (
    pinned[index] || {
      name: repoName || `Project ${index + 1}`,
      description: 'Open-source repository on GitHub.',
      url: `https://github.com/${username}`,
      homepageUrl: null,
      stars: 0,
      forks: 0,
      language: 'Code',
      languageColor: '#8b949e',
    }
  );
}

export async function fetchLanguagesItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<LanguagesItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  return extractLanguagesFromUser(user);
}

export async function fetchCommitsItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<GradedMetricItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const years: number[] = user.contributionsCollection?.contributionYears || [];
  const lifetime = await fetchLifetimeCommits(username, years, token, forceRefresh);
  return extractCommitsFromUser(user, lifetime);
}

export async function fetchPRsItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<GradedMetricItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  return extractPRsFromUser(user);
}

export async function fetchIssuesItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<GradedMetricItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  return extractIssuesFromUser(user);
}

export async function fetchStarsItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<GradedMetricItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  return extractStarsFromUser(user);
}

export async function fetchReposItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<GradedMetricItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  return extractReposFromUser(user);
}

export async function fetchPolyglotItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<GradedMetricItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const langsData = extractLanguagesFromUser(user);
  return extractPolyglotFromLanguages(langsData);
}

export async function fetchOverallItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<OverallItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const years: number[] = user.contributionsCollection?.contributionYears || [];
  const lifetime = await fetchLifetimeCommits(username, years, token, forceRefresh);

  const commits = extractCommitsFromUser(user, lifetime);
  const prs = extractPRsFromUser(user);
  const issues = extractIssuesFromUser(user);
  const stars = extractStarsFromUser(user);
  const repos = extractReposFromUser(user);
  const langsData = extractLanguagesFromUser(user);
  const polyglot = extractPolyglotFromLanguages(langsData);

  const breakdown = {
    commits: commits.grade,
    prs: prs.grade,
    issues: issues.grade,
    stars: stars.grade,
    repos: repos.grade,
    polyglot: polyglot.grade,
  };

  const { grade, score } = computeOverallGrade(Object.values(breakdown));

  return {
    item: 'overall',
    username: user.login,
    label: 'overall',
    grade,
    score,
    breakdown,
  };
}

export async function fetchStreakItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<StreakMetricItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const stats = extractStreakStatsFromCalendar(user.contributionsCollection?.contributionCalendar);

  return {
    item: 'streak',
    username: user.login,
    label: 'streak',
    value: stats.currentStreak.days,
    unit: 'days',
    formatted: `${stats.currentStreak.days} days`,
    startDate: stats.currentStreak.startDate,
    endDate: stats.currentStreak.endDate,
    isActiveToday: stats.currentStreak.isActiveToday,
  };
}

export async function fetchLongestStreakItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<StreakMetricItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const stats = extractStreakStatsFromCalendar(user.contributionsCollection?.contributionCalendar);

  return {
    item: 'longest-streak',
    username: user.login,
    label: 'longest streak',
    value: stats.longestStreak.days,
    unit: 'days',
    formatted: `${stats.longestStreak.days}`,
    startDate: stats.longestStreak.startDate,
    endDate: stats.longestStreak.endDate,
  };
}

export async function fetchActiveDaysItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<StreakMetricItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const stats = extractStreakStatsFromCalendar(user.contributionsCollection?.contributionCalendar);

  return {
    item: 'active-days',
    username: user.login,
    label: 'active days this year',
    value: stats.totalActiveDays,
    unit: 'days',
    formatted: `${stats.totalActiveDays} days`,
  };
}

export async function fetchContributionsItem(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<ContributionsItemData> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  return extractContributionsFromCalendar(user.contributionsCollection?.contributionCalendar, user.login);
}

// ==========================================================
// LEGACY / AGGREGATE HELPERS (Kept for backward compatibility)
// ==========================================================

export async function fetchUserOverviewStats(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<UserOverviewStats> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const repos = user.repositories?.nodes || [];

  const totalStarsEarned = repos.reduce(
    (acc: number, r: any) => acc + (r.stargazerCount || 0),
    0
  );
  const totalForksEarned = repos.reduce(
    (acc: number, r: any) => acc + (r.forkCount || 0),
    0
  );

  const topRepo = repos.length > 0 ? repos[0] : null;
  const createdDate = new Date(user.createdAt);
  const ageYears = Math.max(
    0.1,
    Math.round(
      ((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) * 10
    ) / 10
  );

  return {
    username: user.login,
    name: user.name ?? null,
    avatarUrl: user.avatarUrl,
    bio: user.bio ?? null,
    company: user.company ?? null,
    location: user.location ?? null,
    publicRepos: user.repositories?.totalCount ?? 0,
    totalStarsEarned,
    totalForksEarned,
    followers: user.followers?.totalCount ?? 0,
    following: user.following?.totalCount ?? 0,
    publicGists: user.gists?.totalCount ?? 0,
    createdAt: user.createdAt,
    accountAgeYears: ageYears,
    topStarredRepo: topRepo
      ? {
          name: topRepo.name,
          stars: topRepo.stargazerCount,
          url: topRepo.url,
        }
      : null,
    htmlUrl: user.url,
  };
}

export async function fetchUserStreakStats(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<UserStreakStats> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  return extractStreakStatsFromCalendar(user.contributionsCollection?.contributionCalendar);
}

export async function fetchUserCommitStats(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<UserCommitStats> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const cc = user.contributionsCollection;
  const years: number[] = cc?.contributionYears || [];

  const pastYearCommits =
    (cc?.totalCommitContributions || 0) +
    (cc?.restrictedContributionsCount || 0);

  const lifetime = await fetchLifetimeCommits(username, years, token, forceRefresh);
  const totalLifetime = Math.max(pastYearCommits, lifetime.totalLifetimeCommits);

  const weeks = cc?.contributionCalendar?.weeks || [];
  const days: CalendarDay[] = weeks.flatMap((w: any) => w.contributionDays || []);

  const dayCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const monthCounts: Record<string, number> = {};

  for (const d of days) {
    dayCounts[d.weekday] = (dayCounts[d.weekday] || 0) + d.contributionCount;
    const ym = d.date.slice(0, 7);
    monthCounts[ym] = (monthCounts[ym] || 0) + d.contributionCount;
  }

  const weeklyBreakdown = WEEKDAYS.map((dayName, idx) => ({
    day: dayName,
    count: dayCounts[idx] || 0,
  }));

  let mostActiveDayOfWeek = 'Wednesday';
  let maxDayCount = -1;
  for (const item of weeklyBreakdown) {
    if (item.count > maxDayCount) {
      maxDayCount = item.count;
      mostActiveDayOfWeek = item.day;
    }
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyBreakdown = Object.entries(monthCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ym, count]) => {
      const [yearStr, monthStr] = ym.split('-');
      const mIdx = parseInt(monthStr, 10) - 1;
      return {
        month: monthNames[mIdx] || monthStr,
        year: parseInt(yearStr, 10),
        count,
      };
    });

  return {
    pastYearCommits,
    totalLifetimeCommits: totalLifetime,
    restrictedCommits: lifetime.restrictedLifetimeCommits || (cc?.restrictedContributionsCount || 0),
    averageCommitsPerWeek: Math.round((pastYearCommits / 52) * 10) / 10,
    mostActiveDayOfWeek,
    weeklyBreakdown,
    monthlyBreakdown,
  };
}

export async function fetchUserLanguageStats(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<UserLanguageStats> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const data = extractLanguagesFromUser(user);
  const repoNodes = user.repositories?.nodes || [];
  const repoCounts: Record<string, number> = {};
  for (const r of repoNodes) {
    if (r.primaryLanguage?.name) {
      repoCounts[r.primaryLanguage.name] = (repoCounts[r.primaryLanguage.name] || 0) + 1;
    }
  }
  return {
    languages: data.languages,
    totalBytes: data.totalBytes,
    topLanguage: data.languages.length > 0 ? data.languages[0].name : null,
    primaryLanguageRepoCounts: repoCounts,
  };
}

export async function fetchUserActivityStats(
  username: string,
  token?: string,
  forceRefresh = false
): Promise<UserActivityStats> {
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);
  const cc = user.contributionsCollection;
  const weeks = cc?.contributionCalendar?.weeks || [];
  const days: CalendarDay[] = weeks.flatMap((w: any) => w.contributionDays || []);

  let weekendCount = 0;
  let weekdayCount = 0;
  const dayCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  for (const d of days) {
    dayCounts[d.weekday] = (dayCounts[d.weekday] || 0) + d.contributionCount;
    if (d.weekday === 0 || d.weekday === 6) weekendCount += d.contributionCount;
    else weekdayCount += d.contributionCount;
  }

  const total = weekendCount + weekdayCount;
  const weekendRatio = total > 0 ? Math.round((weekendCount / total) * 100) : 0;

  let mostActiveDayOfWeek = 'Wednesday';
  let maxCount = -1;
  for (let i = 0; i < 7; i++) {
    if (dayCounts[i] > maxCount) {
      maxCount = dayCounts[i];
      mostActiveDayOfWeek = WEEKDAYS[i];
    }
  }

  return {
    totalPRs: cc?.totalPullRequestContributions || 0,
    totalIssues: cc?.totalIssueContributions || 0,
    totalReviews: cc?.totalPullRequestReviewContributions || 0,
    contributedRepositoriesCount: cc?.totalRepositoriesWithContributedCommits || 0,
    productivityHabits: {
      mostActiveDayOfWeek,
      isWeekendWarrior: weekendRatio >= 40,
      weekendContributionRatio: weekendRatio,
    },
  };
}

export async function fetchAllGitHubStats(
  username: string,
  options?: { include?: string[]; token?: string; forceRefresh?: boolean }
): Promise<UnifiedGitHubStats> {
  const include = options?.include;
  const token = options?.token;
  const forceRefresh = options?.forceRefresh ?? false;
  const shouldInclude = (item: string) =>
    !include || include.length === 0 || include.includes(item);

  const [overview, streak, commits, languages, activity, overall] =
    await Promise.all([
      shouldInclude('overview') ? fetchUserOverviewStats(username, token, forceRefresh) : Promise.resolve(undefined),
      shouldInclude('streak') ? fetchUserStreakStats(username, token, forceRefresh) : Promise.resolve(undefined),
      shouldInclude('commits') ? fetchUserCommitStats(username, token, forceRefresh) : Promise.resolve(undefined),
      shouldInclude('languages') ? fetchUserLanguageStats(username, token, forceRefresh) : Promise.resolve(undefined),
      shouldInclude('activity') ? fetchUserActivityStats(username, token, forceRefresh) : Promise.resolve(undefined),
      fetchOverallItem(username, token, forceRefresh),
    ]);

  const rank: DeveloperRank = {
    grade: overall.grade === 'D' ? 'C' : overall.grade,
    score: overall.score,
    title: `Grade ${overall.grade}`,
    description: 'Calculated from commits, PRs, issues, stars, repos, and languages.',
  };

  return {
    username,
    fetchedAt: new Date().toISOString(),
    ...(overview && { overview }),
    ...(streak && { streak }),
    ...(commits && { commits }),
    ...(languages && { languages }),
    ...(activity && { activity }),
    rank,
  };
}

/**
 * HIGH-PERFORMANCE UNIFIED FULL CANVAS FETCHER
 * Executes exactly ONE GraphQL query to fetch all core metrics and evaluates them
 * in-memory synchronously. Eliminates 13 redundant asynchronous calls.
 */
export async function fetchFullCanvasData(
  username: string,
  options?: {
    repos?: string[];
    customName?: string | null;
    projectCount?: number;
    token?: string;
    forceRefresh?: boolean;
  }
): Promise<FullCanvasData> {
  const token = options?.token;
  const forceRefresh = options?.forceRefresh ?? false;
  const customRepos = (options?.repos || [])
    .map((r) => r.trim())
    .filter((r) => r.length > 0)
    .slice(0, 6);

  // 1. Fetch raw GraphQL user (or from in-flight/cache)
  const user = await fetchUserRawGraphQL(username, token, forceRefresh);

  // 2. Concurrently fetch lifetime commits, avatar base64, and any custom named repos
  const years: number[] = user.contributionsCollection?.contributionYears || [];
  const [lifetime, avatarBase64, customProjects] = await Promise.all([
    fetchLifetimeCommits(username, years, token, forceRefresh),
    fetchAvatarBase64(username, user.avatarUrl, forceRefresh),
    customRepos.length > 0
      ? Promise.all(
          customRepos.map((repoName, idx) =>
            fetchSingleProjectItem(username, idx, repoName, token, forceRefresh)
          )
        )
      : Promise.resolve(null),
  ]);

  // 3. Synchronously extract all metrics in memory
  const profile = extractProfileFromUser(user, avatarBase64);
  const projects =
    customProjects ||
    extractPinnedProjectsFromUser(user).slice(0, options?.projectCount ?? 6);
  const languages = extractLanguagesFromUser(user);
  const commits = extractCommitsFromUser(user, lifetime);
  const prs = extractPRsFromUser(user);
  const issues = extractIssuesFromUser(user);
  const stars = extractStarsFromUser(user);
  const repos = extractReposFromUser(user);
  const polyglot = extractPolyglotFromLanguages(languages);

  const breakdown = {
    commits: commits.grade,
    prs: prs.grade,
    issues: issues.grade,
    stars: stars.grade,
    repos: repos.grade,
    polyglot: polyglot.grade,
  };
  const { grade, score } = computeOverallGrade(Object.values(breakdown));
  const overall: OverallItemData = {
    item: 'overall',
    username: user.login,
    label: 'overall',
    grade,
    score,
    breakdown,
  };

  const streakStats = extractStreakStatsFromCalendar(
    user.contributionsCollection?.contributionCalendar
  );
  const streak: StreakMetricItemData = {
    item: 'streak',
    username: user.login,
    label: 'streak',
    value: streakStats.currentStreak.days,
    unit: 'days',
    formatted: `${streakStats.currentStreak.days} days`,
    startDate: streakStats.currentStreak.startDate,
    endDate: streakStats.currentStreak.endDate,
    isActiveToday: streakStats.currentStreak.isActiveToday,
  };
  const longestStreak: StreakMetricItemData = {
    item: 'longest-streak',
    username: user.login,
    label: 'longest streak',
    value: streakStats.longestStreak.days,
    unit: 'days',
    formatted: `${streakStats.longestStreak.days}`,
    startDate: streakStats.longestStreak.startDate,
    endDate: streakStats.longestStreak.endDate,
  };
  const activeDays: StreakMetricItemData = {
    item: 'active-days',
    username: user.login,
    label: 'active days this year',
    value: streakStats.totalActiveDays,
    unit: 'days',
    formatted: `${streakStats.totalActiveDays} days`,
  };
  const contributions = extractContributionsFromCalendar(
    user.contributionsCollection?.contributionCalendar,
    user.login
  );

  const effectiveProfile: ProfileItemData = options?.customName?.trim()
    ? { ...profile, name: options.customName.trim() }
    : profile;

  return {
    profile: effectiveProfile,
    projects,
    languages,
    commits,
    prs,
    issues,
    stars,
    repos,
    polyglot,
    overall,
    streak,
    longestStreak,
    activeDays,
    contributions,
  };
}
