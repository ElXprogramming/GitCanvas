import {
  ReadmeBlockConfig,
  HeroSettings,
  BioSettings,
  TechStackSettings,
  GitHubStatsSettings,
  PinnedProjectsSettings,
  SocialLinksSettings,
  GitHubUserProfile,
  DeveloperArchetype,
  TechBadgeItem,
  LayoutTemplateId,
} from '@/types';
import { buildBadgeUrl } from './tech-catalog';

export function getCardsBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://gitcanvas.dev';
}

export function buildCardUrls(
  username: string,
  theme: string,
  hideBorder: boolean,
  provider: 'standalone' | 'legacy' = 'standalone'
) {
  if (provider === 'legacy') {
    return {
      statsUrl: `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=${hideBorder}&rank_icon=github&count_private=true`,
      topLangsUrl: `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=${hideBorder}&langs_count=8`,
      streakUrl: `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${theme}&hide_border=${hideBorder}`,
    };
  }
  const base = getCardsBaseUrl();
  return {
    statsUrl: `${base}/api/cards/stats?username=${username}&theme=${theme}&hide_border=${hideBorder}`,
    topLangsUrl: `${base}/api/cards/languages?username=${username}&theme=${theme}&hide_border=${hideBorder}&langs_count=6`,
    streakUrl: `${base}/api/cards/streak?username=${username}&theme=${theme}&hide_border=${hideBorder}`,
  };
}

export function generateAsciiArt(name: string): string {
  const upper = (name || 'DEVELOPER').toUpperCase().slice(0, 12);
  return `\`\`\`text
   ____ _ _   ____                                 
  / ___(_) |_/ ___|__ _ _ ____   ____ _ ___        
 | |  _| | __| |   / _\` | '_ \\ \\ / / _\` / __|       
 | |_| | | |_| |__| (_| | | | \\ V / (_| \\__ \\       
  \\____|_|\\__|\\____\\__,_|_| |_|\\_/ \\__,_|___/       
  >> [ ${upper} ] <<
\`\`\``;
}

export function generateMarkdown(
  blocks: ReadmeBlockConfig[],
  profile: GitHubUserProfile | null,
  archetype: DeveloperArchetype | null,
  layoutTemplate: LayoutTemplateId = 'bento'
): string {
  const username = profile?.login || 'octocat';
  const displayName = profile?.name || username;

  if (layoutTemplate === 'bento') {
    return generateBentoMarkdown(blocks, profile, archetype, username, displayName);
  }

  if (layoutTemplate === 'terminal') {
    return generateTerminalMarkdown(blocks, profile, archetype, username, displayName);
  }

  if (layoutTemplate === 'editorial') {
    return generateEditorialMarkdown(blocks, profile, archetype, username, displayName);
  }

  // Classic Modular Stack layout
  const sections: string[] = [];

  for (const block of blocks) {
    if (!block.enabled) continue;

    switch (block.id) {
      case 'hero': {
        const s = block.settings as HeroSettings;
        sections.push(generateHeroSection(s, username, displayName, archetype));
        break;
      }
      case 'bio': {
        const s = block.settings as BioSettings;
        sections.push(generateBioSection(s, displayName));
        break;
      }
      case 'tech_stack': {
        const s = block.settings as TechStackSettings;
        sections.push(generateTechStackSection(s));
        break;
      }
      case 'github_stats': {
        const s = block.settings as GitHubStatsSettings;
        sections.push(generateGitHubStatsSection(s, username));
        break;
      }
      case 'pinned_projects': {
        const s = block.settings as PinnedProjectsSettings;
        sections.push(generatePinnedProjectsSection(s, username));
        break;
      }
      case 'social_connect': {
        const s = block.settings as SocialLinksSettings;
        sections.push(generateSocialConnectSection(s, username));
        break;
      }
      case 'streak_trophies': {
        const s = block.settings as GitHubStatsSettings;
        sections.push(generateStreakTrophiesSection(s, username));
        break;
      }
    }
  }

  return sections.filter(Boolean).join('\n\n---\n\n');
}

