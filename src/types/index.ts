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
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface Repository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  homepage?: string | null;
  fork: boolean;
  updated_at: string;
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
  description: string;
  score: number; // 0 - 100
  dominantLanguages: string[];
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

export type BannerStyle = 'capsule' | 'typing' | 'ascii' | 'minimal';
export type CapsuleType = 'wave' | 'slice' | 'rect' | 'soft' | 'cylinder' | 'rounded';
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
  style: BannerStyle;
  greeting: string;
  tagline: string;
  capsuleType: CapsuleType;
  capsuleColor: string;
  capsuleHeight: number;
  typingLines: string[];
  typingColor: string;
  asciiFont: string;
  showWave: boolean;
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
  align: 'left' | 'center' | 'right';
}

export interface GitHubStatsSettings {
  cardTheme: string;
  showOverallStats: boolean;
  showTopLangs: boolean;
  showStreak: boolean;
  showTrophies: boolean;
  showActivityGraph: boolean;
  hideBorder: boolean;
  layout: 'side-by-side' | 'stacked';
  statsIncludeAllCommits: boolean;
}

export interface FeaturedProject {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  demoUrl?: string;
}

export interface PinnedProjectsSettings {
  featuredProjects: FeaturedProject[];
  displayStyle: 'table' | 'cards' | 'badges';
  showStars: boolean;
  showForks: boolean;
}

export interface SocialLinksSettings {
  badgeStyle: BadgeStyle;
  align: 'left' | 'center' | 'right';
  links: {
    github: string;
    linkedin: string;
    twitter: string;
    portfolio: string;
    discord: string;
    youtube: string;
    substack: string;
    email: string;
  };
}

export interface ReadmeBlockConfig {
  id: BlockId;
  title: string;
  enabled: boolean;
  settings: any;
}

export type LayoutTemplateId = 'bento' | 'terminal' | 'editorial' | 'classic';

export interface ThemeConfig {
  accentColor: string; // e.g. emerald, cyan, violet, rose, sunset
  cardTheme: string;   // e.g. catppuccin_mocha, tokyonight, nord, dracula, radical
  badgeStyle: BadgeStyle;
  layoutTemplate?: LayoutTemplateId;
}

export interface CanvasState {
  profile: GitHubUserProfile | null;
  archetype: DeveloperArchetype | null;
  languages: LanguageDistribution[];
  repositories: Repository[];
  blocks: ReadmeBlockConfig[];
  theme: ThemeConfig;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}

export interface DeploymentDiff {
  repoExists: boolean;
  existingReadmeContent: string | null;
  newReadmeContent: string;
  repoName: string;
  owner: string;
  sha?: string;
}
