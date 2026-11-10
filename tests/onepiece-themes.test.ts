import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ONE_PIECE_MASCOTS,
  getOnePieceMascot,
} from '../src/designs/onepiece-stickers';
import { getDesignTheme, DESIGN_THEMES } from '../src/designs/themes';
import {
  designProfileCard,
  designOverallBox,
  designFullCanvasCard,
} from '../src/designs/card-designs';
import { FullCanvasData } from '../src/types/stats';

test('ONE_PIECE_MASCOTS contains all extracted character stickers', () => {
  const characters = [
    'chopper',
    'chopper_giant',
    'luffy',
    'zoro',
    'sanji',
    'nami',
    'usopp',
    'ace',
    'sabo',
    'law',
    'brook',
    'jinbe',
    'franky',
    'smoker',
    'buggy',
    'bartolomeo',
    'bon_clay',
  ];

  for (const charId of characters) {
    const mascot = ONE_PIECE_MASCOTS[charId];
    assert.ok(mascot, `Mascot ${charId} should exist in ONE_PIECE_MASCOTS`);
    assert.ok(mascot.name.length > 0, `Mascot ${charId} should have a name`);
    assert.ok(mascot.avatarBase64.startsWith('data:image/png;base64,'), `Mascot ${charId} should have valid base64 data URI`);
    assert.ok(mascot.width > 20, `Mascot ${charId} should have width > 20`);
    assert.ok(mascot.height > 20, `Mascot ${charId} should have height > 20`);
  }
});

test('getOnePieceMascot resolves character names and aliases', () => {
  assert.equal(getOnePieceMascot('chopper')?.id, 'chopper');
  assert.equal(getOnePieceMascot('tony_tony_chopper')?.id, 'chopper');
  assert.equal(getOnePieceMascot('luffy')?.id, 'luffy');
  assert.equal(getOnePieceMascot('strawhat')?.id, 'luffy');
  assert.equal(getOnePieceMascot('zoro')?.id, 'zoro');
  assert.equal(getOnePieceMascot('sanji')?.id, 'sanji');
  assert.equal(getOnePieceMascot('ace')?.id, 'ace');
  assert.equal(getOnePieceMascot('law')?.id, 'law');
  assert.equal(getOnePieceMascot('brook')?.id, 'brook');
  assert.equal(getOnePieceMascot('nami')?.id, 'nami');
  assert.equal(getOnePieceMascot('nonexistent_character'), undefined);
});

test('One Piece themes are configured with mascots and custom palettes', () => {
  const chopperTheme = getDesignTheme('onepiece_chopper');
  assert.equal(chopperTheme.id, 'onepiece_chopper');
  assert.ok(chopperTheme.mascot, 'Chopper theme should have a mascot');
  assert.equal(chopperTheme.mascot?.id, 'chopper');

  const luffyTheme = getDesignTheme('straw_hat');
  assert.equal(luffyTheme.mascot?.id, 'luffy');

  const zoroTheme = getDesignTheme('wano_zoro');
  assert.equal(zoroTheme.mascot?.id, 'zoro');

  const aceTheme = getDesignTheme('onepiece_ace');
  assert.equal(aceTheme.mascot?.id, 'ace');

  const lawTheme = getDesignTheme('onepiece_law');
  assert.equal(lawTheme.mascot?.id, 'law');
});

test('getDesignTheme supports mascot override for any theme', () => {
  const darkWithChopper = getDesignTheme('github_dark', 'chopper');
  assert.equal(darkWithChopper.id, 'github_dark');
  assert.ok(darkWithChopper.mascot, 'Theme should have Chopper mascot attached');
  assert.equal(darkWithChopper.mascot?.id, 'chopper');

  const draculaWithZoro = getDesignTheme('dracula', 'zoro');
  assert.equal(draculaWithZoro.id, 'dracula');
  assert.equal(draculaWithZoro.mascot?.id, 'zoro');
});

