export interface GitHubUserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export interface Repository {
  name: string;
  full_name?: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  homepage?: string | null;
  fork: boolean;
}

export interface LanguageDistribution {
  name: string;
  color: string;
  bytes: number;
  percentage: number;
}

export type ArchetypeId =
  | 'frontend'
  | 'backend'
  | 'ai_data'
  | 'devops'
  | 'fullstack';

export interface DeveloperArchetype {
  id: ArchetypeId;
  label: string;
  tagline: string;
  score: number; // 0 - 100
  dominantLanguages?: string[];
  recommendedTaglines: string[];
  color: string;
  iconName: string;
}

export type BlockId =
  | 'hero'
  | 'bio'
  | 'tech_stack'
  | 'github_stats'
  | 'pinned_projects'
  | 'social_connect'
  | 'streak_trophies';

export type BioTone = 'professional' | 'minimalist' | 'playful' | 'storyteller';
export type BadgeStyle = 'for-the-badge' | 'flat' | 'flat-square' | 'plastic';

export interface TechBadgeItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'languages' | 'tools';
  logo: string;
  logoColor?: string;
  bgColor: string;
  labelColor?: string;
}

export interface HeroSettings {
  greeting: string;
  tagline: string;
  showWave: boolean;
  showCompany?: boolean;
  company?: string;
  showBio?: boolean;
  bio?: string;
}

export interface BioSettings {
  learning: string;
  workingOn: string;
  askMeAbout: string;
  reachMe: string;
  funFact: string;
  openFor: string;
  tone: BioTone;
}

export interface TechStackSettings {
  badgeStyle: BadgeStyle;
  selectedBadges: TechBadgeItem[];
  showCategoryHeaders: boolean;
}

export interface GitHubStatsSettings {
  cardTheme: string;
  cardFont?: string;
  showOverallStats: boolean;
  showTopLangs: boolean;
  showStreak: boolean;
  showActivityGraph: boolean;
}

export interface FeaturedProject {
  name: string;
  description: string;
  url: string;
}

export interface PinnedProjectsSettings {
  featuredProjects: FeaturedProject[];
  useLivePinned?: boolean;
}

export interface ReadmeBlockConfig {
  id: BlockId;
  title: string;
  enabled: boolean;
  settings: any;
}

export interface ThemeConfig {
  cardTheme: string; // e.g. catppuccin_mocha, tokyonight, nord, dracula, radical
  cardFont?: string; // e.g. inter, roboto, open_sans, lato, etc.
}

export * from './stats';
