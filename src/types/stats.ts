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
  completionRate: number; // Percentage of days with >= 1 contribution in past 365 days
  todayContributions: number;
}

export interface UserCommitStats {
  pastYearCommits: number;
  totalLifetimeCommits: number;
  restrictedCommits: number;
  averageCommitsPerWeek: number;
  mostActiveDayOfWeek: string;
  weeklyBreakdown: {
    day: string;
    count: number;
  }[];
  monthlyBreakdown: {
    month: string;
    year: number;
    count: number;
  }[];
}

export interface UserLanguageStats {
  languages: {
    name: string;
    bytes: number;
    percentage: number;
    color: string;
  }[];
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
  score: number; // 0 - 100
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