/**
 * DESIGN 1: Apple-Inspired Bento Grid Dashboard (Top-Rated Profile README Layout)
 */
function generateBentoMarkdown(
  blocks: ReadmeBlockConfig[],
  profile: GitHubUserProfile | null,
  archetype: DeveloperArchetype | null,
  username: string,
  displayName: string
): string {
  const enabledMap = new Map<string, ReadmeBlockConfig>();
  for (const b of blocks) {
    if (b.enabled) enabledMap.set(b.id, b);
  }

  const output: string[] = [];

  // 1. Top Full-Width Hero Banner
  const heroBlock = enabledMap.get('hero');
  if (heroBlock) {
    const s = heroBlock.settings as HeroSettings;
    const roleLabel = archetype?.label || 'Full-Stack & AI Architect';
    const bannerTitle = encodeURIComponent(`Hi, I'm ${displayName} — ${roleLabel}`);
    const tagline = s.tagline || archetype?.tagline || 'Building scalable systems & high-craft developer tools.';
    const subTextEncoded = encodeURIComponent(tagline.slice(0, 65));
    const color = s.capsuleColor || '0:06b6d4,100:6366f1';
    const type = s.capsuleType || 'wave';

    output.push(`<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=${type}&color=${color}&height=175&section=header&text=${bannerTitle}&fontSize=32&fontColor=ffffff&fontAlignY=40&desc=${subTextEncoded}&descAlignY=64&descSize=16" width="100%" alt="${displayName} Banner" />
</div>`);
  }

  // 2. Build Modular Bento Cells in user's block order
  interface BentoCell {
    colSpan: 1 | 2;
    content: string;
  }

  const cells: BentoCell[] = [];
  let topLangsDeferredCell: BentoCell | null = null;

  for (const block of blocks) {
    if (!block.enabled) continue;

    switch (block.id) {
      case 'bio': {
        const s = block.settings as BioSettings;
        const roleBadge = encodeURIComponent(archetype?.label || 'Engineer').replace(/-/g, '--');
        const reposCount = profile?.public_repos ?? 24;
        const followersCount = profile?.followers ?? 120;

        const bullets: string[] = [];
        if (s.workingOn) bullets.push(`- 🔭 **Working on:** ${s.workingOn}`);
        if (s.learning) bullets.push(`- 🌱 **Learning:** ${s.learning}`);
        if (s.askMeAbout) bullets.push(`- 💬 **Ask me about:** ${s.askMeAbout}`);
        if (s.openFor) bullets.push(`- 💼 **Open for:** ${s.openFor}`);
        if (bullets.length === 0) {
          bullets.push(`- 🔭 **Working on:** High-impact open-source architecture`);
          bullets.push(`- 🌱 **Learning:** Distributed systems & AI tooling`);
        }

        const statusBadges = [
          `<img src="https://img.shields.io/badge/Role-${roleBadge}-0ea5e9?style=flat-square&logo=github&logoColor=white" alt="Role" />`,
          `<img src="https://img.shields.io/badge/Repos-${reposCount}-10b981?style=flat-square" alt="Repos" />`,
          `<img src="https://img.shields.io/badge/Followers-${followersCount}-8b5cf6?style=flat-square" alt="Followers" />`,
          `<img src="https://img.shields.io/badge/Status-Building-22c55e?style=flat-square" alt="Status" />`,
        ].join(' ');

        cells.push({
          colSpan: 1,
          content: `<h3>🧑‍💻 Developer Bio</h3>\n\n${bullets.join('\n')}\n\n<p>${statusBadges}</p>`,
        });
        break;
      }

      case 'github_stats': {
        const s = block.settings as GitHubStatsSettings;
        const theme = s.cardTheme || 'catppuccin_mocha';
        const { statsUrl, topLangsUrl } = buildCardUrls(username, theme, true, s.cardProvider);

        if (s.showOverallStats) {
          cells.push({
            colSpan: 1,
            content: `<h3>📊 GitHub Stats</h3>\n\n<p align="center">\n  <a href="https://github.com/${username}">\n    <img src="${statsUrl}" alt="${username}'s GitHub Stats" width="100%" />\n  </a>\n</p>`,
          });
        }

        if (s.showTopLangs) {
          topLangsDeferredCell = {
            colSpan: 1,
            content: `<h3>📈 Top Programming Languages</h3>\n\n<p align="center">\n  <a href="https://github.com/${username}">\n    <img src="${topLangsUrl}" alt="Top Programming Languages" width="100%" />\n  </a>\n</p>`,
          };
        }
        break;
      }

      case 'tech_stack': {
        const s = block.settings as TechStackSettings;
        const badgeStyle = s.badgeStyle || 'for-the-badge';
        const badges = s.selectedBadges || [];
        const badgeImgs =
          badges.length > 0
            ? badges
                .map((b) => `<img src="${buildBadgeUrl(b, badgeStyle)}" alt="${b.name}" />`)
                .join(' ')
            : `*No technologies selected.*`;

        cells.push({
          colSpan: 1,
          content: `<h3>🛠️ Technology Stack</h3>\n\n<p align="left">\n  ${badgeImgs}\n</p>`,
        });

        if (topLangsDeferredCell) {
          cells.push(topLangsDeferredCell);
          topLangsDeferredCell = null;
        }
        break;
      }

      case 'streak_trophies': {
        const s = block.settings as GitHubStatsSettings;
        const theme = s.cardTheme || 'catppuccin_mocha';
        if (s.showStreak) {
          const { streakUrl } = buildCardUrls(username, theme, true, s.cardProvider);
          cells.push({
            colSpan: s.showTrophies ? 1 : 2,
            content: `<h3>🔥 Contribution Streak</h3>\n\n<p align="center">\n  <img src="${streakUrl}" alt="${username}'s Streak" width="100%" />\n</p>`,
          });
        }
        if (s.showTrophies) {
          const trophyTheme =
            theme === 'tokyonight' ? 'tokyonight' : theme === 'dracula' ? 'dracula' : 'gruvbox';
          const trophyUrl = `https://github-profile-trophy.vercel.app/?username=${username}&theme=${trophyTheme}&no-frame=true&margin_w=4&column=4`;
          cells.push({
            colSpan: s.showStreak ? 1 : 2,
            content: `<h3>🏆 GitHub Trophies</h3>\n\n<p align="center">\n  <img src="${trophyUrl}" alt="${username}'s Trophies" width="100%" />\n</p>`,
          });
        }
        break;
      }

      case 'pinned_projects': {
        const s = block.settings as PinnedProjectsSettings;
        const projects = s.featuredProjects || [];
        for (const p of projects) {
          const demoLink = p.demoUrl ? ` &nbsp;•&nbsp; <a href="${p.demoUrl}">🌐 Live Demo</a>` : '';
          cells.push({
            colSpan: 1,
            content: `<h3>🚀 Featured Open Source Repository</h3>\n\n<h4>📌 <a href="${p.url}">${p.name}</a></h4>\n<p>${p.description || 'High-performance open-source repository.'}</p>\n<p><code>${p.language || 'TypeScript'}</code> &nbsp; ⭐ <b>${p.stars}</b> Stars &nbsp; 🍴 <b>${p.forks}</b> Forks${demoLink}</p>`,
          });
        }
        break;
      }

      case 'social_connect': {
        const s = block.settings as SocialLinksSettings;
        const socialSection = generateSocialConnectBadgesOnly(s, username);
        if (socialSection) {
          cells.push({
            colSpan: 2,
            content: `<div align="center">\n  <h3>🌐 Connect & Collaborate</h3>\n  <p>${socialSection}</p>\n</div>`,
          });
        }
        break;
      }
    }
  }

  // Flush topLangsDeferredCell if tech_stack was disabled or ordered before github_stats
  if (topLangsDeferredCell) {
    cells.push(topLangsDeferredCell);
  }

  // Render cells into a 2-column HTML Bento Grid table
  if (cells.length > 0) {
    const rows: string[] = [];
    let i = 0;
    while (i < cells.length) {
      const current = cells[i];
      if (current.colSpan === 2) {
        rows.push(`  <tr>\n    <td colspan="2" width="100%" valign="top">\n\n${current.content}\n\n</td>\n  </tr>`);
        i += 1;
      } else if (i + 1 < cells.length && cells[i + 1].colSpan === 1) {
        const next = cells[i + 1];
        rows.push(
          `  <tr>\n    <td width="50%" valign="top">\n\n${current.content}\n\n</td>\n    <td width="50%" valign="top">\n\n${next.content}\n\n</td>\n  </tr>`
        );
        i += 2;
      } else {
        rows.push(`  <tr>\n    <td colspan="2" width="100%" valign="top">\n\n${current.content}\n\n</td>\n  </tr>`);
        i += 1;
      }
    }

    output.push(`<table width="100%">\n${rows.join('\n')}\n</table>`);
  }

  return output.join('\n\n');
}

