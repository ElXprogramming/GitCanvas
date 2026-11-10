import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ONE_PIECE_MASCOTS,
  getOnePieceMascot,
} from '../src/designs/onepiece-stickers';
import {
  getDesignTheme,
  DESIGN_THEMES,
  NORMAL_THEMES,
  SHOWCASE_THEMES,
  ON_HOLD_THEMES,
} from '../src/designs/themes';
import {
  designProfileCard,
  designOverallBox,
  designStreakBox,
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
  assert.equal(getOnePieceMascot('gatling')?.id, 'luffy_gatling');
  assert.equal(getOnePieceMascot('gomu_gomu')?.id, 'luffy_gatling');
  assert.equal(getOnePieceMascot('nonexistent_character'), undefined);
});

test('One Piece themes are configured with mascots and custom palettes', () => {
  const chopperTheme = getDesignTheme('onepiece_chopper');
  assert.equal(chopperTheme.id, 'onepiece_chopper');
  assert.ok(chopperTheme.mascot, 'Chopper theme should have a mascot');
  assert.equal(chopperTheme.mascot?.id, 'chopper');

  const luffyTheme = getDesignTheme('straw_hat');
  assert.equal(luffyTheme.mascot?.id, 'luffy');

  const gatlingTheme = getDesignTheme('onepiece_gatling');
  assert.equal(gatlingTheme.id, 'onepiece_gatling');
  assert.equal(gatlingTheme.border, 'transparent');
  assert.equal(gatlingTheme.mascot?.isAnimated, true);
  assert.equal(gatlingTheme.mascot?.frames?.length, 4);
  assert.ok(gatlingTheme.mascot?.gifBase64?.startsWith('data:image/gif;base64,'));
  assert.ok(gatlingTheme.mascot?.avatarBase64.startsWith('data:image/png;base64,'));

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

  const draculaWithGatling = getDesignTheme('dracula', 'gatling');
  assert.equal(draculaWithGatling.id, 'dracula');
  assert.equal(draculaWithGatling.mascot?.id, 'luffy_gatling');
});

test('designProfileCard renders mascot borderless without rect border box', () => {
  const profile = {
    username: 'luffy',
    name: 'Monkey D. Luffy',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
  };

  const svg = designProfileCard(profile, 'onepiece_gatling');
  assert.ok(svg.includes('class="p-mascot"'), 'Profile card should render mascot');
  assert.ok(svg.includes('<animate attributeName="opacity"'), 'Mascot should use native SMIL animation for GitHub compatibility');
  assert.ok(svg.includes('@keyframes gatlingF'), 'Mascot should define CSS keyframe animation');
  assert.ok(svg.includes('image-rendering: pixelated'), 'Mascot image should have pixelated rendering');
  // Verify it does NOT have an enclosing border rect inside the p-mascot group
  assert.ok(!svg.includes('<rect x="334"'), 'Mascot should NOT have a mini card rect border');

  // Verify non-mascot theme does not have mascot
  const defaultSvg = designProfileCard(profile, 'default');
  assert.ok(!defaultSvg.includes('class="p-mascot"'));
});

