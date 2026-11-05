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
  const username = profile?.login || 'octocat';
  const name = profile?.name || username;
  const topLangs = languages.slice(0, 5).map((l) => l.name);

  // Auto-detect tech badges from user's languages and repos
  const matchedBadges: TechBadgeItem[] = [];
  const langLower = new Set(languages.map((l) => l.name.toLowerCase()));
  const allRepoTokens = repos
    .flatMap((r) => [
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
    const defaults = ['typescript', 'react', 'nextjs', 'nodejs', 'postgresql', 'docker', 'git'];
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
    description: r.description || `High-performance ${r.language || 'software'} project.`,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language || 'TypeScript',
    url: r.html_url,
    demoUrl: r.homepage || undefined,
  }));

  // Hero block defaults
  const heroSettings: HeroSettings = {
    style: 'capsule',
    greeting: `Hi there, I'm ${name} 👋`,
    tagline: archetype?.tagline || 'Building software that makes a difference.',
    capsuleType: 'wave',
    capsuleColor: archetype?.id === 'frontend' ? '0:06b6d4,100:3b82f6' :
                  archetype?.id === 'backend' ? '0:8b5cf6,100:6366f1' :
                  archetype?.id === 'ai_data' ? '0:f43f5e,100:fb7185' :
                  archetype?.id === 'devops' ? '0:10b981,100:059669' :
                  '0:f59e0b,100:ef4444',
    capsuleHeight: 180,
    typingLines: [
      `Hi, I'm ${name}!`,
      archetype?.label || 'Software Engineer',
      `Focused on ${topLangs.slice(0, 2).join(' & ') || 'Modern Engineering'}`,
      'Welcome to my GitHub profile!',
    ],
    typingColor: '38bdf8',
    asciiFont: 'standard',
    showWave: true,
  };

  // Bio block defaults
  const bioSettings: BioSettings = {
    workingOn: featuredProjects[0] ? `[${featuredProjects[0].name}](${featuredProjects[0].url})` : 'Exciting open-source tools',
    learning: topLangs.length > 0 ? `Next-gen patterns in ${topLangs[0]}` : 'Distributed systems & modern architecture',
    askMeAbout: topLangs.slice(0, 3).join(', ') || 'System design, APIs, and modern web',
    reachMe: profile?.blog || (profile?.twitter_username ? `@${profile.twitter_username}` : 'GitHub Discussions or LinkedIn'),
    openFor: 'Collaborations on open source projects & tech discussions',
    funFact: 'I turn caffeine into clean, tested, and reliable code ☕',
    tone: 'professional',
  };

  // Tech stack settings
  const techStackSettings: TechStackSettings = {
    badgeStyle: 'for-the-badge',
    selectedBadges: matchedBadges.slice(0, 16),
    showCategoryHeaders: true,
    align: 'center',
  };

  // GitHub Stats settings
  const githubStatsSettings: GitHubStatsSettings = {
    cardTheme: 'catppuccin_mocha',
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
    displayStyle: 'table',
    showStars: true,
    showForks: true,
  };

  // Social links settings
  const socialSettings: SocialLinksSettings = {
    badgeStyle: 'for-the-badge',
    align: 'center',
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
    { id: 'hero', title: 'Header & Hero Banner', enabled: true, settings: heroSettings },
    { id: 'bio', title: 'About Me & Bio', enabled: true, settings: bioSettings },
    { id: 'tech_stack', title: 'Tech Stack & Badges', enabled: true, settings: techStackSettings },
    { id: 'github_stats', title: 'GitHub Analytics & Cards', enabled: true, settings: githubStatsSettings },
    { id: 'streak_trophies', title: 'Streaks & Trophies', enabled: true, settings: githubStatsSettings },
    { id: 'pinned_projects', title: 'Featured Projects', enabled: true, settings: pinnedProjectsSettings },
    { id: 'social_connect', title: 'Social & Connect Links', enabled: true, settings: socialSettings },
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
      cardTheme: 'catppuccin_mocha',
      badgeStyle: 'for-the-badge',
    },
    status: 'idle',
  };
}