/**
 * DESIGN 2: Neofetch / Linux Terminal CLI Hacker Layout
 */
function generateTerminalMarkdown(
  blocks: ReadmeBlockConfig[],
  profile: GitHubUserProfile | null,
  archetype: DeveloperArchetype | null,
  username: string,
  displayName: string
): string {
  const enabledIds = new Set(blocks.filter((b) => b.enabled).map((b) => b.id));
  const bioBlock = blocks.find((b) => b.id === 'bio')?.settings as BioSettings | undefined;
  const techBlock = blocks.find((b) => b.id === 'tech_stack')?.settings as TechStackSettings | undefined;
  const statsBlock = blocks.find((b) => b.id === 'github_stats')?.settings as GitHubStatsSettings | undefined;
  const projectsBlock = blocks.find((b) => b.id === 'pinned_projects')?.settings as PinnedProjectsSettings | undefined;
  const socialBlock = blocks.find((b) => b.id === 'social_connect')?.settings as SocialLinksSettings | undefined;

  const role = archetype?.label || 'Systems Engineer';
  const topTech =
    techBlock?.selectedBadges
      ?.slice(0, 5)
      .map((b) => b.name)
      .join(' / ') || 'Rust / Go / TypeScript';
  const repos = profile?.public_repos ?? 42;
  const followers = profile?.followers ?? 256;

  const sections: string[] = [];

  if (enabledIds.has('hero') || enabledIds.has('bio')) {
    sections.push(`\`\`\`yaml
${username}@gitcanvas
---------------------
User:       ${displayName} (@${username})
Role:       ${role}
Uptime:     Active Open-Source Builder
Languages:  ${topTech}
Repos:      ${repos} public repositories
Followers:  ${followers} developers
Focus:      ${bioBlock?.workingOn?.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') || 'High-performance CLI & distributed systems'}
\`\`\``);
  }

  if (enabledIds.has('github_stats') && statsBlock) {
    const theme = statsBlock.cardTheme || 'tokyonight';
    const { statsUrl, streakUrl } = buildCardUrls(username, theme, true, statsBlock.cardProvider);
    sections.push(`<p align="center">
  <img src="${statsUrl}" height="165" alt="GitHub Stats" />
  <img src="${streakUrl}" height="165" alt="GitHub Streak" />
</p>`);
  }

  if (enabledIds.has('tech_stack') && techBlock) {
    sections.push(generateTechStackSection(techBlock));
  }

  if (enabledIds.has('pinned_projects') && projectsBlock) {
    sections.push(
      generatePinnedProjectsSection({ ...projectsBlock, displayStyle: 'table' }, username)
    );
  }

  if (enabledIds.has('social_connect') && socialBlock) {
    sections.push(generateSocialConnectSection(socialBlock, username));
  }

  return sections.filter(Boolean).join('\n\n---\n\n');
}

