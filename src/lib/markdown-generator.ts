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
} from '@/types';
import { buildBadgeUrl } from './tech-catalog';

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
  archetype: DeveloperArchetype | null
): string {
  const username = profile?.login || 'octocat';
  const displayName = profile?.name || username;

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

  // Join sections with clean double linebreaks
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
    const lines = s.typingLines && s.typingLines.length > 0
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
    bullets.push(`- 🌱 &nbsp; **Currently exploring:** Advanced system architectures & modern frameworks`);
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
  const hideBorder = s.hideBorder ? 'true' : 'false';

  const parts: string[] = ['### 📊 &nbsp; GitHub Analytics\n'];

  const statsUrl = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}&hide_border=${hideBorder}&rank_icon=github&count_private=true`;
  const topLangsUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}&hide_border=${hideBorder}&langs_count=8`;

  if (s.layout === 'side-by-side') {
    parts.push(`<p align="center">
  ${s.showOverallStats ? `<a href="https://github.com/${username}"><img src="${statsUrl}" alt="${username}'s GitHub Stats" height="175" /></a>` : ''}
  ${s.showTopLangs ? `<a href="https://github.com/${username}"><img src="${topLangsUrl}" alt="Top Languages" height="175" /></a>` : ''}
</p>`);
  } else {
    if (s.showOverallStats) {
      parts.push(`<p align="center">\n  <a href="https://github.com/${username}"><img src="${statsUrl}" alt="${username}'s GitHub Stats" /></a>\n</p>\n`);
    }
    if (s.showTopLangs) {
      parts.push(`<p align="center">\n  <a href="https://github.com/${username}"><img src="${topLangsUrl}" alt="Top Languages" /></a>\n</p>`);
    }
  }

  return parts.join('\n');
}

function generateStreakTrophiesSection(s: GitHubStatsSettings, username: string): string {
  const theme = s.cardTheme || 'catppuccin_mocha';
  const hideBorder = s.hideBorder ? 'true' : 'false';

  const parts: string[] = ['### 🔥 &nbsp; Streak & Milestones\n'];

  if (s.showStreak) {
    const streakUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${theme}&hide_border=${hideBorder}`;
    parts.push(`<p align="center">\n  <a href="https://github.com/${username}"><img src="${streakUrl}" alt="${username}'s Streak" /></a>\n</p>\n`);
  }

  if (s.showTrophies) {
    const trophyTheme = theme === 'tokyonight' ? 'tokyonight' : theme === 'dracula' ? 'dracula' : 'gruvbox';
    const trophyUrl = `https://github-profile-trophy.vercel.app/?username=${username}&theme=${trophyTheme}&no-frame=${hideBorder}&margin_w=4`;
    parts.push(`<p align="center">\n  <a href="https://github.com/${username}"><img src="${trophyUrl}" alt="${username}'s Trophies" /></a>\n</p>`);
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

function generateSocialConnectSection(s: SocialLinksSettings, username: string): string {
  const links = s.links || ({} as any);
  const badgeStyle = s.badgeStyle || 'for-the-badge';
  const align = s.align || 'center';

  const badges: string[] = [];

  if (links.github || username) {
    const ghUser = links.github || username;
    badges.push(`<a href="https://github.com/${ghUser}" target="_blank"><img src="https://img.shields.io/badge/GitHub-181717?style=${badgeStyle}&logo=github&logoColor=white" alt="GitHub" /></a>`);
  }
  if (links.linkedin) {
    const url = links.linkedin.startsWith('http') ? links.linkedin : `https://linkedin.com/in/${links.linkedin}`;
    badges.push(`<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=${badgeStyle}&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>`);
  }
  if (links.twitter) {
    const twUser = links.twitter.replace(/^@/, '');
    const url = links.twitter.startsWith('http') ? links.twitter : `https://x.com/${twUser}`;
    badges.push(`<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/X-000000?style=${badgeStyle}&logo=x&logoColor=white" alt="X / Twitter" /></a>`);
  }
  if (links.portfolio) {
    const url = links.portfolio.startsWith('http') ? links.portfolio : `https://${links.portfolio}`;
    badges.push(`<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/Portfolio-2563EB?style=${badgeStyle}&logo=googlechrome&logoColor=white" alt="Portfolio" /></a>`);
  }
  if (links.discord) {
    const url = links.discord.startsWith('http') ? links.discord : `https://discord.gg/${links.discord}`;
    badges.push(`<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/Discord-5865F2?style=${badgeStyle}&logo=discord&logoColor=white" alt="Discord" /></a>`);
  }
  if (links.youtube) {
    const url = links.youtube.startsWith('http') ? links.youtube : `https://youtube.com/@${links.youtube}`;
    badges.push(`<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/YouTube-FF0000?style=${badgeStyle}&logo=youtube&logoColor=white" alt="YouTube" /></a>`);
  }
  if (links.substack) {
    const url = links.substack.startsWith('http') ? links.substack : `https://${links.substack}.substack.com`;
    badges.push(`<a href="${url}" target="_blank"><img src="https://img.shields.io/badge/Substack-FF6719?style=${badgeStyle}&logo=substack&logoColor=white" alt="Substack" /></a>`);
  }
  if (links.email) {
    const mailto = links.email.startsWith('mailto:') ? links.email : `mailto:${links.email}`;
    badges.push(`<a href="${mailto}"><img src="https://img.shields.io/badge/Email-D14836?style=${badgeStyle}&logo=gmail&logoColor=white" alt="Email" /></a>`);
  }

  if (badges.length === 0) return '';

  return `### 🌐 &nbsp; Connect With Me\n\n<p align="${align}">\n  ${badges.join(' ')}\n</p>`;
}