test('animated mascot renders native SVG SMIL and CSS keyframe animations for GitHub Camo compatibility', () => {
  const profile = {
    username: 'luffy',
    name: 'Monkey D. Luffy',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
  };

  const svg = designProfileCard(profile, 'onepiece_gatling');
  // Must contain all 4 frames
  assert.ok(svg.includes('class="gatling-f0"'));
  assert.ok(svg.includes('class="gatling-f1"'));
  assert.ok(svg.includes('class="gatling-f2"'));
  assert.ok(svg.includes('class="gatling-f3"'));

  // SMIL declarative animations must repeat indefinitely
  assert.ok(svg.includes('repeatCount="indefinite"'));
  assert.ok(svg.includes('calcMode="discrete"'));

  // CSS keyframes must be present
  assert.ok(svg.includes('@keyframes gatlingF0'));
  assert.ok(svg.includes('.gatling-f0 { animation: gatlingF0'));
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

test('flapping straw hat mascot is animated with 4 discrete pixel-perfect frames and GIF fallback', () => {
  const hat = ONE_PIECE_MASCOTS.straw_hat;
  assert.ok(hat, 'straw_hat mascot should be defined');
  assert.equal(hat.isAnimated, true);
  assert.equal(hat.frames?.length, 4);
  assert.ok(hat.gifBase64?.startsWith('data:image/gif;base64,'));
  assert.ok(hat.avatarBase64.startsWith('data:image/png;base64,'));
  assert.equal(hat.width, 48);
  assert.equal(hat.height, 26);

  // Check mascot resolvers
  assert.equal(getOnePieceMascot('straw_hat')?.id, 'straw_hat');
  assert.equal(getOnePieceMascot('straw_hat_flapping')?.id, 'straw_hat');
  assert.equal(getOnePieceMascot('flapping_hat')?.id, 'straw_hat');
  assert.equal(getOnePieceMascot('flapping_straw_hat')?.id, 'straw_hat');
  assert.equal(getOnePieceMascot('hat')?.id, 'straw_hat');
  // Confirm 'strawhat' still maps to luffy
  assert.equal(getOnePieceMascot('strawhat')?.id, 'luffy');
});

test('onepiece_straw_hat theme is configured with flapping straw hat mascot', () => {
  const theme = getDesignTheme('onepiece_straw_hat');
  assert.equal(theme.id, 'onepiece_straw_hat');
  assert.equal(theme.mascot?.id, 'straw_hat');
  assert.equal(theme.mascot?.isAnimated, true);

  // Check theme aliases
  assert.equal(getDesignTheme('flapping_hat').id, 'onepiece_straw_hat');
  assert.equal(getDesignTheme('flapping_straw_hat').id, 'onepiece_straw_hat');
  assert.equal(getDesignTheme('straw_hat_flapping').id, 'onepiece_straw_hat');
  assert.equal(getDesignTheme('hat').id, 'onepiece_straw_hat');
});

test('onepiece_gatling theme renders floating flapping straw hat in background with wind animation', () => {
  const profile = {
    username: 'luffy',
    name: 'Monkey D. Luffy',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
  };

  const overallData = {
    item: 'overall' as const,
    label: 'overall',
    grade: 'S' as const,
    score: 95,
  };

  // 1. Standalone overall box in onepiece_gatling theme (Luffy punching and hats removed)
  const overallSvg = designOverallBox(overallData, 'onepiece_gatling');
  assert.ok(!overallSvg.includes('class="ov-mascot"'), 'Overall box should NOT have Luffy punching');
  assert.ok(!overallSvg.includes('class="card-floating-hat"'), 'Overall box should NOT have floating hats');
  assert.ok(overallSvg.includes('text-anchor="middle"'), 'Overall box content should be centered');

  // 2. Streak metric box in onepiece_gatling theme (streak, longest streak, active days: hats removed)
  const streakData = {
    item: 'streak' as const,
    username: 'luffy',
    label: 'streak',
    value: 42,
    unit: 'days',
    formatted: '42 days',
  };
  const streakSvg = designStreakBox(streakData, 'onepiece_gatling');
  assert.ok(!streakSvg.includes('class="card-floating-hat"'), 'Streak box should NOT have floating hats');

  // 3. Standalone profile card in onepiece_gatling theme (retains mascot and floating hat in header)
  const profileSvg = designProfileCard(profile, 'onepiece_gatling');
  assert.ok(profileSvg.includes('class="card-floating-hat"'), 'Profile card should render floating straw hat');
  assert.ok(profileSvg.includes('wind-hat-roam-profile'), 'Profile card floating hat should roam across the space');
  assert.ok(profileSvg.includes('class="p-mascot"'), 'Profile card should render Luffy Gatling mascot');

  // 4. Full master canvas in onepiece_gatling theme (straw hats roaming all over the canvas space)
  const mockCanvasData: FullCanvasData = {
    profile: {
      username: 'luffy',
      name: 'Monkey D. Luffy',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
      bio: null,
      company: null,
      location: null,
      email: null,
      blog: null,
      twitterUsername: null,
      followers: 100,
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

  const canvasSvg = designFullCanvasCard(mockCanvasData, {
    theme: 'onepiece_gatling',
  });

  assert.ok(canvasSvg.includes('class="canvas-floating-hats"'), 'Canvas should render master floating straw hats');
  assert.ok(canvasSvg.includes('class="wind-hat-roam-canvas-1"'), 'Canvas should have primary roaming floating hat');
  assert.ok(canvasSvg.includes('class="wind-hat-roam-canvas-2"'), 'Canvas should have mid-lower roaming floating hat');
  assert.ok(canvasSvg.includes('class="wind-hat-roam-canvas-3"'), 'Canvas should have diagonal roaming floating hat');
  assert.ok(canvasSvg.includes('class="wind-gust"'), 'Canvas should render wind gust trails');
  assert.ok(canvasSvg.includes('@keyframes windRoamCanvas1'), 'Canvas CSS should include windRoamCanvas1');
  assert.ok(canvasSvg.includes('@keyframes windRoamCanvas2'), 'Canvas CSS should include windRoamCanvas2');
  assert.ok(canvasSvg.includes('@keyframes windRoamCanvas3'), 'Canvas CSS should include windRoamCanvas3');
  assert.ok(canvasSvg.includes('@keyframes windGustSweep'), 'Canvas CSS should include windGustSweep');
});

test('NORMAL_THEMES, SHOWCASE_THEMES, and ON_HOLD_THEMES are correctly categorized', () => {
  // Normal colored themes (8 basic themes without mascots)
  assert.equal(NORMAL_THEMES.length, 8);
  const normalIds = NORMAL_THEMES.map((t) => t.id);
  assert.ok(normalIds.includes('default'));
  assert.ok(normalIds.includes('catppuccin_mocha'));
  assert.ok(normalIds.includes('tokyonight'));
  assert.ok(normalIds.includes('dracula'));
  assert.ok(normalIds.includes('nord'));
  assert.ok(normalIds.includes('github_dark'));
  assert.ok(normalIds.includes('radical'));
  assert.ok(normalIds.includes('sunset'));
  for (const t of NORMAL_THEMES) {
    assert.equal(t.category, 'normal');
    assert.equal(t.mascot, undefined);
  }

  // Showcase: Luffy Gatling and Wano Zoro are showcased
  assert.equal(SHOWCASE_THEMES.length, 2);
  const showcaseIds = SHOWCASE_THEMES.map((t) => t.id);
  assert.ok(showcaseIds.includes('onepiece_gatling'));
  assert.ok(showcaseIds.includes('wano_zoro'));
  for (const t of SHOWCASE_THEMES) {
    assert.equal(t.category, 'showcase');
    assert.equal(t.mascot?.isAnimated, true);
  }

  // On hold themes: 10 static pixel art themes put on hold
  assert.equal(ON_HOLD_THEMES.length, 10);
  for (const t of ON_HOLD_THEMES) {
    assert.equal(t.category, 'on_hold');
    assert.equal(t.onHold, true);
  }
});

test('wano_zoro theme renders Cross-Card Wanderer mascot with signpost, dust puff, and SMIL/CSS animations', () => {
  const profile = {
    username: 'zoro',
    name: 'Roronoa Zoro',
    avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
  };

  const profileSvg = designProfileCard(profile, 'wano_zoro', null, { width: 800 });
  assert.ok(profileSvg.includes('class="p-mascot zoro-wanderer"'), 'Profile card should render Zoro Cross-Card Wanderer');
  assert.ok(profileSvg.includes('class="zoro-wander-track-800"'), 'Profile card should have wander track animation');
  assert.ok(profileSvg.includes('class="zoro-signpost"'), 'Profile card should render comedic wooden signpost');
  assert.ok(profileSvg.includes('COMMITS'), 'Signpost should have COMMITS label');
  assert.ok(profileSvg.includes('NORTH'), 'Signpost should have NORTH label');
  assert.ok(profileSvg.includes('class="zoro-dust"'), 'Profile card should render dust puff effect');
  assert.ok(profileSvg.includes('<animateTransform attributeName="transform" type="translate"'), 'Zoro wanderer must have SMIL translate animation');
  assert.ok(profileSvg.includes('<animateTransform attributeName="transform" type="scale"'), 'Zoro wanderer must have SMIL scale flip animation');
  assert.ok(profileSvg.includes('@keyframes zoroRoamProfile800'), 'CSS keyframes for roam must be defined');
  assert.ok(profileSvg.includes('@keyframes zoroFlip800'), 'CSS keyframes for flip must be defined');
  assert.ok(profileSvg.includes('@keyframes zoroSignpost'), 'CSS keyframes for signpost must be defined');

  const smallProfileSvg = designProfileCard(profile, 'wano_zoro', null, { width: 420 });
  assert.ok(smallProfileSvg.includes('class="zoro-wander-track-420"'), 'Compact profile card should have 420 wander track animation');
});

test('wano_zoro theme renders falling Wano Sakura petals, bamboo leaves, and green flying slash wind trails from top-left to bottom-right', () => {
  const profile = {
    username: 'zoro',
    name: 'Roronoa Zoro',
    avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
  };

  const profileSvg = designProfileCard(profile, 'wano_zoro');
  assert.ok(profileSvg.includes('class="card-floating-sakura"'), 'Profile card should render floating sakura');
  assert.ok(profileSvg.includes('class="sakura-fall-profile-1"'), 'Profile card should have primary falling sakura petal');
  assert.ok(profileSvg.includes('class="wind-slash-gust"'), 'Profile card should have emerald wind slash gust');

  const mockCanvasData: FullCanvasData = {
    profile: {
      username: 'zoro',
      name: 'Roronoa Zoro',
      avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
      bio: 'King of Hell / Santoryu Swordsman',
      company: 'Straw Hat Pirates',
      location: 'Wano Country',
      email: null,
      blog: null,
      twitterUsername: null,
      followers: 4000,
      following: 5,
      createdAt: '2020-01-01',
      htmlUrl: 'https://github.com/zoro',
    },
    projects: [],
    languages: {
      item: 'languages',
      username: 'zoro',
      languages: [{ name: 'TypeScript', bytes: 1000, percentage: 100, color: '#3178c6' }],
      totalBytes: 1000,
      totalLanguagesCount: 1,
    },
    commits: { item: 'commits', username: 'zoro', label: 'commits', value: 450, grade: 'S' },
    prs: { item: 'prs', username: 'zoro', label: 'PR', value: 25, grade: 'S' },
    issues: { item: 'issues', username: 'zoro', label: 'issues', value: 10, grade: 'A' },
    stars: { item: 'stars', username: 'zoro', label: 'stars earned', value: 350, grade: 'S' },
    repos: { item: 'repos', username: 'zoro', label: 'Repos', value: 9, grade: 'B' },
    polyglot: { item: 'polyglot', username: 'zoro', label: 'Polyglot', value: 3, grade: 'C' },
    overall: {
      item: 'overall',
      username: 'zoro',
      label: 'overall',
      grade: 'S',
      score: 97,
      breakdown: { commits: 'S', prs: 'S', issues: 'A', stars: 'S', repos: 'B', polyglot: 'C' },
    },
    streak: {
      item: 'streak',
      username: 'zoro',
      label: 'streak',
      value: 60,
      unit: 'days',
      formatted: '60 days',
    },
    longestStreak: {
      item: 'longest-streak',
      username: 'zoro',
      label: 'longest streak',
      value: 95,
      unit: 'days',
      formatted: '95 days',
    },
    activeDays: {
      item: 'active-days',
      username: 'zoro',
      label: 'active days',
      value: 280,
      unit: 'days',
      formatted: '280 days',
    },
    contributions: {
      item: 'contributions',
      username: 'zoro',
      label: 'contributions last year',
      totalCommits: 900,
      rightLabel: '900 contributions',
      weeks: [],
    },
  };

  const canvasSvg = designFullCanvasCard(mockCanvasData, {
    theme: 'wano_zoro',
  });

  assert.ok(canvasSvg.includes('class="canvas-floating-sakura"'), 'Canvas should render master falling sakura group');
  assert.ok(canvasSvg.includes('class="sakura-fall-canvas-1"'), 'Canvas should have primary falling sakura petal');
  assert.ok(canvasSvg.includes('class="sakura-fall-canvas-2"'), 'Canvas should have bamboo leaf falling');
  assert.ok(canvasSvg.includes('class="wind-slash-gust"'), 'Canvas should render flying slash wind trails');
  assert.ok(canvasSvg.includes('@keyframes sakuraFallCanvas1'), 'Canvas CSS should include sakuraFallCanvas1');
  assert.ok(canvasSvg.includes('@keyframes windSlashGust'), 'Canvas CSS should include windSlashGust');
  assert.ok(canvasSvg.includes('zoro-wanderer'), 'Canvas should embed Zoro wanderer mascot');
});