/**
 * DESIGN 3: Linear / Vercel Editorial Minimalist Layout
 */
function generateEditorialMarkdown(
  blocks: ReadmeBlockConfig[],
  profile: GitHubUserProfile | null,
  archetype: DeveloperArchetype | null,
  username: string,
  displayName: string
): string {
  const enabledIds = new Set(blocks.filter((b) => b.enabled).map((b) => b.id));
  const heroBlock = blocks.find((b) => b.id === 'hero')?.settings as HeroSettings | undefined;
  const bioBlock = blocks.find((b) => b.id === 'bio')?.settings as BioSettings | undefined;
  const techBlock = blocks.find((b) => b.id === 'tech_stack')?.settings as TechStackSettings | undefined;
  const projectsBlock = blocks.find((b) => b.id === 'pinned_projects')?.settings as PinnedProjectsSettings | undefined;
  const statsBlock = blocks.find((b) => b.id === 'github_stats')?.settings as GitHubStatsSettings | undefined;
  const socialBlock = blocks.find((b) => b.id === 'social_connect')?.settings as SocialLinksSettings | undefined;

  const tagline =
    heroBlock?.tagline ||
    archetype?.tagline ||
    'Designing and engineering high-precision software systems.';

  const topBadges = (techBlock?.selectedBadges || [])
    .slice(0, 6)
    .map((b) => `<img src="${buildBadgeUrl(b, 'flat-square')}" alt="${b.name}" />`)
    .join(' ');

  const sections: string[] = [];

  sections.push(`<div align="center">
  <h1>${displayName}</h1>
  <p><b>${archetype?.label || 'Software Architect'}</b> — ${tagline}</p>
  ${topBadges ? `<p>${topBadges}</p>` : ''}
</div>`);

  if (enabledIds.has('bio') && bioBlock) {
    sections.push(`<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h4>⚡ Current Focus</h4>
      <p>${bioBlock.workingOn || 'Building modern web & cloud infrastructure.'}</p>
    </td>
    <td width="50%" valign="top">
      <h4>🌱 Exploring</h4>
      <p>${bioBlock.learning || 'Next-gen system architecture & developer experience.'}</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4>💬 Core Domains</h4>
      <p>${bioBlock.askMeAbout || 'TypeScript, Distributed Systems, UI Architecture'}</p>
    </td>
    <td width="50%" valign="top">
      <h4>🤝 Collaboration</h4>
      <p>${bioBlock.openFor || 'Open-source advisories & technical architecture.'}</p>
    </td>
  </tr>
</table>`);
  }

  if (enabledIds.has('pinned_projects') && projectsBlock) {
    sections.push(
      generatePinnedProjectsSection({ ...projectsBlock, displayStyle: 'table' }, username)
    );
  }

  if (enabledIds.has('github_stats') && statsBlock) {
    sections.push(generateGitHubStatsSection({ ...statsBlock, hideBorder: true }, username));
  }

  if (enabledIds.has('social_connect') && socialBlock) {
    sections.push(
      generateSocialConnectSection({ ...socialBlock, badgeStyle: 'flat-square' }, username)
    );
  }

  return sections.filter(Boolean).join('\n\n---\n\n');
}

