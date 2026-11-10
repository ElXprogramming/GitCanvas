import { getOctokit, GITHUB_LANG_COLORS } from './github';
import {
  UserOverviewStats,
  UserStreakStats,
  UserCommitStats,
  UserLanguageStats,
  UserActivityStats,
  DeveloperRank,
  UnifiedGitHubStats,
} from '@/types/stats';

// In-memory cache for API results (10-minute TTL)
interface CacheEntry<T> {
  data: T;
  expiry: number;
}
const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && entry.expiry > Date.now()) {
    return entry.data;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    expiry: Date.now() + CACHE_TTL_MS,
  });
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

interface CalendarDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

/**
 * Calculates current streak, longest streak, active days, and completion rate
 * from GitHub's contribution calendar days.
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

  let currentStreak = 0;
  let currentStreakStart: string | null = null;
  let currentStreakEnd: string | null = null;

  let tempStreak = 0;
  let tempStreakStart: string | null = null;

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    if (day.contributionCount > 0) {
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

  // Calculate current streak walking backwards from today
  const lastIndex = days.length - 1;
  const today = days[lastIndex];
  const yesterday = days.length > 1 ? days[lastIndex - 1] : null;

  let startIndex = -1;
  if (today && today.contributionCount > 0) {
    startIndex = lastIndex;
  } else if (yesterday && yesterday.contributionCount > 0) {
    // If today has no commits yet, the streak is still alive from yesterday
    startIndex = lastIndex - 1;
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

  const activeDays = days.filter((d) => d.contributionCount > 0).length;
  const totalContributions = days.reduce((sum, d) => sum + d.contributionCount, 0);

  return {
    currentStreak: {
      days: currentStreak,
      startDate: currentStreakStart,
      endDate: currentStreakEnd,
      isActiveToday: today ? today.contributionCount > 0 : false,
    },
    longestStreak: {
      days: longestStreak,
      startDate: longestStreakStart,
      endDate: longestStreakEnd,
    },
    totalActiveDays: activeDays,
    totalContributionsPastYear: totalContributions,
    completionRate: days.length > 0 ? Math.round((activeDays / days.length) * 100) : 0,
    todayContributions: today?.contributionCount || 0,
  };
}

/**
 * Calculate developer grade rank (S+, S, A+, A, B+, B, C)
 */
