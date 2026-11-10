import {
  ProfileItemData,
  PinnedProjectItem,
  LanguagesItemData,
  GradedMetricItemData,
  OverallItemData,
  StreakMetricItemData,
  ContributionsItemData,
  FullCanvasData,
  FullCanvasRenderOptions,
} from '@/types/stats';
import { getDesignTheme } from './themes';
import { getDesignFont } from './fonts';

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 10_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

function wrapTextTwoLines(
  rawText: string,
  maxLine1 = 34,
  maxLine2 = 34
): [string, string] {
  const clean = rawText.trim().replace(/\s+/g, ' ');
  if (clean.length <= maxLine1) {
    return [clean, ''];
  }

  // Find last space at or before maxLine1 so we never split a word in half
  const slice1 = clean.slice(0, maxLine1 + 1);
  const lastSpace = slice1.lastIndexOf(' ');

  let line1 = '';
  let remainder = '';

  if (lastSpace > 16) {
    line1 = clean.slice(0, lastSpace).trimEnd();
    remainder = clean.slice(lastSpace + 1).trimStart();
  } else {
    line1 = clean.slice(0, maxLine1).trimEnd();
    remainder = clean.slice(maxLine1).trimStart();
  }

  const line2 = remainder ? truncateText(remainder, maxLine2) : '';
  return [line1, line2];
}

// ==========================================================
// 1. PROFILE HEADER CARD (PFP + Name + @nickname)
// ==========================================================
export function designProfileCard(
  profile: ProfileItemData,
  themeId?: string | null,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const name = escapeXml(truncateText(profile.name || profile.username, 22));
  const nickname = escapeXml(`@${profile.username}`);
  const avatarHref = profile.avatarBase64 || profile.avatarUrl;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="96" viewBox="0 0 420 96" fill="none" role="img" aria-label="${name} (${nickname})">
  <defs>
    <clipPath id="pfpClip">
      <rect x="8" y="8" width="80" height="80" rx="14" />
    </clipPath>
    <style>
      ${font.svgImportUrl}
      .name { font: 800 26px ${font.fontFamily}; fill: ${theme.textPrimary}; }
      .nick { font: 600 18px ${font.fontFamily}; fill: ${theme.textSecondary}; }
    </style>
  </defs>

  <!-- PFP Frame -->
  <rect x="8" y="8" width="80" height="80" rx="14" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="2" />
  ${
    avatarHref
      ? `<image href="${escapeXml(avatarHref)}" x="8" y="8" width="80" height="80" clip-path="url(#pfpClip)" preserveAspectRatio="xMidYMid slice" />`
      : `<text x="48" y="55" text-anchor="middle" font-size="22" font-weight="700" fill="${theme.textSecondary}" font-family="sans-serif">PFP</text>`
  }
  <rect x="8" y="8" width="80" height="80" rx="14" fill="none" stroke="${theme.border}" stroke-width="2" />

  <!-- Name & @nickname -->
  <text x="104" y="44" class="name">${name}</text>
  <text x="104" y="72" class="nick">${nickname}</text>
</svg>`;
}

// ==========================================================
// 2. SOCIAL HEADER ITEM CARD (Email, LinkedIn, Portfolio, etc.)
// ==========================================================
export function designSocialItemCard(
  type: string,
  label: string,
  themeId?: string | null,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const safeLabel = escapeXml(truncateText(label, 12));
  const norm = type.toLowerCase();

  let iconSvg = '';
  if (norm === 'email') {
    iconSvg = `<path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2l8 5 8-5" stroke="${theme.textPrimary}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  } else if (norm === 'linkedin') {
    iconSvg = `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" stroke="${theme.textPrimary}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="4" cy="4" r="2" fill="${theme.textPrimary}"/>`;
  } else if (norm === 'portfolio' || norm === 'website') {
    iconSvg = `<circle cx="12" cy="12" r="9" stroke="${theme.textPrimary}" stroke-width="1.8" fill="none"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 0 0 0 18 14.5 14.5 0 0 0 0-18z" stroke="${theme.textPrimary}" stroke-width="1.6" fill="none"/>`;
  } else if (norm === 'twitter' || norm === 'x') {
    iconSvg = `<path d="M4 4l6.5 8L4 20h2l5.5-6.8L16 20h4l-6.8-8.5L19.5 4h-2l-5 6.2L8 4H4z" stroke="${theme.textPrimary}" stroke-width="1.6" stroke-linejoin="round" fill="none"/>`;
  } else if (norm === 'youtube') {
    iconSvg = `<rect x="2" y="5" width="20" height="14" rx="4" stroke="${theme.textPrimary}" stroke-width="1.8" fill="none"/><polygon points="10,9 16,12 10,15" fill="${theme.textPrimary}"/>`;
  } else if (norm === 'discord') {
    iconSvg = `<path d="M8 8a10 10 0 0 1 8 0M6 16c2 1.5 10 1.5 12 0M5.5 7.5C4.2 10 3.8 13.5 4.5 16.5c1.5 1.2 3 1.8 4 2l.8-1.6m9.2-9.4c1.3 2.5 1.7 6 1 9-1.5 1.2-3 1.8-4 2l-.8-1.6" stroke="${theme.textPrimary}" stroke-width="1.6" stroke-linecap="round" fill="none"/><circle cx="9.5" cy="12.5" r="1.2" fill="${theme.textPrimary}"/><circle cx="14.5" cy="12.5" r="1.2" fill="${theme.textPrimary}"/>`;
  } else {
    iconSvg = `<circle cx="12" cy="12" r="8" stroke="${theme.textPrimary}" stroke-width="1.8" fill="none"/><path d="M9 12l2 2 4-4" stroke="${theme.textPrimary}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="64" viewBox="0 0 96 64" fill="none" role="img" aria-label="${safeLabel}">
  <rect x="1" y="1" width="94" height="62" rx="12" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1.5" />
  <g transform="translate(36, 10) scale(0.95)">
    ${iconSvg}
  </g>
  <text x="48" y="50" text-anchor="middle" font-size="12" font-weight="600" fill="${theme.textSecondary}" font-family="${font.fontFamily}">${safeLabel}</text>
</svg>`;
}