function generateHeroSection(
  s: HeroSettings,
  username: string,
  displayName: string,
  archetype: DeveloperArchetype | null
): string {
  const greeting = s.greeting || `Hi there, I'm ${displayName} 👋`;
  const tagline = s.tagline || archetype?.tagline || 'Building software that makes a difference.';

  if (s.style === 'capsule') {
    const color = s.capsuleColor || 'auto';
    const type = s.capsuleType || 'wave';
    const height = s.capsuleHeight || 180;
    const textEncoded = encodeURIComponent(displayName);
    const subTextEncoded = encodeURIComponent(tagline.slice(0, 50));
    return `<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=${type}&color=${color}&height=${height}&section=header&text=${textEncoded}&fontSize=48&fontAlignY=38&desc=${subTextEncoded}&descAlignY=62&descSize=18" width="100%" alt="${displayName} Header" />
  
  # ${greeting}
  
  > *${tagline}*
</div>`;
  }

  if (s.style === 'typing') {
    const lines =
      s.typingLines && s.typingLines.length > 0
        ? s.typingLines
        : [
            `Hi, I'm ${displayName}!`,
            archetype?.label || 'Software Engineer',
            'Welcome to my GitHub profile!',
          ];
    const encodedLines = encodeURIComponent(lines.join(';'));
    const color = s.typingColor || '38bdf8';
    return `<div align="center">
  # ${greeting}
  
  <a href="https://gitcanvas.dev">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=${color}&center=true&vCenter=true&width=500&lines=${encodedLines}" alt="Typing SVG" />
  </a>
  
  <p align="center">
    <em>${tagline}</em>
  </p>
</div>`;
  }

  if (s.style === 'ascii') {
    return `<div align="center">
${generateAsciiArt(displayName)}

# ${greeting}

> *${tagline}*
</div>`;
  }

  // Minimal style default
  return `<div align="center">
  <h1>${greeting}</h1>
  <p><strong>${archetype?.label || 'Software Developer'}</strong></p>
  <p><em>${tagline}</em></p>
</div>`;
}

