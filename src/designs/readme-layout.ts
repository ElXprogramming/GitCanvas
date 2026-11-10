import {
  ReadmeBlockConfig,
  GitHubUserProfile,
  HeroSettings,
  BioSettings,
  TechStackSettings,
  PinnedProjectsSettings,
  SocialLinksSettings,
  GitHubStatsSettings,
} from '@/types';
import { buildBadgeUrl } from '@/lib/tech-catalog';

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

/**
 * Generates the single Main Layout matching the sketch:
 * 1. Top Header: [PFP + Name + @nickname] on left | [Email, LinkedIn, Portfolio, ...] on right
 * 2. Pinned projects (2x2 grid)
 * 3. Languages (Segmented horizontal bar + labels underneath)
 * 4. Github stats (Each item pulled separately from original APIs):
 *    - Row 1: commits | PR | issues | stars earned
 *    - Row 2: Repos | Polyglot | overall
 *    - Row 3: streak | longest streak | active days this year
 *    - Row 4: contributions last year (with commits count + heatmap grid)
 */
export function generateMainReadmeLayout(
  blocks: ReadmeBlockConfig[],
  profile: GitHubUserProfile | null,
  cardTheme = 'default',
  fallbackUsername = 'torvalds'
): string {
  const username = profile?.login || fallbackUsername || 'torvalds';
  const defaultDisplayName = profile?.name || username;
  const base = getCardsBaseUrl();

  const heroBlockCfg = blocks.find((b) => b.id === 'hero');
  const heroSettings = heroBlockCfg?.settings as HeroSettings | undefined;

  const bioBlockCfg = blocks.find((b) => b.id === 'bio');
  const bioSettings = bioBlockCfg?.settings as BioSettings | undefined;

  const techBlockCfg = blocks.find((b) => b.id === 'tech_stack');
  const techSettings = techBlockCfg?.settings as TechStackSettings | undefined;

  const statsBlockCfg = blocks.find((b) => b.id === 'github_stats');
  const statsSettings = statsBlockCfg?.settings as GitHubStatsSettings | undefined;

  const streakBlockCfg = blocks.find((b) => b.id === 'streak_trophies');
  const streakSettings = streakBlockCfg?.settings as GitHubStatsSettings | undefined;

  const socialBlockCfg = blocks.find((b) => b.id === 'social_connect');
  const socialSettings = socialBlockCfg?.settings as SocialLinksSettings | undefined;

  const projectsBlockCfg = blocks.find((b) => b.id === 'pinned_projects');
  const projectsSettings = projectsBlockCfg?.settings as PinnedProjectsSettings | undefined;

  const theme = encodeURIComponent(
    statsSettings?.cardTheme || cardTheme || 'default'
  );

  const hasBlocks = blocks.length > 0;
  const isEnabled = (id: string, defaultVal = true) => {
    if (!hasBlocks) return defaultVal;
    const found = blocks.find((b) => b.id === id);
    return found ? found.enabled : defaultVal;
  };

  const sections: string[] = [];

  // ==========================================================
  // 1. HEADER: [PFP + Name + @nickname] Left | [Email, LinkedIn, Portfolio] Right
  // ==========================================================
  const showProfileHeader = isEnabled('hero', true);
  const showSocialHeader = isEnabled('social_connect', true);

  if (showProfileHeader || showSocialHeader) {
    const customName = heroSettings?.greeting?.trim();
    const displayName = customName || defaultDisplayName;
    const nameParam =
      customName && customName !== defaultDisplayName
        ? `&name=${encodeURIComponent(customName)}`
        : '';

    const profileCardUrl = `${base}/api/cards/profile?username=${encodeURIComponent(username)}&theme=${theme}${nameParam}`;

    const links = socialSettings?.links;
    const emailHref = links?.email
      ? links.email.startsWith('mailto:')
        ? links.email
        : `mailto:${links.email}`
      : `https://github.com/${username}`;
    const linkedinHref = links?.linkedin
      ? links.linkedin.startsWith('http')
        ? links.linkedin
        : `https://linkedin.com/in/${links.linkedin}`
      : `https://linkedin.com`;
    const portfolioHref = links?.portfolio
      ? links.portfolio.startsWith('http')
        ? links.portfolio
        : `https://${links.portfolio}`
      : profile?.blog
        ? profile.blog.startsWith('http')
          ? profile.blog
          : `https://${profile.blog}`
        : `https://github.com/${username}`;

    const socialImgs: string[] = [
      `<a href="${emailHref}"><img src="${base}/api/cards/social?type=email&label=Email&theme=${theme}" alt="Email" height="54" /></a>`,
      `<a href="${linkedinHref}"><img src="${base}/api/cards/social?type=linkedin&label=LinkedIn&theme=${theme}" alt="LinkedIn" height="54" /></a>`,
      `<a href="${portfolioHref}"><img src="${base}/api/cards/social?type=portfolio&label=Portfolio&theme=${theme}" alt="Portfolio" height="54" /></a>`,
    ];

    if (links?.twitter?.trim()) {
      const tUrl = links.twitter.startsWith('http')
        ? links.twitter
        : `https://x.com/${links.twitter.replace(/^@/, '')}`;
      socialImgs.push(
        `<a href="${tUrl}"><img src="${base}/api/cards/social?type=twitter&label=X&theme=${theme}" alt="X" height="54" /></a>`
      );
    }
    if (links?.discord?.trim()) {
      const dUrl = links.discord.startsWith('http')
        ? links.discord
        : `https://discord.gg/${links.discord}`;
      socialImgs.push(
        `<a href="${dUrl}"><img src="${base}/api/cards/social?type=discord&label=Discord&theme=${theme}" alt="Discord" height="54" /></a>`
      );
    }
    if (links?.youtube?.trim()) {
      const yUrl = links.youtube.startsWith('http')
        ? links.youtube
        : `https://youtube.com/${links.youtube}`;
      socialImgs.push(
        `<a href="${yUrl}"><img src="${base}/api/cards/social?type=youtube&label=YouTube&theme=${theme}" alt="YouTube" height="54" /></a>`
      );
    }

    const leftPart = showProfileHeader
      ? `  <a href="https://github.com/${username}">\n    <img src="${profileCardUrl}" alt="${displayName} (@${username})" height="82" align="left" />\n  </a>`
      : '';

    const rightPart = showSocialHeader
      ? `  <div align="right">\n    ${socialImgs.join('\n    ')}\n  </div>`
      : '';

    sections.push(
      `<div>\n${[leftPart, rightPart].filter(Boolean).join('\n')}\n</div>\n<br clear="both" />`
    );

    if (showProfileHeader && heroSettings?.showWave && heroSettings?.tagline?.trim()) {
      sections.push(`> ${heroSettings.tagline.trim()}`);
    }
  }

  // Helper to build each body section so drag-and-drop ordering in StudioControls works
  const buildSectionForBlock = (blockId: string): string | null => {
    if (blockId === 'bio' && isEnabled('bio', false) && bioSettings) {
      const bullets: string[] = [];
      if (bioSettings.workingOn) bullets.push(`- 🔭 **Working on:** ${bioSettings.workingOn}`);
      if (bioSettings.learning) bullets.push(`- 🌱 **Currently learning:** ${bioSettings.learning}`);
      if (bioSettings.askMeAbout) bullets.push(`- 💬 **Ask me about:** ${bioSettings.askMeAbout}`);
      if (bioSettings.reachMe) bullets.push(`- 📫 **How to reach me:** ${bioSettings.reachMe}`);
      if (bioSettings.openFor) bullets.push(`- 💼 **Open for:** ${bioSettings.openFor}`);
      if (bioSettings.funFact) bullets.push(`- ⚡ **Fun fact:** ${bioSettings.funFact}`);
      if (bullets.length === 0) return null;
      return `### About Me\n\n${bullets.join('\n')}`;
    }

    if (blockId === 'pinned_projects' && isEnabled('pinned_projects', true)) {
      const customProjects = projectsSettings?.featuredProjects || [];
      const count = customProjects.length > 0 ? customProjects.length : 4;

      const buildProjectImg = (idx: number) => {
        const custom = customProjects[idx];
        const repoUrl = custom?.url || `https://github.com/${username}`;
        const repoParam = custom?.name
          ? `&repo=${encodeURIComponent(custom.name)}`
          : '';
        const cardUrl = `${base}/api/cards/project?username=${encodeURIComponent(username)}&index=${idx}${repoParam}&theme=${theme}`;
        return `<a href="${repoUrl}"><img src="${cardUrl}" alt="${custom?.name || `Pinned Project ${idx + 1}`}" width="48.6%" /></a>`;
      };

      const rows: string[] = [];
      for (let i = 0; i < count; i += 2) {
        const pair = [buildProjectImg(i)];
        if (i + 1 < count) {
          pair.push(buildProjectImg(i + 1));
        }
        rows.push(`<p align="left">\n  ${pair.join('\n  ')}\n</p>`);
      }

      return `### Pinned projects\n\n${rows.join('\n')}`;
    }

    if (blockId === 'tech_stack' && isEnabled('tech_stack', true)) {
      const languagesCardUrl = `${base}/api/cards/languages?username=${encodeURIComponent(username)}&theme=${theme}`;
      const parts: string[] = [
        `### Languages`,
        `<p align="left">\n  <img src="${languagesCardUrl}" alt="${username}'s Languages" width="98.5%" />\n</p>`,
      ];

      // Optional tech stack badges if enabled in TechStackEditor
      if (
        techSettings?.showCategoryHeaders &&
        techSettings.selectedBadges &&
        techSettings.selectedBadges.length > 0
      ) {
        const badgeImgs = techSettings.selectedBadges
          .map(
            (b) =>
              `<img src="${buildBadgeUrl(b, techSettings.badgeStyle || 'for-the-badge')}" alt="${b.name}" />`
          )
          .join(' ');
        parts.push(`<p align="left">\n  ${badgeImgs}\n</p>`);
      }

      return parts.join('\n\n');
    }

    if (blockId === 'github_stats' && isEnabled('github_stats', true)) {
      const u = encodeURIComponent(username);
      const showRow1 = statsSettings?.showOverallStats !== false;
      const showRow2 = statsSettings?.showTopLangs !== false;

      const rows: string[] = [];

      if (showRow1) {
        const commitsUrl = `${base}/api/cards/commits?username=${u}&theme=${theme}`;
        const prsUrl = `${base}/api/cards/prs?username=${u}&theme=${theme}`;
        const issuesUrl = `${base}/api/cards/issues?username=${u}&theme=${theme}`;
        const starsUrl = `${base}/api/cards/stars?username=${u}&theme=${theme}`;

        rows.push(`<p align="left">
  <img src="${commitsUrl}" alt="commits" width="23.8%" />
  <img src="${prsUrl}" alt="PR" width="23.8%" />
  <img src="${issuesUrl}" alt="issues" width="23.8%" />
  <img src="${starsUrl}" alt="stars earned" width="23.8%" />
</p>`);
      }

      if (showRow2) {
        const reposUrl = `${base}/api/cards/repos?username=${u}&theme=${theme}`;
        const polyglotUrl = `${base}/api/cards/polyglot?username=${u}&theme=${theme}`;
        const overallUrl = `${base}/api/cards/overall?username=${u}&theme=${theme}`;

        rows.push(`<p align="left">
  <img src="${reposUrl}" alt="Repos" width="32%" />
  <img src="${polyglotUrl}" alt="Polyglot" width="32%" />
  <img src="${overallUrl}" alt="overall" width="32%" />
</p>`);
      }

      if (rows.length === 0) return null;
      return `### Github stats\n\n${rows.join('\n\n')}`;
    }

    if (blockId === 'streak_trophies' && isEnabled('streak_trophies', true)) {
      const u = encodeURIComponent(username);
      const showStreakRow = streakSettings?.showStreak !== false;
      const showContribRow = streakSettings?.showActivityGraph !== false;

      const rows: string[] = [];

      if (showStreakRow) {
        const streakUrl = `${base}/api/cards/streak?username=${u}&theme=${theme}`;
        const longestStreakUrl = `${base}/api/cards/longest-streak?username=${u}&theme=${theme}`;
        const activeDaysUrl = `${base}/api/cards/active-days?username=${u}&theme=${theme}`;

        rows.push(`<p align="left">
  <img src="${streakUrl}" alt="streak" width="32%" />
  <img src="${longestStreakUrl}" alt="longest streak" width="32%" />
  <img src="${activeDaysUrl}" alt="active days this year" width="32%" />
</p>`);
      }

      if (showContribRow) {
        const contributionsUrl = `${base}/api/cards/contributions?username=${u}&theme=${theme}`;
        rows.push(`<p align="left">
  <img src="${contributionsUrl}" alt="contributions last year" width="98.5%" />
</p>`);
      }

      if (rows.length === 0) return null;
      const statsHeadingAlreadyRendered = isEnabled('github_stats', true);
      return statsHeadingAlreadyRendered
        ? rows.join('\n\n')
        : `### Github stats\n\n${rows.join('\n\n')}`;
    }

    return null;
  };

  const blockOrder = hasBlocks
    ? blocks.map((b) => b.id)
    : ['pinned_projects', 'tech_stack', 'github_stats', 'streak_trophies'];

  for (const id of blockOrder) {
    if (id === 'hero' || id === 'social_connect') continue;
    const content = buildSectionForBlock(id);
    if (content) {
      sections.push(content);
    }
  }

  return sections.join('\n\n');
}