test('designProfileCard renders mascot badge in SVG', () => {
  const profile = {
    username: 'luffy',
    name: 'Monkey D. Luffy',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
  };

  const svg = designProfileCard(profile, 'onepiece_chopper');
  assert.ok(svg.includes('class="p-mascot"'), 'Profile card should render mascot badge');
  assert.ok(svg.includes('image-rendering: pixelated'), 'Mascot image should have pixelated rendering');
  assert.ok(svg.includes('data:image/png;base64,'), 'Mascot should be embedded as base64 PNG');

  // Verify non-mascot theme does not have mascot badge
  const defaultSvg = designProfileCard(profile, 'default');
  assert.ok(!defaultSvg.includes('class="p-mascot"'));
});

test('designOverallBox renders mascot in SVG when present', () => {
  const overallData = {
    item: 'overall' as const,
    label: 'overall',
    grade: 'S' as const,
    score: 95,
  };

  const svgWithMascot = designOverallBox(overallData, 'straw_hat');
  assert.ok(svgWithMascot.includes('class="ov-mascot"'), 'Overall box should render mascot when present');

  const svgDefault = designOverallBox(overallData, 'default');
  assert.ok(!svgDefault.includes('class="ov-mascot"'));
});

test('designFullCanvasCard embeds profile card with mascot', () => {
  const mockData: FullCanvasData = {
    profile: {
      username: 'luffy',
      name: 'Monkey D. Luffy',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
      bio: 'King of the Pirates',
      company: 'Straw Hat Pirates',
      location: 'Grand Line',
      email: null,
      blog: null,
      twitterUsername: null,
      followers: 5600,
      following: 10,
      createdAt: '2020-01-01',
      htmlUrl: 'https://github.com/luffy',
    },
    projects: [],
    languages: {
      item: 'languages',
      username: 'luffy',
      languages: [{ name: 'TypeScript', bytes: 1000, percentage: 100, color: '#3178c6' }],
      totalBytes: 1000,
      totalLanguagesCount: 1,
    },
    commits: { item: 'commits', username: 'luffy', label: 'commits', value: 300, grade: 'S' },
    prs: { item: 'prs', username: 'luffy', label: 'PR', value: 30, grade: 'S' },
    issues: { item: 'issues', username: 'luffy', label: 'issues', value: 15, grade: 'A' },
    stars: { item: 'stars', username: 'luffy', label: 'stars earned', value: 200, grade: 'S' },
    repos: { item: 'repos', username: 'luffy', label: 'Repos', value: 12, grade: 'B' },
    polyglot: { item: 'polyglot', username: 'luffy', label: 'Polyglot', value: 4, grade: 'C' },
    overall: {
      item: 'overall',
      username: 'luffy',
      label: 'overall',
      grade: 'S',
      score: 98,
      breakdown: { commits: 'S', prs: 'S', issues: 'A', stars: 'S', repos: 'B', polyglot: 'C' },
    },
    streak: {
      item: 'streak',
      username: 'luffy',
      label: 'streak',
      value: 42,
      unit: 'days',
      formatted: '42 days',
    },
    longestStreak: {
      item: 'longest-streak',
      username: 'luffy',
      label: 'longest streak',
      value: 80,
      unit: 'days',
      formatted: '80 days',
    },
    activeDays: {
      item: 'active-days',
      username: 'luffy',
      label: 'active days',
      value: 250,
      unit: 'days',
      formatted: '250 days',
    },
    contributions: {
      item: 'contributions',
      username: 'luffy',
      label: 'contributions last year',
      totalCommits: 800,
      rightLabel: '800 contributions',
      weeks: [],
    },
  };

  const svg = designFullCanvasCard(mockData, {
    theme: 'onepiece_chopper',
  });

  assert.ok(svg.includes('class="p-mascot"'), 'Full canvas card should include profile mascot badge');
  assert.ok(svg.includes('image-rendering: pixelated'));
});