function generateBioSection(s: BioSettings, displayName: string): string {
  const bullets: string[] = [];

  if (s.workingOn) {
    bullets.push(`- 🔭 &nbsp; **Working on:** ${s.workingOn}`);
  }
  if (s.learning) {
    bullets.push(`- 🌱 &nbsp; **Currently learning:** ${s.learning}`);
  }
  if (s.askMeAbout) {
    bullets.push(`- 💬 &nbsp; **Ask me about:** ${s.askMeAbout}`);
  }
  if (s.reachMe) {
    bullets.push(`- 📫 &nbsp; **How to reach me:** ${s.reachMe}`);
  }
  if (s.openFor) {
    bullets.push(`- 💼 &nbsp; **Open for:** ${s.openFor}`);
  }
  if (s.funFact) {
    bullets.push(`- ⚡ &nbsp; **Fun fact:** ${s.funFact}`);
  }

  if (bullets.length === 0) {
    bullets.push(`- 🔭 &nbsp; **Working on:** Innovative open-source projects`);
    bullets.push(
      `- 🌱 &nbsp; **Currently exploring:** Advanced system architectures & modern frameworks`
    );
    bullets.push(`- 💬 &nbsp; **Ask me about:** Web performance, distributed systems, clean code`);
  }

  return `### 🧑‍💻 &nbsp; About Me\n\n${bullets.join('\n')}`;
}

function generateTechStackSection(s: TechStackSettings): string {
  const badgeStyle = s.badgeStyle || 'for-the-badge';
  const badges = s.selectedBadges || [];

  if (badges.length === 0) {
    return `### 🛠️ &nbsp; Tech Stack\n\n*No technologies selected.*`;
  }

  if (s.showCategoryHeaders) {
    const categories: Record<string, TechBadgeItem[]> = {};
    for (const badge of badges) {
      if (!categories[badge.category]) categories[badge.category] = [];
      categories[badge.category].push(badge);
    }

    const categoryNames: Record<string, string> = {
      languages: '💻 Languages',
      frontend: '🎨 Frontend',
      backend: '⚙️ Backend',
      database: '🗄️ Databases',
      devops: '☁️ Cloud & DevOps',
      tools: '🔧 Tools & Ecosystem',
    };

    const lines: string[] = ['### 🛠️ &nbsp; Tech Stack\n'];
    for (const [catKey, catBadges] of Object.entries(categories)) {
      lines.push(`**${categoryNames[catKey] || catKey.toUpperCase()}**\n`);
      const badgeList = catBadges
        .map((b) => `<img src="${buildBadgeUrl(b, badgeStyle)}" alt="${b.name}" />`)
        .join(' ');
      lines.push(`${badgeList}\n`);
    }
    return lines.join('\n');
  }

  // Inline centered badges layout
  const badgeList = badges
    .map((b) => `<img src="${buildBadgeUrl(b, badgeStyle)}" alt="${b.name}" />`)
    .join(' ');

  const align = s.align || 'center';
  return `### 🛠️ &nbsp; Tech Stack\n\n<p align="${align}">\n  ${badgeList}\n</p>`;
}

