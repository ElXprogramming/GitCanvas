import test from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeXml,
  formatCompactNumber,
  truncateText,
  wrapTextTwoLines,
  designProfileCard,
  designSocialItemCard,
  designPinnedProjectCard,
  designLanguagesBarCard,
  designGradedStatBox,
  designOverallBox,
  designStreakBox,
  designContributionsBox,
  designFullCanvasCard,
} from '@/designs/card-designs';
import { getDesignTheme } from '@/designs/themes';
import { getDesignFont } from '@/designs/fonts';
import { FullCanvasData } from '@/types/stats';

test('escapeXml escapes dangerous characters properly', () => {
  assert.equal(escapeXml('Hello & <World> "Quote" \'Apos\''), 'Hello &amp; &lt;World&gt; &quot;Quote&quot; &apos;Apos&apos;');
  assert.equal(escapeXml('Clean String 123'), 'Clean String 123');
  assert.equal(escapeXml(''), '');
  assert.equal(escapeXml(null), '');
  assert.equal(escapeXml(undefined), '');
});

test('formatCompactNumber formats numbers correctly', () => {
  assert.equal(formatCompactNumber(0), '0');
  assert.equal(formatCompactNumber(999), '999');
  assert.equal(formatCompactNumber(10_000), '10k');
  assert.equal(formatCompactNumber(15_400), '15.4k');
  assert.equal(formatCompactNumber(1_000_000), '1M');
  assert.equal(formatCompactNumber(2_500_000), '2.5M');
});

test('truncateText truncates with ellipsis', () => {
  assert.equal(truncateText('Short', 10), 'Short');
  assert.equal(truncateText('Exact10Len', 10), 'Exact10Len');
  assert.equal(truncateText('A very long text here', 10), 'A very lo…');
});

test('wrapTextTwoLines breaks words cleanly', () => {
  const [line1, line2] = wrapTextTwoLines('Building high-performance distributed systems in Go and Rust', 34, 34);
  assert.ok(line1.length <= 34);
  assert.ok(line2.length <= 34);
  assert.ok(!line1.endsWith(' '));
});

test('designProfileCard outputs valid SVG', () => {
  const svg = designProfileCard({
    item: 'profile',
    username: 'octocat',
    name: 'The Octocat',
    avatarUrl: 'https://github.com/octocat.png',
    bio: 'GitHub mascot',
    company: 'GitHub',
    location: 'San Francisco',
    email: null,
    blog: 'https://github.blog',
    twitterUsername: null,
    followers: 5000,
    following: 10,
    createdAt: '2011-01-01',
    htmlUrl: 'https://github.com/octocat',
  });

  assert.ok(svg.startsWith('<svg'));
  assert.ok(svg.endsWith('</svg>'));
  assert.ok(svg.includes('The Octocat'));
  assert.ok(svg.includes('@octocat'));
});

test('designGradedStatBox renders metric with grade color', () => {
  const svg = designGradedStatBox({
    item: 'commits',
    username: 'octocat',
    label: 'commits',
    value: 450,
    grade: 'S',
  });

  assert.ok(svg.includes('450'));
  assert.ok(svg.includes('commits'));
  assert.ok(svg.includes('>S<'));
});

test('designSocialItemCard renders social button SVG', () => {
  const svg = designSocialItemCard('twitter', 'octocat');
  assert.ok(svg.startsWith('<svg'));
  assert.ok(svg.includes('octocat'));
});

test('designPinnedProjectCard renders project card SVG', () => {
  const svg = designPinnedProjectCard({
    name: 'awesome-repo',
    description: 'An awesome open source project',
    url: 'https://github.com/octocat/awesome-repo',
    homepageUrl: null,
    stars: 120,
    forks: 15,
    language: 'TypeScript',
    languageColor: '#3178c6',
  });
  assert.ok(svg.startsWith('<svg'));
  assert.ok(svg.includes('awesome-repo'));
});

test('designLanguagesBarCard renders language distribution bar', () => {
  const svg = designLanguagesBarCard({
    item: 'languages',
    username: 'octocat',
    languages: [
      { name: 'TypeScript', bytes: 7000, percentage: 70, color: '#3178c6' },
      { name: 'Rust', bytes: 3000, percentage: 30, color: '#dea584' },
    ],
    totalBytes: 10000,
    totalLanguagesCount: 2,
  });
  assert.ok(svg.startsWith('<svg'));
  assert.ok(svg.includes('TypeScript'));
  assert.ok(svg.includes('Rust'));
});