export function calculateDeveloperRank(params: {
  totalLifetimeCommits: number;
  totalStarsEarned: number;
  longestStreak: number;
  totalActiveDays: number;
  publicRepos: number;
  totalPRs: number;
  totalReviews: number;
}): DeveloperRank {
  let score = 0;

  // Commits score (max 30)
  if (params.totalLifetimeCommits >= 5000) score += 30;
  else if (params.totalLifetimeCommits >= 2000) score += 25;
  else if (params.totalLifetimeCommits >= 1000) score += 20;
  else if (params.totalLifetimeCommits >= 500) score += 15;
  else if (params.totalLifetimeCommits >= 100) score += 10;
  else score += Math.min(params.totalLifetimeCommits / 10, 8);

  // Stars score (max 25)
  if (params.totalStarsEarned >= 1000) score += 25;
  else if (params.totalStarsEarned >= 300) score += 22;
  else if (params.totalStarsEarned >= 100) score += 18;
  else if (params.totalStarsEarned >= 25) score += 12;
  else if (params.totalStarsEarned >= 5) score += 6;
  else score += Math.min(params.totalStarsEarned, 4);

  // Consistency & Streak score (max 20)
  if (params.longestStreak >= 60 || params.totalActiveDays >= 200) score += 20;
  else if (params.longestStreak >= 30 || params.totalActiveDays >= 120) score += 16;
  else if (params.longestStreak >= 14 || params.totalActiveDays >= 60) score += 12;
  else if (params.longestStreak >= 7 || params.totalActiveDays >= 25) score += 8;
  else score += Math.min(params.longestStreak, 5);

  // Repositories score (max 15)
  if (params.publicRepos >= 50) score += 15;
  else if (params.publicRepos >= 20) score += 12;
  else if (params.publicRepos >= 10) score += 9;
  else if (params.publicRepos >= 5) score += 6;
  else score += Math.min(params.publicRepos, 4);

  // Collaboration (PRs & Code Reviews) (max 10)
  const collab = params.totalPRs + params.totalReviews * 2;
  if (collab >= 50) score += 10;
  else if (collab >= 20) score += 8;
  else if (collab >= 10) score += 6;
  else if (collab >= 3) score += 4;
  else score += Math.min(collab, 2);

  score = Math.min(Math.round(score), 100);

  if (score >= 90) {
    return {
      grade: 'S+',
      score,
      title: 'Legendary Architect',
      description: 'Exceptional open-source impact, prolific code output, and elite consistency.',
    };
  }
  if (score >= 80) {
    return {
      grade: 'S',
      score,
      title: 'Master Craftsman',
      description: 'Outstanding development velocity with consistent high-volume contributions.',
    };
  }
  if (score >= 70) {
    return {
      grade: 'A+',
      score,
      title: 'Senior Powerhouse',
      description: 'Strong technical footprint with great consistency and repository impact.',
    };
  }
  if (score >= 58) {
    return {
      grade: 'A',
      score,
      title: 'Prolific Builder',
      description: 'Solid commit frequency and steady progress across multiple projects.',
    };
  }
  if (score >= 45) {
    return {
      grade: 'B+',
      score,
      title: 'Active Contributor',
      description: 'Consistent developer with a healthy rhythm of code commits and repos.',
    };
  }
  if (score >= 30) {
    return {
      grade: 'B',
      score,
      title: 'Growing Engineer',
      description: 'Regular activity and steadily expanding project portfolio.',
    };
  }
  return {
    grade: 'C',
    score,
    title: 'Explorer',
    description: 'Starting out or primarily maintaining private repositories.',
  };
}

/**
 * Fetch raw GraphQL data for a user
 */