function generateGitHubStatsSection(s: GitHubStatsSettings, username: string): string {
  const theme = s.cardTheme || 'catppuccin_mocha';
  const hideBorder = s.hideBorder ? true : false;
  const { statsUrl, topLangsUrl } = buildCardUrls(username, theme, hideBorder, s.cardProvider);

  const parts: string[] = ['### 📊 &nbsp; GitHub Analytics\n'];

  if (s.layout === 'side-by-side') {
    parts.push(`<p align="center">
  ${s.showOverallStats ? `<a href="https://github.com/${username}"><img src="${statsUrl}" alt="${username}'s GitHub Stats" height="175" /></a>` : ''}
  ${s.showTopLangs ? `<a href="https://github.com/${username}"><img src="${topLangsUrl}" alt="Top Languages" height="175" /></a>` : ''}
</p>`);
  } else {
    if (s.showOverallStats) {
      parts.push(
        `<p align="center">\n  <a href="https://github.com/${username}"><img src="${statsUrl}" alt="${username}'s GitHub Stats" /></a>\n</p>\n`
      );
    }
    if (s.showTopLangs) {
      parts.push(
        `<p align="center">\n  <a href="https://github.com/${username}"><img src="${topLangsUrl}" alt="Top Languages" /></a>\n</p>`
      );
    }
  }

  return parts.join('\n');
}

function generateStreakTrophiesSection(s: GitHubStatsSettings, username: string): string {
  const theme = s.cardTheme || 'catppuccin_mocha';
  const hideBorder = s.hideBorder ? true : false;
  const { streakUrl } = buildCardUrls(username, theme, hideBorder, s.cardProvider);

  const parts: string[] = ['### 🔥 &nbsp; Streak & Milestones\n'];

  if (s.showStreak) {
    parts.push(
      `<p align="center">\n  <a href="https://github.com/${username}"><img src="${streakUrl}" alt="${username}'s Streak" /></a>\n</p>\n`
    );
  }

  if (s.showTrophies) {
    const trophyTheme =
      theme === 'tokyonight' ? 'tokyonight' : theme === 'dracula' ? 'dracula' : 'gruvbox';
    const trophyUrl = `https://github-profile-trophy.vercel.app/?username=${username}&theme=${trophyTheme}&no-frame=${hideBorder}&margin_w=4`;
    parts.push(
      `<p align="center">\n  <a href="https://github.com/${username}"><img src="${trophyUrl}" alt="${username}'s Trophies" /></a>\n</p>`
    );
  }

  return parts.join('\n');
}

