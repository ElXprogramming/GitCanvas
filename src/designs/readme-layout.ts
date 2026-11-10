import {
  ReadmeBlockConfig,
  GitHubUserProfile,
  PinnedProjectsSettings,
  SocialLinksSettings,
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

/**
 * Generates the single Main Layout matching the sketch:
 * 1. Top Header: [PFP + Name + @nickname] on left | [Email, LinkedIn, Portfolio] on right
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
  cardTheme = 'default'
): string {
  const username = profile?.login || 'octocat';
  const displayName = profile?.name || username;
  const base = getCardsBaseUrl();

  const statsBlock = blocks.find((b) => b.id === 'github_stats')
    ?.settings as GitHubStatsSettings | undefined;
  const theme = encodeURIComponent(
    statsBlock?.cardTheme || cardTheme || 'default'
  );

  const socialBlock = blocks.find((b) => b.id === 'social_connect')
    ?.settings as SocialLinksSettings | undefined;
  const projectsBlock = blocks.find((b) => b.id === 'pinned_projects')
    ?.settings as PinnedProjectsSettings | undefined;

  const enabledIds = new Set(blocks.filter((b) => b.enabled).map((b) => b.id));

  const sections: string[] = [];

  // ==========================================================
  // 1. HEADER: [PFP + Name + @nickname] Left | [Email, LinkedIn, Portfolio] Right
  // ==========================================================
  const links = socialBlock?.links;
  const emailHref = links?.email
    ? `mailto:${links.email}`
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

  const profileCardUrl = `${base}/api/cards/profile?username=${encodeURIComponent(username)}&theme=${theme}`;
  const emailCardUrl = `${base}/api/cards/social?type=email&label=Email&theme=${theme}`;
  const linkedinCardUrl = `${base}/api/cards/social?type=linkedin&label=LinkedIn&theme=${theme}`;
  const portfolioCardUrl = `${base}/api/cards/social?type=portfolio&label=Portfolio&theme=${theme}`;

  sections.push(`<div>
  <a href="https://github.com/${username}">
    <img src="${profileCardUrl}" alt="${displayName} (@${username})" height="82" align="left" />
  </a>
  <div align="right">
    <a href="${emailHref}"><img src="${emailCardUrl}" alt="Email" height="54" /></a>
    <a href="${linkedinHref}"><img src="${linkedinCardUrl}" alt="LinkedIn" height="54" /></a>
    <a href="${portfolioHref}"><img src="${portfolioCardUrl}" alt="Portfolio" height="54" /></a>
  </div>
</div>
<br clear="both" />`);

  // ==========================================================
  // 2. PINNED PROJECTS (2x2 Grid, each pulled separately)
  // ==========================================================
  if (!blocks.length || enabledIds.has('pinned_projects')) {
    const customProjects = projectsBlock?.featuredProjects || [];

    const buildProjectImg = (idx: number) => {
      const custom = customProjects[idx];
      const repoUrl = custom?.url || `https://github.com/${username}`;
      const cardUrl = `${base}/api/cards/project?username=${encodeURIComponent(username)}&index=${idx}&theme=${theme}`;
      return `<a href="${repoUrl}"><img src="${cardUrl}" alt="Pinned Project ${idx + 1}" width="48.5%" /></a>`;
    };

    sections.push(`### Pinned projects

<p align="left">
  ${buildProjectImg(0)}
  ${buildProjectImg(1)}
</p>
<p align="left">
  ${buildProjectImg(2)}
  ${buildProjectImg(3)}
</p>`);
  }

  // ==========================================================
  // 3. LANGUAGES (Proportional Bar + Labels Underneath)
  // ==========================================================
  if (!blocks.length || enabledIds.has('tech_stack') || enabledIds.has('github_stats')) {
    const languagesCardUrl = `${base}/api/cards/languages?username=${encodeURIComponent(username)}&theme=${theme}`;
    sections.push(`### Languages

<p align="left">
  <img src="${languagesCardUrl}" alt="${username}'s Languages" width="100%" />
</p>`);
  }

  // ==========================================================
  // 4. GITHUB STATS (Each item pulled separately from original APIs)
  // ==========================================================
  if (!blocks.length || enabledIds.has('github_stats') || enabledIds.has('streak_trophies')) {
    const u = encodeURIComponent(username);

    // Row 1: commits | PR | issues | stars earned
    const commitsUrl = `${base}/api/cards/commits?username=${u}&theme=${theme}`;
    const prsUrl = `${base}/api/cards/prs?username=${u}&theme=${theme}`;
    const issuesUrl = `${base}/api/cards/issues?username=${u}&theme=${theme}`;
    const starsUrl = `${base}/api/cards/stars?username=${u}&theme=${theme}`;

    // Row 2: Repos | Polyglot | overall
    const reposUrl = `${base}/api/cards/repos?username=${u}&theme=${theme}`;
    const polyglotUrl = `${base}/api/cards/polyglot?username=${u}&theme=${theme}`;
    const overallUrl = `${base}/api/cards/overall?username=${u}&theme=${theme}`;

    // Row 3: streak | longest streak | active days this year
    const streakUrl = `${base}/api/cards/streak?username=${u}&theme=${theme}`;
    const longestStreakUrl = `${base}/api/cards/longest-streak?username=${u}&theme=${theme}`;
    const activeDaysUrl = `${base}/api/cards/active-days?username=${u}&theme=${theme}`;

    // Row 4: contributions last year (full width)
    const contributionsUrl = `${base}/api/cards/contributions?username=${u}&theme=${theme}`;

    sections.push(`### Github stats

<p align="left">
  <img src="${commitsUrl}" alt="commits" width="23.8%" />
  <img src="${prsUrl}" alt="PR" width="23.8%" />
  <img src="${issuesUrl}" alt="issues" width="23.8%" />
  <img src="${starsUrl}" alt="stars earned" width="23.8%" />
</p>

<p align="left">
  <img src="${reposUrl}" alt="Repos" width="32%" />
  <img src="${polyglotUrl}" alt="Polyglot" width="32%" />
  <img src="${overallUrl}" alt="overall" width="32%" />
</p>

<p align="left">
  <img src="${streakUrl}" alt="streak" width="32%" />
  <img src="${longestStreakUrl}" alt="longest streak" width="32%" />
  <img src="${activeDaysUrl}" alt="active days this year" width="32%" />
</p>

<p align="left">
  <img src="${contributionsUrl}" alt="contributions last year" width="98.5%" />
</p>`);
  }

  return sections.join('\n\n');
}