export async function fetchUserRawGraphQL(username: string, token?: string) {
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
        createdAt
        url
        followers { totalCount }
        following { totalCount }
        gists(privacy: ALL) { totalCount }
        repositories(
          first: 100
          ownerAffiliations: OWNER
          isFork: false
          orderBy: { field: STARGAZERS, direction: DESC }
        ) {
          totalCount
          nodes {
            name
            stargazerCount
            forkCount
            url
            primaryLanguage {
              name
              color
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
  return response.user;
}

/**
 * Fetch lifetime commits across all contribution years in a single GraphQL request
 */
export async function fetchLifetimeCommits(
  username: string,
  years: number[],
  token?: string
): Promise<{ totalLifetimeCommits: number; restrictedLifetimeCommits: number }> {
  if (!years || years.length === 0) {
    return { totalLifetimeCommits: 0, restrictedLifetimeCommits: 0 };
  }

  // Construct aliased query for all available contribution years
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

    return {
      totalLifetimeCommits: total + restricted,
      restrictedLifetimeCommits: restricted,
    };
  } catch (err) {
    console.error('Failed to query lifetime commits aliases:', err);
    return { totalLifetimeCommits: 0, restrictedLifetimeCommits: 0 };
  }
}

/**
 * 1. OVERVIEW STATS
 */
export async function fetchUserOverviewStats(
  username: string,
  token?: string
): Promise<UserOverviewStats> {
  const cacheKey = `stats_overview_${username.toLowerCase()}`;
  const cached = getCached<UserOverviewStats>(cacheKey);
  if (cached) return cached;

  const user = await fetchUserRawGraphQL(username, token);
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

  const overview: UserOverviewStats = {
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

  setCache(cacheKey, overview);
  return overview;
}

/**
 * 2. STREAK STATS
 */
export async function fetchUserStreakStats(
  username: string,
  token?: string
): Promise<UserStreakStats> {
  const cacheKey = `stats_streak_${username.toLowerCase()}`;
  const cached = getCached<UserStreakStats>(cacheKey);
  if (cached) return cached;

  const user = await fetchUserRawGraphQL(username, token);
  const weeks =
    user.contributionsCollection?.contributionCalendar?.weeks || [];
  const days: CalendarDay[] = weeks.flatMap((w: any) => w.contributionDays);

  const streak = calculateStreakStats(days);
  setCache(cacheKey, streak);
  return streak;
}

/**
 * 3. COMMIT STATS
 */
export async function fetchUserCommitStats(
  username: string,
  token?: string
): Promise<UserCommitStats> {
  const cacheKey = `stats_commits_${username.toLowerCase()}`;
  const cached = getCached<UserCommitStats>(cacheKey);
  if (cached) return cached;

  const user = await fetchUserRawGraphQL(username, token);
  const cc = user.contributionsCollection;
  const years: number[] = cc?.contributionYears || [];

  const pastYearCommits =
    (cc?.totalCommitContributions || 0) +
    (cc?.restrictedContributionsCount || 0);

  // Fetch lifetime commits across years
  const lifetime = await fetchLifetimeCommits(username, years, token);
  const totalLifetime = Math.max(pastYearCommits, lifetime.totalLifetimeCommits);

  const weeks = cc?.contributionCalendar?.weeks || [];
  const days: CalendarDay[] = weeks.flatMap((w: any) => w.contributionDays);

  // Group by Day of Week
  const dayCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  // Group by Month (YYYY-MM)
  const monthCounts: Record<string, number> = {};

  for (const d of days) {
    dayCounts[d.weekday] = (dayCounts[d.weekday] || 0) + d.contributionCount;

    const ym = d.date.slice(0, 7); // e.g. '2026-03'
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

  const averageCommitsPerWeek = Math.round((pastYearCommits / 52) * 10) / 10;

  const commits: UserCommitStats = {
    pastYearCommits,
    totalLifetimeCommits: totalLifetime,
    restrictedCommits: lifetime.restrictedLifetimeCommits || (cc?.restrictedContributionsCount || 0),
    averageCommitsPerWeek,
    mostActiveDayOfWeek,
    weeklyBreakdown,
    monthlyBreakdown,
  };

  setCache(cacheKey, commits);
  return commits;
}

/**
 * 4. LANGUAGE STATS
 */
export async function fetchUserLanguageStats(
  username: string,
  token?: string
): Promise<UserLanguageStats> {
  const cacheKey = `stats_langs_${username.toLowerCase()}`;
  const cached = getCached<UserLanguageStats>(cacheKey);
  if (cached) return cached;

  const octokit = getOctokit(token);
  const user = await fetchUserRawGraphQL(username, token);
  const repoNodes = user.repositories?.nodes || [];

  // Primary language repo tally
  const repoCounts: Record<string, number> = {};
  for (const r of repoNodes) {
    if (r.primaryLanguage?.name) {
      repoCounts[r.primaryLanguage.name] = (repoCounts[r.primaryLanguage.name] || 0) + 1;
    }
  }

  // Fetch byte counts from top 12 repositories
  const languageBytes: Record<string, number> = {};
  const targetRepos = repoNodes.slice(0, 12);

  await Promise.all(
    targetRepos.map(async (repo: any) => {
      try {
        const { data } = await octokit.rest.repos.listLanguages({
          owner: username,
          repo: repo.name,
        });
        for (const [lang, bytes] of Object.entries(data)) {
          languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
        }
      } catch (err) {
        if (repo.primaryLanguage?.name) {
          languageBytes[repo.primaryLanguage.name] =
            (languageBytes[repo.primaryLanguage.name] || 0) + 15000;
        }
      }
    })
  );

  // If byte counts are empty, fallback to primary repo counts
  if (Object.keys(languageBytes).length === 0) {
    for (const [lang, count] of Object.entries(repoCounts)) {
      languageBytes[lang] = count * 15000;
    }
  }

  const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);

  const sortedLangs = Object.entries(languageBytes)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
      color: GITHUB_LANG_COLORS[name] || '#8b949e',
    }))
    .sort((a, b) => b.bytes - a.bytes);

  const languageStats: UserLanguageStats = {
    languages: sortedLangs,
    totalBytes,
    topLanguage: sortedLangs.length > 0 ? sortedLangs[0].name : null,
    primaryLanguageRepoCounts: repoCounts,
  };

  setCache(cacheKey, languageStats);
  return languageStats;
}

