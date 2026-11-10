import {
  UnifiedGitHubStats,
  UserStreakStats,
  UserLanguageStats,
  UserOverviewStats,
  UserCommitStats,
  UserActivityStats,
} from '@/types/stats';

export interface CardTheme {
  background: string;
  backgroundEnd?: string;
  border: string;
  title: string;
  text: string;
  subtext: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  iconColor: string;
}

export const CARD_THEMES: Record<string, CardTheme> = {
  catppuccin_mocha: {
    background: '#1e1e2e',
    backgroundEnd: '#181825',
    border: '#313244',
    title: '#89b4fa',
    text: '#cdd6f4',
    subtext: '#a6adc8',
    accent: '#f5c2e7',
    badgeBg: '#313244',
    badgeText: '#f5c2e7',
    iconColor: '#fab387',
  },
  tokyonight: {
    background: '#1a1b26',
    backgroundEnd: '#16161e',
    border: '#24283b',
    title: '#7aa2f7',
    text: '#a9b1d6',
    subtext: '#787c99',
    accent: '#bb9af7',
    badgeBg: '#24283b',
    badgeText: '#7dcfff',
    iconColor: '#e0af68',
  },
  dracula: {
    background: '#282a36',
    backgroundEnd: '#21222c',
    border: '#44475a',
    title: '#bd93f9',
    text: '#f8f8f2',
    subtext: '#6272a4',
    accent: '#ff79c6',
    badgeBg: '#44475a',
    badgeText: '#50fa7b',
    iconColor: '#f1fa8c',
  },
  nord: {
    background: '#2e3440',
    backgroundEnd: '#242933',
    border: '#3b4252',
    title: '#88c0d0',
    text: '#eceff4',
    subtext: '#d8dee9',
    accent: '#81a1c1',
    badgeBg: '#3b4252',
    badgeText: '#a3be8c',
    iconColor: '#ebcb8b',
  },
  github_dark: {
    background: '#0d1117',
    backgroundEnd: '#010409',
    border: '#30363d',
    title: '#58a6ff',
    text: '#e6edf3',
    subtext: '#8b949e',
    accent: '#238636',
    badgeBg: '#21262d',
    badgeText: '#3fb950',
    iconColor: '#d29922',
  },
  sunset: {
    background: '#1f132b',
    backgroundEnd: '#140c1c',
    border: '#3c2554',
    title: '#ff7e67',
    text: '#fae3d9',
    subtext: '#b392ac',
    accent: '#ff2a7a',
    badgeBg: '#3c2554',
    badgeText: '#ffc107',
    iconColor: '#ff9a3c',
  },
  radical: {
    background: '#141321',
    backgroundEnd: '#0a0914',
    border: '#2a2744',
    title: '#fe428e',
    text: '#a9fef7',
    subtext: '#6b7280',
    accent: '#f8d847',
    badgeBg: '#2a2744',
    badgeText: '#fe428e',
    iconColor: '#f8d847',
  },
};

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function getTheme(themeName?: string | null): CardTheme {
  const normalized = (themeName || 'catppuccin_mocha').toLowerCase().trim();
  return CARD_THEMES[normalized] || CARD_THEMES.catppuccin_mocha;
}