function generatePinnedProjectsSection(s: PinnedProjectsSettings, username: string): string {
  const projects = s.featuredProjects || [];
  if (projects.length === 0) {
    return '';
  }

  if (s.displayStyle === 'table') {
    const rows = projects.map((p) => {
      const demoCol = p.demoUrl ? `<a href="${p.demoUrl}">Demo</a>` : '—';
      const stats = `⭐ ${p.stars} &nbsp; 🍴 ${p.forks}`;
      return `| **[${p.name}](${p.url})** | ${p.description || 'No description provided.'} | \`${p.language || 'Code'}\` | ${stats} | ${demoCol} |`;
    });

    return `### 🚀 &nbsp; Featured Projects

| Repository | Description | Language | Stats | Live |
|:-----------|:------------|:---------|:------|:----:|
${rows.join('\n')}`;
  }

  // Cards layout default
  const cardList = projects.map((p) => {
    return `<div align="left">

#### 📌 &nbsp; [${p.name}](${p.url})
> ${p.description || 'Open source project built with high code quality.'}

\`${p.language || 'Code'}\` &nbsp; • &nbsp; ⭐ **${p.stars}** &nbsp; • &nbsp; 🍴 **${p.forks}** ${p.demoUrl ? `&nbsp; • &nbsp; 🔗 [Live Preview](${p.demoUrl})` : ''}

</div>`;
  });

  return `### 🚀 &nbsp; Featured Projects\n\n${cardList.join('\n\n')}`;
}

function generateSocialConnectBadgesOnly(s: SocialLinksSettings, username: string): string {
  const links = s.links || ({} as any);
  const badgeStyle = s.badgeStyle || 'for-the-badge';
  const badges: string[] = [];

  if (links.github || username) {
    const ghUser = links.github || username;
    badges.push(
      `<a href="https://github.com/${ghUser}" target="_blank"><img src="https://img.shields.io/badge/GitHub-181717?style=${badgeStyle}&logo=github&logoColor=white" alt="GitHub" /></a>`
    );
  }
  if (links.linkedin) {
    const url = links.linkedin.startsWith('http')
      ? links.linkedin
      : `https://linkedin.com/in/${links.linkedin}`;
    badges.push(
      `<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=${badgeStyle}&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>`
    );
  }
  if (links.twitter) {
    const twUser = links.twitter.replace(/^@/, '');
    const url = links.twitter.startsWith('http') ? links.twitter : `https://x.com/${twUser}`;
    badges.push(
      `<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/X-000000?style=${badgeStyle}&logo=x&logoColor=white" alt="X / Twitter" /></a>`
    );
  }
  if (links.portfolio) {
    const url = links.portfolio.startsWith('http')
      ? links.portfolio
      : `https://${links.portfolio}`;
    badges.push(
      `<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/Portfolio-2563EB?style=${badgeStyle}&logo=googlechrome&logoColor=white" alt="Portfolio" /></a>`
    );
  }
  if (links.discord) {
    const url = links.discord.startsWith('http')
      ? links.discord
      : `https://discord.gg/${links.discord}`;
    badges.push(
      `<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/Discord-5865F2?style=${badgeStyle}&logo=discord&logoColor=white" alt="Discord" /></a>`
    );
  }
  if (links.youtube) {
    const url = links.youtube.startsWith('http')
      ? links.youtube
      : `https://youtube.com/@${links.youtube}`;
    badges.push(
      `<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/YouTube-FF0000?style=${badgeStyle}&logo=youtube&logoColor=white" alt="YouTube" /></a>`
    );
  }
  if (links.substack) {
    const url = links.substack.startsWith('http')
      ? links.substack
      : `https://${links.substack}.substack.com`;
    badges.push(
      `<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/Substack-FF6719?style=${badgeStyle}&logo=substack&logoColor=white" alt="Substack" /></a>`
    );
  }
  if (links.email) {
    const mailto = links.email.startsWith('mailto:') ? links.email : `mailto:${links.email}`;
    badges.push(
      `<a href="${mailto}"><img src="https://img.shields.io/badge/Email-D14836?style=${badgeStyle}&logo=gmail&logoColor=white" alt="Email" /></a>`
    );
  }

  return badges.join(' ');
}

function generateSocialConnectSection(s: SocialLinksSettings, username: string): string {
  const align = s.align || 'center';
  const badgeStr = generateSocialConnectBadgesOnly(s, username);
  if (!badgeStr) return '';

  return `### 🌐 &nbsp; Connect With Me\n\n<p align="${align}">\n  ${badgeStr}\n</p>`;
}