/**
 * 5. ACTIVITY STATS
 */
export async function fetchUserActivityStats(
  username: string,
  token?: string
): Promise<UserActivityStats> {
  const cacheKey = `stats_activity_${username.toLowerCase()}`;
  const cached = getCached<UserActivityStats>(cacheKey);
  if (cached) return cached;

  const user = await fetchUserRawGraphQL(username, token);
  const cc = user.contributionsCollection;

  const weeks = cc?.contributionCalendar?.weeks || [];
  const days: CalendarDay[] = weeks.flatMap((w: any) => w.contributionDays);

  let weekendCount = 0;
  let weekdayCount = 0;
  const dayCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  for (const d of days) {
    dayCounts[d.weekday] = (dayCounts[d.weekday] || 0) + d.contributionCount;
    if (d.weekday === 0 || d.weekday === 6) {
      weekendCount += d.contributionCount;
    } else {
      weekdayCount += d.contributionCount;
    }
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

  const activityStats: UserActivityStats = {
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

  setCache(cacheKey, activityStats);
  return activityStats;
}

/**
 * 6. ALL-IN-ONE (UNIFIED) STATS
 * Efficiently shares the raw GraphQL user object to avoid redundant network calls!
 */
export async function fetchAllGitHubStats(
  username: string,
  options?: {
    include?: string[];
    token?: string;
  }
): Promise<UnifiedGitHubStats> {
  const include = options?.include;
  const token = options?.token;

  // If specific items requested, run them conditionally
  const shouldInclude = (item: string) => !include || include.length === 0 || include.includes(item);

  // We can fetch in parallel or aggregate
  const [overview, streak, commits, languages, activity] = await Promise.all([
    shouldInclude('overview') ? fetchUserOverviewStats(username, token) : Promise.resolve(undefined),
    shouldInclude('streak') ? fetchUserStreakStats(username, token) : Promise.resolve(undefined),
    shouldInclude('commits') ? fetchUserCommitStats(username, token) : Promise.resolve(undefined),
    shouldInclude('languages') ? fetchUserLanguageStats(username, token) : Promise.resolve(undefined),
    shouldInclude('activity') ? fetchUserActivityStats(username, token) : Promise.resolve(undefined),
  ]);

  // Compute Rank if overview & streak/commits available
  let rank: DeveloperRank | undefined = undefined;
  if (overview && (streak || commits)) {
    rank = calculateDeveloperRank({
      totalLifetimeCommits: commits?.totalLifetimeCommits || overview.publicRepos * 30,
      totalStarsEarned: overview.totalStarsEarned,
      longestStreak: streak?.longestStreak.days || 0,
      totalActiveDays: streak?.totalActiveDays || 0,
      publicRepos: overview.publicRepos,
      totalPRs: activity?.totalPRs || 0,
      totalReviews: activity?.totalReviews || 0,
    });
  }

  const result: UnifiedGitHubStats = {
    username,
    fetchedAt: new Date().toISOString(),
    ...(overview && { overview }),
    ...(streak && { streak }),
    ...(commits && { commits }),
    ...(languages && { languages }),
    ...(activity && { activity }),
    ...(rank && { rank }),
  };

  return result;
}