// ==========================================
// 1. STANDALONE STATS CARD (SVG)
// ==========================================
export function renderStatsSvgCard(
  stats: UnifiedGitHubStats,
  options?: {
    theme?: string;
    hideBorder?: boolean;
  }
): string {
  const theme = getTheme(options?.theme);
  const hideBorder = !!options?.hideBorder;
  const overview = stats.overview;
  const commits = stats.commits;
  const activity = stats.activity;
  const rank = stats.rank;

  const username = escapeXml(stats.username);
  const stars = formatNumber(overview?.totalStarsEarned ?? 0);
  const totalCommits = formatNumber(commits?.totalLifetimeCommits ?? overview?.publicRepos ?? 0);
  const prs = formatNumber(activity?.totalPRs ?? 0);
  const issues = formatNumber(activity?.totalIssues ?? 0);
  const repos = formatNumber(overview?.publicRepos ?? 0);
  const followers = formatNumber(overview?.followers ?? 0);

  const grade = rank?.grade || 'A';
  const gradeScore = rank?.score || 70;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="210" viewBox="0 0 495 210" fill="none" role="img" aria-label="${username}'s GitHub Stats">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.background}" />
      <stop offset="100%" stop-color="${theme.backgroundEnd || theme.background}" />
    </linearGradient>
    <style>
      .header { font: 600 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.title}; }
      .label { font: 500 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.subtext}; }
      .value { font: 700 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.text}; }
      .badge-text { font: 700 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.badgeText}; }
      .rank-title { font: 600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.subtext}; }
    </style>
  </defs>

  <!-- Background -->
  <rect x="0.5" y="0.5" rx="12" width="494" height="209" fill="url(#bgGrad)" stroke="${hideBorder ? 'none' : theme.border}" stroke-width="1" />

  <!-- Header -->
  <g transform="translate(25, 32)">
    <!-- Octocat Icon -->
    <path fill="${theme.iconColor}" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" transform="scale(0.85)" />
    <text x="28" y="15" class="header">${username}&apos;s GitHub Stats</text>
  </g>

  <!-- Developer Grade Rank Circle (Right side) -->
  <g transform="translate(415, 110)">
    <circle r="36" fill="${theme.badgeBg}" stroke="${theme.accent}" stroke-width="2.5" />
    <text text-anchor="middle" y="5" font-size="22" font-weight="800" fill="${theme.accent}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${grade}</text>
    <text text-anchor="middle" y="20" class="rank-title">${gradeScore}/100</text>
  </g>

  <!-- Left Stats Column -->
  <g transform="translate(25, 75)">
    <!-- Stars -->
    <g transform="translate(0, 0)">
      <text y="14" font-size="14">⭐</text>
      <text x="24" y="13" class="label">Total Stars Earned:</text>
      <text x="190" y="13" class="value">${stars}</text>
    </g>
    <!-- Lifetime Commits -->
    <g transform="translate(0, 32)">
      <text y="14" font-size="14">⚡</text>
      <text x="24" y="13" class="label">Lifetime Commits:</text>
      <text x="190" y="13" class="value">${totalCommits}</text>
    </g>
    <!-- Repositories -->
    <g transform="translate(0, 64)">
      <text y="14" font-size="14">📦</text>
      <text x="24" y="13" class="label">Public Repositories:</text>
      <text x="190" y="13" class="value">${repos}</text>
    </g>
    <!-- Pull Requests -->
    <g transform="translate(0, 96)">
      <text y="14" font-size="14">🔀</text>
      <text x="24" y="13" class="label">Pull Requests:</text>
      <text x="190" y="13" class="value">${prs}</text>
    </g>
  </g>

  <!-- Middle Stats Column -->
  <g transform="translate(250, 75)">
    <!-- Issues -->
    <g transform="translate(0, 0)">
      <text y="14" font-size="14">🐛</text>
      <text x="24" y="13" class="label">Issues:</text>
      <text x="85" y="13" class="value">${issues}</text>
    </g>
    <!-- Followers -->
    <g transform="translate(0, 32)">
      <text y="14" font-size="14">👥</text>
      <text x="24" y="13" class="label">Followers:</text>
      <text x="85" y="13" class="value">${followers}</text>
    </g>
  </g>
</svg>`;
}

// ==========================================
// 2. STANDALONE STREAK CARD (SVG)
// ==========================================
export function renderStreakSvgCard(
  streak: UserStreakStats,
  username: string,
  options?: {
    theme?: string;
    hideBorder?: boolean;
  }
): string {
  const theme = getTheme(options?.theme);
  const hideBorder = !!options?.hideBorder;
  const safeUsername = escapeXml(username);

  const currentStreak = streak.currentStreak.days;
  const longestStreak = streak.longestStreak.days;
  const totalContributions = formatNumber(streak.totalContributionsPastYear);

  const curStart = streak.currentStreak.startDate || '—';
  const curEnd = streak.currentStreak.endDate || '—';
  const currentRange = currentStreak > 0 ? `${curStart} - ${curEnd}` : 'Inactive';

  const longStart = streak.longestStreak.startDate || '—';
  const longEnd = streak.longestStreak.endDate || '—';
  const longestRange = longestStreak > 0 ? `${longStart} - ${longEnd}` : '—';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195" viewBox="0 0 495 195" fill="none" role="img" aria-label="${safeUsername}'s Contribution Streak">
  <defs>
    <linearGradient id="streakBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.background}" />
      <stop offset="100%" stop-color="${theme.backgroundEnd || theme.background}" />
    </linearGradient>
    <style>
      .title { font: 600 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.title}; }
      .streak-num { font: 800 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.text}; text-anchor: middle; }
      .streak-label { font: 600 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.subtext}; text-anchor: middle; }
      .streak-sub { font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.subtext}; text-anchor: middle; opacity: 0.85; }
      .divider { stroke: ${theme.border}; stroke-width: 1; stroke-dasharray: 4 2; }
    </style>
  </defs>

  <!-- Background -->
  <rect x="0.5" y="0.5" rx="12" width="494" height="194" fill="url(#streakBg)" stroke="${hideBorder ? 'none' : theme.border}" stroke-width="1" />

  <!-- Card Title -->
  <g transform="translate(25, 28)">
    <text font-size="16">🔥</text>
    <text x="24" y="14" class="title">${safeUsername}&apos;s Contribution Streak</text>
  </g>

  <!-- 3 Streak Pillars -->
  <!-- Col 1: Total Contributions -->
  <g transform="translate(85, 75)">
    <text y="28" class="streak-num" fill="${theme.accent}">${totalContributions}</text>
    <text y="50" class="streak-label">Total Contributions</text>
    <text y="68" class="streak-sub">Past 365 Days</text>
  </g>

  <line x1="165" y1="65" x2="165" y2="155" class="divider" />

  <!-- Col 2: Current Streak -->
  <g transform="translate(247, 75)">
    <!-- Fire Icon for Current Streak -->
    <circle cx="0" cy="18" r="28" fill="${theme.badgeBg}" opacity="0.6" />
    <text y="26" class="streak-num" fill="${theme.iconColor}">${currentStreak}</text>
    <text y="50" class="streak-label">Current Streak 🔥</text>
    <text y="68" class="streak-sub">${currentRange}</text>
  </g>

  <line x1="330" y1="65" x2="330" y2="155" class="divider" />

  <!-- Col 3: Longest Streak -->
  <g transform="translate(410, 75)">
    <text y="28" class="streak-num" fill="${theme.title}">${longestStreak}</text>
    <text y="50" class="streak-label">Longest Streak ⚡</text>
    <text y="68" class="streak-sub">${longestRange}</text>
  </g>

  <!-- Bottom Active Rate Bar -->
  <g transform="translate(25, 172)">
    <text font-size="11" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fill="${theme.subtext}">
      Active Days: <tspan font-weight="700" fill="${theme.text}">${streak.totalActiveDays}</tspan> / 365 (${streak.completionRate}% Year Consistency)
    </text>
  </g>
</svg>`;
}

