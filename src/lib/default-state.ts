import {
  CanvasState,
  GitHubUserProfile,
  DeveloperArchetype,
  LanguageDistribution,
  Repository,
  ReadmeBlockConfig,
  HeroSettings,
  BioSettings,
  TechStackSettings,
  GitHubStatsSettings,
  PinnedProjectsSettings,
  SocialLinksSettings,
  FeaturedProject,
  TechBadgeItem,
} from '@/types';
import { TECH_CATALOG } from './tech-catalog';

export function createDefaultBlocks(
  profile: GitHubUserProfile | null,
  archetype: DeveloperArchetype | null,
  languages: LanguageDistribution[],
  repos: Repository[]
): ReadmeBlockConfig[] {
  const username = profile?.login || 'torvalds';
  const name = profile?.name || username;
  const topLangs = languages.slice(0, 5).map((l) => l.name);

  // Auto-detect tech badges from user's languages and repos
  const matchedBadges: TechBadgeItem[] = [];
  const langLower = new Set(languages.map((l) => l.name.toLowerCase()));
  const allRepoTokens = repos.flatMap((r) => [
    r.name.toLowerCase(),
    (r.description || '').toLowerCase(),
    ...(r.topics || []).map((t) => t.toLowerCase()),
  ]);
  const repoTokenSet = new Set(allRepoTokens);

  for (const item of TECH_CATALOG) {
    const id = item.id.toLowerCase();
    const nameLower = item.name.toLowerCase();
    if (
      langLower.has(nameLower) ||
      langLower.has(id) ||
      repoTokenSet.has(id) ||
      repoTokenSet.has(nameLower)
    ) {
      matchedBadges.push(item);
    }
  }

  // Ensure at least 4-6 high quality badges are populated
  if (matchedBadges.length < 4) {
    const defaults = [
      'typescript',
      'react',
      'nextjs',
      'nodejs',
      'postgresql',
      'docker',
      'git',
    ];
    for (const d of defaults) {
      const found = TECH_CATALOG.find((t) => t.id === d);
      if (found && !matchedBadges.some((b) => b.id === found.id)) {
        matchedBadges.push(found);
      }
    }
  }

  // Pinned/Featured projects from top repos
  const topRepos = repos
    .filter((r) => !r.fork && r.name !== username)
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 4);

  const featuredProjects: FeaturedProject[] = topRepos.map((r) => ({
    name: r.name,
    description:
      r.description || `High-performance ${r.language || 'software'} project.`,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language || 'TypeScript',
    url: r.html_url,
    demoUrl: r.homepage || undefined,
  }));

  // Profile Header block defaults
  const heroSettings: HeroSettings = {
    style: 'minimal',
    greeting: name,
    tagline:
      archetype?.tagline || 'Building software that makes a difference.',
    capsuleType: 'wave',
    capsuleColor: '0:06b6d4,100:3b82f6',
    capsuleHeight: 180,
    typingLines: [
      `Hi, I'm ${name}!`,
      archetype?.label || 'Software Engineer',
      `Focused on ${topLangs.slice(0, 2).join(' & ') || 'Modern Engineering'}`,
    ],
    typingColor: '38bdf8',
    asciiFont: 'standard',
    showWave: false,
  };

  // Bio block defaults
  const bioSettings: BioSettings = {
    workingOn: featuredProjects[0]
      ? `[${featuredProjects[0].name}](${featuredProjects[0].url})`
      : 'Exciting open-source tools',
    learning:
      topLangs.length > 0
        ? `Next-gen patterns in ${topLangs[0]}`
        : 'Distributed systems & modern architecture',
    askMeAbout:
      topLangs.slice(0, 3).join(', ') || 'System design, APIs, and modern web',
    reachMe:
      profile?.blog ||
      (profile?.twitter_username
        ? `@${profile.twitter_username}`
        : 'GitHub Discussions or LinkedIn'),
    openFor: 'Collaborations on open source projects & tech discussions',
    funFact: 'I turn caffeine into clean, tested, and reliable code ☕',
    tone: 'professional',
  };

  // Languages & Tech stack settings
  const techStackSettings: TechStackSettings = {
    badgeStyle: 'for-the-badge',
    selectedBadges: matchedBadges.slice(0, 12),
    showCategoryHeaders: false,
    align: 'left',
  };

  // GitHub Stats settings
  const githubStatsSettings: GitHubStatsSettings = {
    cardTheme: 'default',
    cardProvider: 'standalone',
    showOverallStats: true,
    showTopLangs: true,
    showStreak: true,
    showTrophies: true,
    showActivityGraph: true,
    hideBorder: false,
    layout: 'side-by-side',
    statsIncludeAllCommits: true,
  };

  // Pinned projects settings
  const pinnedProjectsSettings: PinnedProjectsSettings = {
    featuredProjects,
    displayStyle: 'cards',
    showStars: true,
    showForks: true,
  };

  // Social links settings
  const socialSettings: SocialLinksSettings = {
    badgeStyle: 'for-the-badge',
    align: 'right',
    links: {
      github: username,
      linkedin: '',
      twitter: profile?.twitter_username || '',
      portfolio: profile?.blog || '',
      discord: '',
      youtube: '',
      substack: '',
      email: '',
    },
  };

  return [
    {
      id: 'hero',
      title: 'Profile Header Card',
      enabled: true,
      settings: heroSettings,
    },
    {
      id: 'social_connect',
      title: 'Social Header Links',
      enabled: true,
      settings: socialSettings,
    },
    {
      id: 'pinned_projects',
      title: 'Pinned Projects (2x2)',
      enabled: true,
      settings: pinnedProjectsSettings,
    },
    {
      id: 'tech_stack',
      title: 'Languages & Tech Stack',
      enabled: true,
      settings: techStackSettings,
    },
    {
      id: 'github_stats',
      title: 'GitHub Graded Stats',
      enabled: true,
      settings: { ...githubStatsSettings },
    },
    {
      id: 'streak_trophies',
      title: 'Streaks & Contributions',
      enabled: true,
      settings: { ...githubStatsSettings },
    },
    {
      id: 'bio',
      title: 'About Me & AI Bio',
      enabled: false,
      settings: bioSettings,
    },
  ];
}

export function createInitialCanvasState(): CanvasState {
  return {
    profile: null,
    archetype: null,
    languages: [],
    repositories: [],
    blocks: [],
    theme: {
      accentColor: 'cyan',
      cardTheme: 'default',
      badgeStyle: 'for-the-badge',
      layoutTemplate: 'bento',
    },
    status: 'idle',
  };
}
