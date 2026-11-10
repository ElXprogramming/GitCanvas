export type StatGrade = 'S' | 'A' | 'B' | 'C' | 'D';

export type StatItemType =
  | 'profile'
  | 'pinned'
  | 'languages'
  | 'commits'
  | 'prs'
  | 'issues'
  | 'stars'
  | 'repos'
  | 'polyglot'
  | 'overall'
  | 'streak'
  | 'longest-streak'
  | 'active-days'
  | 'contributions';

export interface ProfileItemData {
  item: 'profile';
  username: string;
  name: string | null;
  avatarUrl: string;
  avatarBase64?: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  twitterUsername: string | null;
  followers: number;
  following: number;
  createdAt: string;
  htmlUrl: string;
}

export interface PinnedProjectItem {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string;
}

export interface PinnedProjectsItemData {
  item: 'pinned';
  username: string;
  projects: PinnedProjectItem[];
}

export interface LanguageEntry {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface LanguagesItemData {
  item: 'languages';
  username: string;
  languages: LanguageEntry[];
  totalBytes: number;
  totalLanguagesCount: number;
}

export interface GradedMetricItemData {
  item: 'commits' | 'prs' | 'issues' | 'stars' | 'repos' | 'polyglot';
  username: string;
  label: string;
  value: number;
  grade: StatGrade;
}

export interface OverallItemData {
  item: 'overall';
  username: string;
  label: 'overall';
  grade: StatGrade;
  score: number;
  breakdown: {
    commits: StatGrade;
    prs: StatGrade;
    issues: StatGrade;
    stars: StatGrade;
    repos: StatGrade;
    polyglot: StatGrade;
  };
}

export interface StreakMetricItemData {
  item: 'streak' | 'longest-streak' | 'active-days';
  username: string;
  label: string;
  value: number;
  unit: string;
  formatted: string;
  startDate?: string | null;
  endDate?: string | null;
  isActiveToday?: boolean;
}

export interface ContributionDayItem {
  date: string;
  contributionCount: number;
  weekday: number;
}

export interface ContributionsItemData {
  item: 'contributions';
  username: string;
  label: 'contributions last year';
  totalCommits: number;
  rightLabel: string;
  weeks: {
    contributionDays: ContributionDayItem[];
  }[];
}

export interface FullCanvasData {
  profile: ProfileItemData;
  projects: PinnedProjectItem[];
  languages: LanguagesItemData;
  commits: GradedMetricItemData;
  prs: GradedMetricItemData;
  issues: GradedMetricItemData;
  stars: GradedMetricItemData;
  repos: GradedMetricItemData;
  polyglot: GradedMetricItemData;
  overall: OverallItemData;
  streak: StreakMetricItemData;
  longestStreak: StreakMetricItemData;
  activeDays: StreakMetricItemData;
  contributions: ContributionsItemData;
}

export interface FullCanvasRenderOptions {
  theme?: string | null;
  customName?: string | null;
  tagline?: string | null;
  hideProfile?: boolean;
  socials?: Array<{ type: string; label: string }>;
  sections?: string[];
  hideRows?: string[];
  bio?: {
    workingOn?: string;
    learning?: string;
    askMeAbout?: string;
    funFact?: string;
    focusAreas?: string[];
  };
}


// Legacy compatibility exports for any existing consumers
export interface UserOverviewStats {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  publicRepos: number;
  totalStarsEarned: number;
  totalForksEarned: number;
  followers: number;
  following: number;
  publicGists: number;
  createdAt: string;
  accountAgeYears: number;
  topStarredRepo: {
    name: string;
    stars: number;
    url: string;
  } | null;
  htmlUrl: string;
}

export interface UserStreakStats {
  currentStreak: {
    days: number;
    startDate: string | null;
    endDate: string | null;
    isActiveToday: boolean;
  };
  longestStreak: {
    days: number;
    startDate: string | null;
    endDate: string | null;
  };
  totalActiveDays: number;
  totalContributionsPastYear: number;
  completionRate: number;
  todayContributions: number;
}

export interface UserCommitStats {
  pastYearCommits: number;
  totalLifetimeCommits: number;
  restrictedCommits: number;
  averageCommitsPerWeek: number;
  mostActiveDayOfWeek: string;
  weeklyBreakdown: { day: string; count: number }[];
  monthlyBreakdown: { month: string; year: number; count: number }[];
}

export interface UserLanguageStats {
  languages: LanguageEntry[];
  totalBytes: number;
  topLanguage: string | null;
  primaryLanguageRepoCounts: Record<string, number>;
}

export interface UserActivityStats {
  totalPRs: number;
  totalIssues: number;
  totalReviews: number;
  contributedRepositoriesCount: number;
  productivityHabits: {
    mostActiveDayOfWeek: string;
    isWeekendWarrior: boolean;
    weekendContributionRatio: number;
  };
}

export interface DeveloperRank {
  grade: 'S+' | 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C';
  score: number;
  title: string;
  description: string;
}

export interface UnifiedGitHubStats {
  username: string;
  fetchedAt: string;
  overview?: UserOverviewStats;
  streak?: UserStreakStats;
  commits?: UserCommitStats;
  languages?: UserLanguageStats;
  activity?: UserActivityStats;
  rank?: DeveloperRank;
}
