import {
  ReadmeBlockConfig,
  GitHubUserProfile,
  HeroSettings,
  BioSettings,
  PinnedProjectsSettings,
  GitHubStatsSettings,
} from '@/types';

export function getCardsBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    'https://gitcanvas.dev'
  );
}

const DEFAULT_SECTIONS = [
  'pinned_projects',
  'tech_stack',
  'github_stats',
  'streak_trophies',
];

const BODY_BLOCK_IDS = new Set([
  'pinned_projects',
  'tech_stack',
  'github_stats',
  'streak_trophies',
  'bio',
]);

/**
 * Builds the single all-in-one composite SVG API URL (/api/cards/canvas?username=...)
 * encoding any non-default Studio customizations as clean query parameters.
 */
export function buildCanvasCardUrl(
  blocks: ReadmeBlockConfig[],
  profile: GitHubUserProfile | null,
  cardTheme = 'default',
  fallbackUsername = 'ElXprogramming',
  cardFont?: string
): string {
  const username = profile?.login || fallbackUsername || 'ElXprogramming';
  const defaultDisplayName = profile?.name || username;
  const base = getCardsBaseUrl();

  const heroBlockCfg = blocks.find((b) => b.id === 'hero');
  const heroSettings = heroBlockCfg?.settings as HeroSettings | undefined;

  const bioBlockCfg = blocks.find((b) => b.id === 'bio');
  const bioSettings = bioBlockCfg?.settings as BioSettings | undefined;

  const statsBlockCfg = blocks.find((b) => b.id === 'github_stats');
  const statsSettings = statsBlockCfg?.settings as GitHubStatsSettings | undefined;

  const projectsBlockCfg = blocks.find((b) => b.id === 'pinned_projects');
  const projectsSettings = projectsBlockCfg?.settings as PinnedProjectsSettings | undefined;

  const effectiveTheme =
    cardTheme && cardTheme !== 'default'
      ? cardTheme
      : statsSettings?.cardTheme || 'default';
  const effectiveFont = cardFont || statsSettings?.cardFont;

  const hasBlocks = blocks.length > 0;
  const isEnabled = (id: string, defaultVal = true) => {
    if (!hasBlocks) return defaultVal;
    const found = blocks.find((b) => b.id === id);
    return found ? found.enabled : defaultVal;
  };

  const params = new URLSearchParams();
  params.set('username', username);
  params.set('theme', effectiveTheme);
  if (effectiveFont) {
    params.set('font', effectiveFont);
  }

  // Custom display name override or hidden profile header
  if (!isEnabled('hero', true)) {
    params.set('hide_profile', '1');
  } else {
    const customName = heroSettings?.greeting?.trim();
    if (customName && customName !== defaultDisplayName) {
      params.set('name', customName);
    }
    if (heroSettings?.showWave && heroSettings?.tagline?.trim()) {
      params.set('tagline', heroSettings.tagline.trim());
    }
  }


  // Active & ordered body sections
  if (hasBlocks) {
    const activeSections = blocks
      .filter((b) => b.enabled && BODY_BLOCK_IDS.has(b.id))
      .map((b) => b.id);

    if (activeSections.join(',') !== DEFAULT_SECTIONS.join(',')) {
      params.set(
        'sections',
        activeSections.length > 0 ? activeSections.join(',') : 'none'
      );
    }
  }

  // Custom pinned repositories (only override if user explicitly opted out of live pinned repos)
  if (isEnabled('pinned_projects', true) && projectsSettings?.useLivePinned === false) {
    const customRepos = (projectsSettings?.featuredProjects || [])
      .map((p) => p.name?.trim())
      .filter((n): n is string => Boolean(n));
    if (customRepos.length > 0) {
      params.set('repos', customRepos.join(','));
    }
  }

  // Hidden stats sub-rows
  const hiddenRows: string[] = [];
  if (statsSettings?.showOverallStats === false) hiddenRows.push('r1');
  if (statsSettings?.showTopLangs === false) hiddenRows.push('r2');
  if (hiddenRows.length > 0) {
    params.set('hide_rows', hiddenRows.join(','));
  }

  // Optional Bio fields when bio block is enabled
  if (isEnabled('bio', false) && bioSettings) {
    if (bioSettings.workingOn?.trim()) {
      params.set('bio_work', bioSettings.workingOn.trim());
    }
    if (bioSettings.learning?.trim()) {
      params.set('bio_learn', bioSettings.learning.trim());
    }
    if (bioSettings.askMeAbout?.trim()) {
      params.set('bio_ask', bioSettings.askMeAbout.trim());
    }
    if (bioSettings.funFact?.trim()) {
      params.set('bio_fact', bioSettings.funFact.trim());
    }
    if (bioSettings.openFor?.trim()) {
      params.set('bio_focus', bioSettings.openFor.trim());
    }
  }

  return `${base}/api/cards/canvas?${params.toString()}`;
}

/**
 * Generates the single-line Markdown profile card call for README.md.
 * All styling, layout, projects, languages, and stats are rendered inside the single SVG API endpoint.
 */
export function generateMainReadmeLayout(
  blocks: ReadmeBlockConfig[],
  profile: GitHubUserProfile | null,
  cardTheme = 'default',
  fallbackUsername = 'ElXprogramming',
  cardFont?: string
): string {
  const username = profile?.login || fallbackUsername || 'ElXprogramming';
  const heroBlockCfg = blocks.find((b) => b.id === 'hero');
  const heroSettings = heroBlockCfg?.settings as HeroSettings | undefined;
  const displayName =
    heroSettings?.greeting?.trim() || profile?.name || username;

  const canvasUrl = buildCanvasCardUrl(
    blocks,
    profile,
    cardTheme,
    fallbackUsername,
    cardFont
  );

  return `![${displayName}'s GitHub Profile](${canvasUrl})`;
}