// ==========================================================
// 3. PINNED PROJECT CARD (Compact 3-in-a-row Grid)
// ==========================================================
export function designPinnedProjectCard(
  project: PinnedProjectItem,
  themeId?: string | null,
  width = 256,
  height = 96,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const name = escapeXml(truncateText(project.name, 22));
  const safeId = project.name.replace(/[^a-zA-Z0-9_-]/g, '_') || 'repo';
  const rawDesc = project.description || 'Open-source repository on GitHub.';
  const [rawLine1, rawLine2] = wrapTextTwoLines(rawDesc, 34, 34);
  const line1 = escapeXml(rawLine1);
  const line2 = escapeXml(rawLine2);
  const lang = escapeXml(truncateText(project.language || 'Code', 10));
  const langColor = project.languageColor || theme.accent;
  const stars = formatCompactNumber(project.stars);
  const forks = formatCompactNumber(project.forks);

  const descY1 = line2 ? 39 : 43;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="Pinned Project: ${name}">
  <defs>
    <linearGradient id="projGrad_${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgGradientEnd}" />
    </linearGradient>
    <style>
      ${font.svgImportUrl}
      .proj-title { font: 600 13px ${font.fontFamily}; fill: ${theme.textPrimary}; }
      .proj-desc { font: 400 10.5px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .proj-meta { font: 500 10px ${font.fontFamily}; fill: ${theme.textSecondary}; }
    </style>
  </defs>

  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${theme.borderRadius}" fill="url(#projGrad_${safeId})" stroke="${theme.border}" stroke-width="1.5" />

  <!-- Repo Icon + Title -->
  <g transform="translate(14, 16)">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" fill="${theme.textSecondary}" transform="scale(0.85) translate(0, -1)" />
    <text x="18" y="10" class="proj-title">${name}</text>
  </g>

  <!-- Description -->
  <text x="14" y="${descY1}" class="proj-desc">${line1}</text>
  ${line2 ? `<text x="14" y="53" class="proj-desc">${line2}</text>` : ''}

  <!-- Bottom Footer: Language + Stars + Forks -->
  <g transform="translate(14, 78)">
    <circle cx="4" cy="-3.5" r="3" fill="${langColor}" />
    <text x="12" y="0" class="proj-meta">${lang}</text>

    <!-- Star Octicon + Count -->
    <g transform="translate(112, -9)">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" fill="${theme.textSecondary}" transform="scale(0.75)" />
      <text x="15" y="9" class="proj-meta">${stars}</text>
    </g>

    <!-- Fork Octicon + Count -->
    <g transform="translate(170, -9)">
      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" fill="${theme.textSecondary}" transform="scale(0.75)" />
      <text x="14" y="9" class="proj-meta">${forks}</text>
    </g>
  </g>
</svg>`;
}

// ==========================================================
// 4. LANGUAGES BAR CARD (Horizontal Segmented Bar + Labels Underneath)
// ==========================================================
export function designLanguagesBarCard(
  data: LanguagesItemData,
  themeId?: string | null,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const langs = (data.languages || []).slice(0, 7);
  const totalBytes = langs.reduce((acc, l) => acc + l.bytes, 0) || 1;

  const barX = 20;
  const barY = 14;
  const barWidth = 760;
  const barHeight = 8;
  const cardHeight = 58;

  // Compute normalized widths so every language is visible (min 6px) and total sum === barWidth (760px)
  const minSegWidth = langs.length > 1 ? 6 : barWidth;
  const rawWidths = langs.map((lang) =>
    Math.max(minSegWidth, (lang.bytes / totalBytes) * barWidth)
  );
  const rawSum = rawWidths.reduce((a, b) => a + b, 0) || 1;
  const normalizedWidths = rawWidths.map((w) =>
    Math.max(minSegWidth, Math.round((w / rawSum) * barWidth))
  );

  // Adjust largest segment so exact sum equals barWidth (760px)
  if (normalizedWidths.length > 0) {
    const currentSum = normalizedWidths.reduce((a, b) => a + b, 0);
    const diff = barWidth - currentSum;
    let maxIdx = 0;
    for (let i = 1; i < normalizedWidths.length; i++) {
      if (normalizedWidths[i] > normalizedWidths[maxIdx]) maxIdx = i;
    }
    normalizedWidths[maxIdx] = Math.max(minSegWidth, normalizedWidths[maxIdx] + diff);
  }

  let currentX = barX;
  const segments: string[] = [];
  const dividers: string[] = [];

  langs.forEach((lang, idx) => {
    const w =
      idx === langs.length - 1
        ? Math.max(4, barX + barWidth - currentX)
        : normalizedWidths[idx];

    segments.push(
      `<rect x="${currentX}" y="${barY}" width="${w}" height="${barHeight}" fill="${lang.color || theme.accent}" />`
    );

    if (idx > 0 && currentX > barX && currentX < barX + barWidth) {
      dividers.push(
        `<line x1="${currentX}" y1="${barY}" x2="${currentX}" y2="${barY + barHeight}" stroke="${theme.cardBg}" stroke-width="1.5" />`
      );
    }
    currentX += w;
  });

  // Labels placed underneath the bar
  const slotWidth = Math.floor(barWidth / Math.max(langs.length, 1));
  const labels = langs.map((lang, idx) => {
    const x = barX + idx * slotWidth;
    const safeName = escapeXml(truncateText(lang.name, 12));
    return `<g transform="translate(${x}, 38)">
      <circle cx="4" cy="-3.5" r="3" fill="${lang.color || theme.accent}" />
      <text x="12" y="0" font-size="11" font-weight="600" fill="${theme.textPrimary}" font-family="${font.fontFamily}">${safeName}</text>
      <text x="12" y="13" font-size="9.5" font-weight="400" fill="${theme.textSecondary}" font-family="${font.fontFamily}">${lang.percentage}%</text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${cardHeight}" viewBox="0 0 800 ${cardHeight}" fill="none" role="img" aria-label="Languages Distribution">
  <defs>
    <clipPath id="langBarClip">
      <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="4" />
    </clipPath>
  </defs>

  <rect x="0" y="0" width="800" height="${cardHeight}" rx="${theme.borderRadius}" fill="${theme.cardBg}" />

  <!-- Segmented Proportional Bar -->
  <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="4" fill="${theme.cardBg}" />
  <g clip-path="url(#langBarClip)">
    ${segments.join('\n    ')}
    ${dividers.join('\n    ')}
  </g>

  <!-- Language Names Underneath -->
  ${labels.join('\n  ')}
</svg>`;
}

// ==========================================================
// 5. GRADED STAT BOX (commits, PR, issues, stars earned, Repos, Polyglot)
// ==========================================================
export function designGradedStatBox(
  data: GradedMetricItemData,
  themeId?: string | null,
  width = 192,
  height = 98,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const label = escapeXml(data.label);
  const valStr = escapeXml(formatCompactNumber(data.value));
  const grade = data.grade;
  const gColor = theme.gradeColors[grade] || theme.gradeColors.C;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="${label}: ${valStr} (Grade ${grade})">
  <defs>
    <linearGradient id="statGrad_${data.item}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgGradientEnd}" />
    </linearGradient>
    <style>
      ${font.svgImportUrl}
      .stat-label { font: 600 13.5px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .stat-value { font: 800 28px ${font.fontFamily}; fill: ${theme.textPrimary}; }
      .stat-grade-${data.item} { font: 800 15px ${font.fontFamily}; fill: ${gColor.text}; }
    </style>
  </defs>

  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${theme.borderRadius}" fill="url(#statGrad_${data.item})" stroke="${theme.border}" stroke-width="1.5" />

  <!-- Top-Left Label -->
  <text x="16" y="28" class="stat-label">${label}</text>

  <!-- Top-Right Grade Pill -->
  <g transform="translate(${width - 42}, 11)">
    <rect x="0" y="0" width="26" height="24" rx="7" fill="${gColor.bg}" stroke="${gColor.border}" stroke-width="1.2" />
    <text x="13" y="17" text-anchor="middle" class="stat-grade-${data.item}" fill="${gColor.text}">${grade}</text>
  </g>

  <!-- Main Value -->
  <text x="16" y="${height - 20}" class="stat-value">${valStr}</text>
</svg>`;
}

// ==========================================================
// 6. OVERALL GRADE BOX ('overall' -> C / B / A / S)
// ==========================================================
export function designOverallBox(
  data: OverallItemData,
  themeId?: string | null,
  width = 258,
  height = 104,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const grade = data.grade;
  const gColor = theme.gradeColors[grade] || theme.gradeColors.C;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="overall grade: ${grade}">
  <defs>
    <linearGradient id="overallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgGradientEnd}" />
    </linearGradient>
    <style>
      ${font.svgImportUrl}
      .ov-label { font: 600 14px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .ov-grade { font: 900 42px ${font.fontFamily}; fill: ${gColor.text}; }
    </style>
  </defs>

  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${theme.borderRadius}" fill="url(#overallGrad)" stroke="${theme.border}" stroke-width="1.5" />

  <text x="${width / 2}" y="28" text-anchor="middle" class="ov-label">overall</text>
  <text x="${width / 2}" y="${height - 18}" text-anchor="middle" class="ov-grade" fill="${gColor.text}">${grade}</text>
</svg>`;
}

// ==========================================================
// 7. STREAK METRIC BOX ('streak', 'longest streak', 'active days this year')
// ==========================================================
export function designStreakBox(
  data: StreakMetricItemData,
  themeId?: string | null,
  width = 258,
  height = 104,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const label = escapeXml(data.label);
  const formatted = escapeXml(data.formatted);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="${label}: ${formatted}">
  <defs>
    <linearGradient id="streakGrad_${data.item}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgGradientEnd}" />
    </linearGradient>
    <style>
      ${font.svgImportUrl}
      .st-label { font: 600 14px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .st-val { font: 800 28px ${font.fontFamily}; fill: ${theme.textPrimary}; }
    </style>
  </defs>

  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${theme.borderRadius}" fill="url(#streakGrad_${data.item})" stroke="${theme.border}" stroke-width="1.5" />

  <text x="18" y="30" class="st-label">${label}</text>
  <text x="18" y="${height - 20}" class="st-val">${formatted}</text>
</svg>`;
}

// ==========================================================
// 8. CONTRIBUTIONS LAST YEAR BOX (Full-width bottom box with grid)
// ==========================================================
export function designContributionsBox(
  data: ContributionsItemData,
  themeId?: string | null,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const rightLabel = escapeXml(data.rightLabel);
  const weeks = (data.weeks || []).slice(-53);

  // Align heatmap grid flush with left label (x=22) and right label (x=778 => total width 756)
  const gridStartX = 22;
  const gridStartY = 48;
  const targetGridWidth = 756;
  const numWeeks = Math.max(weeks.length, 52);
  const cellSize = 11;
  const stepX =
    numWeeks > 1 ? (targetGridWidth - cellSize) / (numWeeks - 1) : 14.2;
  const stepY = 14.2;

  const cells: string[] = [];

  weeks.forEach((week, wIdx) => {
    const days = week.contributionDays || [];
    days.forEach((day, dIdx) => {
      const count = day.contributionCount || 0;
      let level = 0;
      if (count >= 10) level = 4;
      else if (count >= 6) level = 3;
      else if (count >= 3) level = 2;
      else if (count >= 1) level = 1;

      const color = theme.heatmapLevels[level];
      const x = (gridStartX + wIdx * stepX).toFixed(1);
      const y = (gridStartY + dIdx * stepY).toFixed(1);

      cells.push(
        `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2.5" fill="${color}" />`
      );
    });
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="166" viewBox="0 0 800 166" fill="none" role="img" aria-label="contributions last year: ${rightLabel}">
  <defs>
    <linearGradient id="contribGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgGradientEnd}" />
    </linearGradient>
    <style>
      ${font.svgImportUrl}
      .c-title { font: 600 14px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .c-right { font: 700 14px ${font.fontFamily}; fill: ${theme.textPrimary}; }
    </style>
  </defs>

  <rect x="1" y="1" width="798" height="164" rx="${theme.borderRadius}" fill="url(#contribGrad)" stroke="${theme.border}" stroke-width="1.5" />

  <!-- Top Left & Top Right Labels -->
  <text x="22" y="29" class="c-title">contributions last year</text>
  <text x="778" y="29" text-anchor="end" class="c-right">${rightLabel}</text>

  <!-- Contribution Calendar Grid -->
  ${cells.join('\n  ')}
</svg>`;
}

// ==========================================================
// 9. FULL COMPOSITE PROFILE CANVAS CARD (Single-Line API)
// ==========================================================
function embedSubSvg(
  svgMarkup: string,
  x: number,
  y: number,
  width?: number,
  height?: number
): string {
  const widthMatch = svgMarkup.match(/\bwidth="(\d+(?:\.\d+)?)"/);
  const heightMatch = svgMarkup.match(/\bheight="(\d+(?:\.\d+)?)"/);
  const viewBoxMatch = svgMarkup.match(/\bviewBox="([^"]+)"/);

  const origW = widthMatch ? Number(widthMatch[1]) : 100;
  const origH = heightMatch ? Number(heightMatch[1]) : 100;
  const targetW = width ?? origW;
  const targetH = height ?? origH;
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : `0 0 ${origW} ${origH}`;

  return svgMarkup.replace(
    /^<svg[^>]*>/,
    `<svg x="${x}" y="${y}" width="${targetW}" height="${targetH}" viewBox="${viewBox}" fill="none">`
  );
}

export function designFullCanvasCard(
  data: FullCanvasData,
  options?: FullCanvasRenderOptions
): string {
  const themeId = options?.theme;
  const theme = getDesignTheme(themeId);
  const fontId = options?.font;
  const font = getDesignFont(fontId);
  const canvasWidth = 840;
  const padX = 20;
  const innerWidth = 800; // 840 - 2 * 20

  const socials =
    options?.socials !== undefined
      ? options.socials
      : [
          { type: 'email', label: 'email' },
          { type: 'linkedin', label: 'LinkedIn' },
          { type: 'website', label: 'Portfolio' },
        ];

  const sections =
    options?.sections && options.sections.length > 0
      ? options.sections
      : ['pinned_projects', 'tech_stack', 'github_stats', 'streak_trophies'];

  const hideRows = new Set(options?.hideRows || []);

  const elements: string[] = [];
  let y = 20;

  const showProfile = !options?.hideProfile;
  const visibleSocials = (socials || []).slice(0, 4);

  // 1. Header Row: Profile Card (Left) + Social Item Cards (Right)
  if (showProfile || visibleSocials.length > 0) {
    if (showProfile) {
      elements.push(
        embedSubSvg(
          designProfileCard(data.profile, themeId, fontId),
          padX,
          y,
          420,
          96
        )
      );
    }

    if (visibleSocials.length > 0) {
      const socialW = 96;
      const socialH = 64;
      const socialGap = 10;
      const totalSocialsW =
        visibleSocials.length * socialW +
        (visibleSocials.length - 1) * socialGap;
      const startX = padX + innerWidth - totalSocialsW;
      const socialY = showProfile ? y + 16 : y + 4;

      visibleSocials.forEach((soc, idx) => {
        const sx = startX + idx * (socialW + socialGap);
        elements.push(
          embedSubSvg(
            designSocialItemCard(soc.type, soc.label, themeId, fontId),
            sx,
            socialY,
            socialW,
            socialH
          )
        );
      });
    }

    y += (showProfile ? 96 : 72) + 14;

    // Optional Tagline
    if (showProfile && options?.tagline && options.tagline.trim().length > 0) {
      const safeTagline = escapeXml(truncateText(options.tagline.trim(), 96));
      elements.push(
        `<text x="${padX + 8}" y="${y + 14}" class="canvas-tagline">${safeTagline}</text>`
      );
      y += 26;
    }

    // Divider Line under Header
    elements.push(
      `<line x1="${padX}" y1="${y}" x2="${padX + innerWidth}" y2="${y}" stroke="${theme.border}" stroke-width="1.5" />`
    );
    y += 24;
  }

  const renderSectionHeading = (title: string) => {
    elements.push(
      `<text x="${padX + 2}" y="${y + 20}" class="canvas-section-title">${escapeXml(title)}</text>`
    );
    y += 32;
  };

  const renderStatsRows = (rowIds: string[]) => {
    const activeRows = rowIds.filter((r) => !hideRows.has(r));
    if (activeRows.length === 0) return;

    renderSectionHeading('Github stats');

    activeRows.forEach((rowId) => {
      if (rowId === 'r1') {
        // Row 1: commits | PR | issues | stars earned (4 x 191 + 3 x 12 = 800px)
        const boxW = 191;
        const boxH = 98;
        const gap = 12;
        const r1Items = [data.commits, data.prs, data.issues, data.stars];
        r1Items.forEach((metric, idx) => {
          const bx = padX + idx * (boxW + gap);
          elements.push(
            embedSubSvg(
              designGradedStatBox(metric, themeId, boxW, boxH, fontId),
              bx,
              y,
              boxW,
              boxH
            )
          );
        });
        y += boxH + 14;
      } else if (rowId === 'r2') {
        // Row 2: Repos | Polyglot | overall (3 x 258 + 2 x 13 = 800px)
        const boxW = 258;
        const boxH = 104;
        const gap = 13;
        elements.push(
          embedSubSvg(
            designGradedStatBox(data.repos, themeId, boxW, boxH, fontId),
            padX,
            y,
            boxW,
            boxH
          )
        );
        elements.push(
          embedSubSvg(
            designGradedStatBox(data.polyglot, themeId, boxW, boxH, fontId),
            padX + (boxW + gap),
            y,
            boxW,
            boxH
          )
        );
        elements.push(
          embedSubSvg(
            designOverallBox(data.overall, themeId, boxW, boxH, fontId),
            padX + 2 * (boxW + gap),
            y,
            boxW,
            boxH
          )
        );
        y += boxH + 14;
      } else if (rowId === 'r3') {
        // Row 3: streak | longest streak | active days (3 x 258 + 2 x 13 = 800px)
        const boxW = 258;
        const boxH = 104;
        const gap = 13;
        const r3Items = [data.streak, data.longestStreak, data.activeDays];
        r3Items.forEach((metric, idx) => {
          const bx = padX + idx * (boxW + gap);
          elements.push(
            embedSubSvg(
              designStreakBox(metric, themeId, boxW, boxH, fontId),
              bx,
              y,
              boxW,
              boxH
            )
          );
        });
        y += boxH + 14;
      } else if (rowId === 'r4') {
        // Row 4: contributions last year (800 x 166)
        elements.push(
          embedSubSvg(
            designContributionsBox(data.contributions, themeId, fontId),
            padX,
            y,
            800,
            166
          )
        );
        y += 166 + 14;
      }
    });

    y += 14;
  };

  // Iterate through ordered sections, coalescing adjacent github_stats & streak_trophies
  const processedStatsIndices = new Set<number>();

  for (let i = 0; i < sections.length; i++) {
    if (processedStatsIndices.has(i)) continue;
    const sec = sections[i];

    if (sec === 'pinned_projects') {
      const projects = (data.projects || []).slice(0, 6);
      if (projects.length > 0) {
        renderSectionHeading('Pinned projects');
        const cardW = 256;
        const cardH = 96;
        const colGap = 16; // 256 * 3 + 16 * 2 = 800px
        const rowGap = 14;

        projects.forEach((proj, idx) => {
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          const px = padX + col * (cardW + colGap);
          const py = y + row * (cardH + rowGap);
          elements.push(
            embedSubSvg(
              designPinnedProjectCard(proj, themeId, cardW, cardH, fontId),
              px,
              py,
              cardW,
              cardH
            )
          );
        });

        const numRows = Math.ceil(projects.length / 3);
        y += numRows * cardH + (numRows - 1) * rowGap + 28;
      }
    } else if (sec === 'tech_stack') {
      renderSectionHeading('Languages');
      elements.push(
        embedSubSvg(
          designLanguagesBarCard(data.languages, themeId, fontId),
          padX,
          y,
          800,
          58
        )
      );
      y += 58 + 28;
    } else if (sec === 'github_stats' || sec === 'streak_trophies') {
      const rowsToRender: string[] = [];
      let j = i;
      while (
        j < sections.length &&
        (sections[j] === 'github_stats' || sections[j] === 'streak_trophies')
      ) {
        processedStatsIndices.add(j);
        if (sections[j] === 'github_stats') {
          rowsToRender.push('r1', 'r2');
        } else {
          rowsToRender.push('r3', 'r4');
        }
        j++;
      }
      renderStatsRows(rowsToRender);
    } else if (sec === 'bio') {
      const bioLines: Array<{ label: string; value: string }> = [];
      if (options?.bio?.workingOn) {
        bioLines.push({
          label: 'Currently working on:',
          value: options.bio.workingOn,
        });
      }
      if (options?.bio?.learning) {
        bioLines.push({
          label: 'Currently learning:',
          value: options.bio.learning,
        });
      }
      if (options?.bio?.askMeAbout) {
        bioLines.push({
          label: 'Ask me about:',
          value: options.bio.askMeAbout,
        });
      }
      if (options?.bio?.funFact) {
        bioLines.push({
          label: 'Fun fact:',
          value: options.bio.funFact,
        });
      }
      if (options?.bio?.focusAreas && options.bio.focusAreas.length > 0) {
        bioLines.push({
          label: 'Focus areas:',
          value: options.bio.focusAreas.join(' · '),
        });
      }
      if (bioLines.length === 0 && data.profile.bio) {
        bioLines.push({
          label: 'Bio:',
          value: data.profile.bio,
        });
      }
      if (bioLines.length === 0) {
        bioLines.push({
          label: 'Focus areas:',
          value: 'Open-Source · Systems Architecture · Developer Tooling',
        });
      }

      renderSectionHeading('About me');
      const bioCardH = 28 + bioLines.length * 26;
      const bioItemsSvg = bioLines
        .map((item, idx) => {
          const ly = 30 + idx * 26;
          return `<text x="20" y="${ly}" class="canvas-bio-line"><tspan font-weight="700" fill="${theme.textPrimary}">${escapeXml(item.label)}</tspan> <tspan fill="${theme.textSecondary}">${escapeXml(truncateText(item.value, 72))}</tspan></text>`;
        })
        .join('\n  ');

      elements.push(`<g transform="translate(${padX}, ${y})">
  <rect x="1" y="1" width="798" height="${bioCardH - 2}" rx="${theme.borderRadius}" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1.5" />
  ${bioItemsSvg}
</g>`);
      y += bioCardH + 28;
    }
  }

  const totalHeight = Math.max(180, y + 6);
  const fullName = escapeXml(data.profile.name || data.profile.username);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${totalHeight}" viewBox="0 0 ${canvasWidth} ${totalHeight}" fill="none" role="img" aria-label="${fullName}'s GitHub Profile">
  <defs>
    <style>
      ${font.svgImportUrl}
      .canvas-section-title { font: 700 20px ${font.fontFamily}; fill: ${theme.textPrimary}; }
      .canvas-tagline { font: 400 14px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .canvas-bio-line { font: 400 13.5px ${font.fontFamily}; }
    </style>
  </defs>

  <!-- Master Profile Canvas Background -->
  <rect x="1" y="1" width="${canvasWidth - 2}" height="${totalHeight - 2}" rx="18" fill="${theme.cardBgGradientEnd}" stroke="${theme.border}" stroke-width="1.5" />

  ${elements.join('\n\n  ')}
</svg>`;
}


