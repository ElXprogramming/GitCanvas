import {
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
  FeaturedProject,
  TechBadgeItem,
  PinnedProjectItem,
} from '@/types';
import { TECH_CATALOG } from './tech-catalog';

export function createDefaultBlocks(
  profile: GitHubUserProfile | null,
  archetype: DeveloperArchetype | null,
  languages: LanguageDistribution[],
  repos: Repository[],
  pinnedProjects?: PinnedProjectItem[]
): ReadmeBlockConfig[] {
  const username = profile?.login || 'ElXprogramming';
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

  // Pinned/Featured projects: prefer actual GitHub pinned repos if available
  const topRepos = repos
    .filter((r) => !r.fork && r.name !== username)
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 4);

  const featuredProjects: FeaturedProject[] =
    pinnedProjects && pinnedProjects.length > 0
      ? pinnedProjects.map((p) => ({
          name: p.name,
          description: p.description || 'Open-source repository on GitHub.',
          url: p.url,
        }))
      : topRepos.map((r) => ({
          name: r.name,
          description:
            r.description || `High-performance ${r.language || 'software'} project.`,
          url: r.html_url,
        }));

  // Profile Header block defaults
  const heroSettings: HeroSettings = {
    greeting: name,
    tagline:
      archetype?.tagline || 'Building software that makes a difference.',
    showWave: false,
    showCompany: Boolean(profile?.company),
    company: profile?.company || '',
    showBio: Boolean(profile?.bio),
    bio: profile?.bio || '',
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
  };

  // GitHub Stats settings
  const githubStatsSettings: GitHubStatsSettings = {
    cardTheme: 'default',
    cardFont: 'josefin_slab',
    showOverallStats: true,
    showTopLangs: true,
    showStreak: true,
    showActivityGraph: true,
  };

  // Pinned projects settings
  const pinnedProjectsSettings: PinnedProjectsSettings = {
    useLivePinned: true,
    featuredProjects,
  };

  return [
    {
      id: 'hero',
      title: 'Profile Header Card',
      enabled: true,
      settings: heroSettings,
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