test('designOverallBox, designStreakBox, and designContributionsBox render valid SVGs', () => {
  const overallSvg = designOverallBox({
    item: 'overall',
    username: 'octocat',
    label: 'overall',
    grade: 'A',
    score: 88,
    breakdown: { commits: 'S', prs: 'A', issues: 'A', stars: 'S', repos: 'B', polyglot: 'A' },
  });
  assert.ok(overallSvg.startsWith('<svg'));
  assert.ok(overallSvg.includes('>A<'));

  const streakSvg = designStreakBox({
    item: 'streak',
    username: 'octocat',
    label: 'streak',
    value: 42,
    unit: 'days',
    formatted: '42 days',
  });
  assert.ok(streakSvg.startsWith('<svg'));
  assert.ok(streakSvg.includes('42 days'));

  const contribSvg = designContributionsBox({
    item: 'contributions',
    username: 'octocat',
    label: 'contributions last year',
    totalCommits: 365,
    rightLabel: '365 contributions',
    weeks: [],
  });
  assert.ok(contribSvg.startsWith('<svg'));
  assert.ok(contribSvg.includes('365 contributions'));
});

test('getDesignTheme and getDesignFont resolve correctly with aliases', () => {
  const tDefault = getDesignTheme('default');
  assert.equal(tDefault.id, 'default');

  const tOnePiece = getDesignTheme('onepiece');
  assert.equal(tOnePiece.id, 'straw_hat');

  const tNika = getDesignTheme('gear5');
  assert.equal(tNika.id, 'gear_5_nika');

  const fInter = getDesignFont('inter');
  assert.equal(fInter.id, 'inter');

  const fOpen = getDesignFont('opensans');
  assert.equal(fOpen.id, 'open_sans');

  const fDefault = getDesignFont(null);
  assert.equal(fDefault.id, 'josefin_slab');
});

test('designFullCanvasCard renders complete unified SVG with single font import', () => {
  const mockData: FullCanvasData = {
    profile: {
      item: 'profile',
      username: 'octocat',
      name: 'The Octocat',
      avatarUrl: 'https://github.com/octocat.png',
      bio: 'GitHub mascot',
      company: 'GitHub',
      location: 'SF',
      email: null,
      blog: null,
      twitterUsername: null,
      followers: 100,
      following: 10,
      createdAt: '2020-01-01',
      htmlUrl: 'https://github.com/octocat',
    },
    projects: [
      {
        name: 'hello-world',
        description: 'First repo',
        url: 'https://github.com/octocat/hello-world',
        homepageUrl: null,
        stars: 100,
        forks: 20,
        language: 'TypeScript',
        languageColor: '#3178c6',
      },
    ],
    languages: {
      item: 'languages',
      username: 'octocat',
      languages: [{ name: 'TypeScript', bytes: 1000, percentage: 100, color: '#3178c6' }],
      totalBytes: 1000,
      totalLanguagesCount: 1,
    },
    commits: { item: 'commits', username: 'octocat', label: 'commits', value: 300, grade: 'S' },
    prs: { item: 'prs', username: 'octocat', label: 'PR', value: 30, grade: 'S' },
    issues: { item: 'issues', username: 'octocat', label: 'issues', value: 15, grade: 'A' },
    stars: { item: 'stars', username: 'octocat', label: 'stars earned', value: 200, grade: 'S' },
    repos: { item: 'repos', username: 'octocat', label: 'Repos', value: 12, grade: 'B' },
    polyglot: { item: 'polyglot', username: 'octocat', label: 'Polyglot', value: 4, grade: 'C' },
    overall: {
      item: 'overall',
      username: 'octocat',
      label: 'overall',
      grade: 'A',
      score: 85,
      breakdown: { commits: 'S', prs: 'S', issues: 'A', stars: 'S', repos: 'B', polyglot: 'C' },
    },
    streak: { item: 'streak', username: 'octocat', label: 'streak', value: 10, unit: 'days', formatted: '10 days' },
    longestStreak: { item: 'longest-streak', username: 'octocat', label: 'longest streak', value: 20, unit: 'days', formatted: '20' },
    activeDays: { item: 'active-days', username: 'octocat', label: 'active days this year', value: 150, unit: 'days', formatted: '150 days' },
    contributions: {
      item: 'contributions',
      username: 'octocat',
      label: 'contributions last year',
      totalCommits: 500,
      rightLabel: '500 contributions',
      weeks: [],
    },
  };

  const svg = designFullCanvasCard(mockData, {
    theme: 'catppuccin_mocha',
    font: 'inter',
    tagline: 'Coding dreams into reality',
  });

  assert.ok(svg.startsWith('<svg'));
  assert.ok(svg.endsWith('</svg>'));
  assert.ok(svg.includes('octocat'));
  assert.ok(svg.includes('Coding dreams into reality'));

  // Verify font import is deduplicated (only in top-level <defs>)
  const importMatches = svg.match(/@import\s+url/g);
  assert.equal(importMatches ? importMatches.length : 0, 1);
});