// ==========================================
// 3. STANDALONE TOP LANGUAGES CARD (SVG)
// ==========================================
export function renderLanguagesSvgCard(
  languageStats: UserLanguageStats,
  username: string,
  options?: {
    theme?: string;
    hideBorder?: boolean;
    langsCount?: number;
  }
): string {
  const theme = getTheme(options?.theme);
  const hideBorder = !!options?.hideBorder;
  const limit = options?.langsCount || 6;
  const safeUsername = escapeXml(username);

  const langs = (languageStats.languages || []).slice(0, limit);
  const totalBytes = langs.reduce((acc, l) => acc + l.bytes, 0) || 1;

  // Segmented Progress Bar calculation
  let accumulatedX = 0;
  const barWidth = 445;
  const segments = langs.map((l) => {
    const segWidth = Math.max(3, Math.round((l.bytes / totalBytes) * barWidth));
    const x = accumulatedX;
    accumulatedX += segWidth;
    return `<rect x="${x}" y="0" width="${segWidth}" height="10" rx="2" fill="${l.color || theme.accent}" />`;
  });

  // 2-Column Grid of Languages
  const listItems = langs.map((l, i) => {
    const col = i % 2; // 0 or 1
    const row = Math.floor(i / 2);
    const x = col === 0 ? 0 : 225;
    const y = row * 24;

    const safeName = escapeXml(l.name);
    return `<g transform="translate(${x}, ${y})">
      <circle cx="5" cy="5" r="4.5" fill="${l.color || theme.accent}" />
      <text x="16" y="8" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" fill="${theme.text}">${safeName}</text>
      <text x="180" y="8" font-size="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" fill="${theme.subtext}" text-anchor="end">${l.percentage}%</text>
    </g>`;
  });

  const cardHeight = 110 + Math.ceil(langs.length / 2) * 26;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="${cardHeight}" viewBox="0 0 495 ${cardHeight}" fill="none" role="img" aria-label="${safeUsername}'s Most Used Languages">
  <defs>
    <linearGradient id="langBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.background}" />
      <stop offset="100%" stop-color="${theme.backgroundEnd || theme.background}" />
    </linearGradient>
    <style>
      .title { font: 600 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; fill: ${theme.title}; }
    </style>
  </defs>

  <!-- Background -->
  <rect x="0.5" y="0.5" rx="12" width="494" height="${cardHeight - 1}" fill="url(#langBg)" stroke="${hideBorder ? 'none' : theme.border}" stroke-width="1" />

  <!-- Header -->
  <g transform="translate(25, 28)">
    <text font-size="16">💻</text>
    <text x="24" y="14" class="title">Most Used Languages (${safeUsername})</text>
  </g>

  <!-- Segmented Language Bar -->
  <g transform="translate(25, 60)">
    <rect x="0" y="0" width="${barWidth}" height="10" rx="5" fill="${theme.border}" />
    <g clip-path="url(#barClip)">
      ${segments.join('\n      ')}
    </g>
  </g>

  <!-- Languages Legend Grid -->
  <g transform="translate(25, 90)">
    ${listItems.join('\n    ')}
  </g>
</svg>`;
}
