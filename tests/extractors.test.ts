import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractProfileFromUser,
  extractPinnedProjectsFromUser,
  extractLanguagesFromUser,
  extractCommitsFromUser,
  extractPRsFromUser,
  extractIssuesFromUser,
  extractStarsFromUser,
  extractReposFromUser,
  extractPolyglotFromLanguages,
  extractStreakStatsFromCalendar,
  extractContributionsFromCalendar,
} from '@/lib/github-stats';
import { LanguagesItemData } from '@/types/stats';

test('extractProfileFromUser extracts complete user profile', () => {
  const rawUser = {
    login: 'octocat',
    name: 'The Octocat',
    avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
    bio: 'GitHub mascot and code lover',
    company: '@github',
    location: 'San Francisco, CA',
    email: 'octocat@github.com',
    websiteUrl: 'https://github.blog',
    twitterUsername: 'github',
    followers: { totalCount: 9999 },
    following: { totalCount: 9 },
    createdAt: '2011-01-25T18:44:36Z',
    url: 'https://github.com/octocat',
  };

  const profile = extractProfileFromUser(rawUser, 'data:image/png;base64,mockAvatar');

  assert.equal(profile.item, 'profile');
  assert.equal(profile.username, 'octocat');
  assert.equal(profile.name, 'The Octocat');
  assert.equal(profile.avatarUrl, 'https://avatars.githubusercontent.com/u/583231?v=4');
  assert.equal(profile.avatarBase64, 'data:image/png;base64,mockAvatar');
  assert.equal(profile.bio, 'GitHub mascot and code lover');
  assert.equal(profile.company, '@github');
  assert.equal(profile.location, 'San Francisco, CA');
  assert.equal(profile.email, 'octocat@github.com');
  assert.equal(profile.blog, 'https://github.blog');
  assert.equal(profile.twitterUsername, 'github');
  assert.equal(profile.followers, 9999);
  assert.equal(profile.following, 9);
  assert.equal(profile.createdAt, '2011-01-25T18:44:36Z');
  assert.equal(profile.htmlUrl, 'https://github.com/octocat');
});

test('extractProfileFromUser falls back properly on missing/null fields', () => {
  const rawUser = {
    login: 'minimaldev',
    name: null,
    avatarUrl: 'https://avatars.githubusercontent.com/u/12345?v=4',
    bio: null,
    company: null,
    location: null,
    email: '',
    websiteUrl: '',
    twitterUsername: null,
    followers: null,
    following: null,
    createdAt: '2023-01-01T00:00:00Z',
    url: 'https://github.com/minimaldev',
  };

  const profile = extractProfileFromUser(rawUser);

  assert.equal(profile.username, 'minimaldev');
  assert.equal(profile.name, 'minimaldev'); // fallback to login
  assert.equal(profile.bio, null);
  assert.equal(profile.company, null);
  assert.equal(profile.location, null);
  assert.equal(profile.email, null);
  assert.equal(profile.blog, null);
  assert.equal(profile.twitterUsername, null);
  assert.equal(profile.followers, 0);
  assert.equal(profile.following, 0);
  assert.equal(profile.avatarBase64, undefined);
});

test('extractPinnedProjectsFromUser extracts pinned repos or falls back to top repositories', () => {
  const rawWithPinned = {
    pinnedItems: {
      nodes: [
        {
          name: 'cool-project',
          description: 'A very cool project',
          url: 'https://github.com/dev/cool-project',
          homepageUrl: 'https://coolproject.dev',
          stargazerCount: 150,
          forkCount: 20,
          primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
        },
      ],
    },
    repositories: {
      nodes: [
        {
          name: 'other-repo',
          description: 'Other repo',
          url: 'https://github.com/dev/other-repo',
          homepageUrl: null,
          stargazerCount: 10,
          forkCount: 2,
          primaryLanguage: null,
        },
      ],
    },
  };

  const pinned = extractPinnedProjectsFromUser(rawWithPinned);
  assert.equal(pinned.length, 1);
  assert.equal(pinned[0].name, 'cool-project');
  assert.equal(pinned[0].stars, 150);
  assert.equal(pinned[0].forks, 20);
  assert.equal(pinned[0].language, 'TypeScript');
  assert.equal(pinned[0].languageColor, '#3178c6');

  // Fallback when pinned is empty
  const rawWithoutPinned = {
    pinnedItems: { nodes: [] },
    repositories: {
      nodes: [
        {
          name: 'fallback-repo',
          description: null,
          url: 'https://github.com/dev/fallback-repo',
          homepageUrl: null,
          stargazerCount: 5,
          forkCount: 1,
          primaryLanguage: null,
        },
      ],
    },
  };

  const fallback = extractPinnedProjectsFromUser(rawWithoutPinned);
  assert.equal(fallback.length, 1);
  assert.equal(fallback[0].name, 'fallback-repo');
  assert.equal(fallback[0].description, null);
  assert.equal(fallback[0].language, null);
  assert.equal(fallback[0].languageColor, '#8b949e');
});

test('extractLanguagesFromUser computes bytes and percentages across repositories', () => {
  const rawUser = {
    login: 'polyglot-coder',
    repositories: {
      nodes: [
        {
          languages: {
            edges: [
              { node: { name: 'TypeScript', color: '#3178c6' }, size: 75000 },
              { node: { name: 'Rust', color: '#dea584' }, size: 25000 },
            ],
          },
        },
        {
          languages: {
            edges: [
              { node: { name: 'TypeScript', color: '#3178c6' }, size: 25000 },
            ],
          },
        },
      ],
    },
  };

  const result = extractLanguagesFromUser(rawUser);
  assert.equal(result.item, 'languages');
  assert.equal(result.username, 'polyglot-coder');
  assert.equal(result.totalBytes, 125000);
  assert.equal(result.totalLanguagesCount, 2);
  assert.equal(result.languages[0].name, 'TypeScript');
  assert.equal(result.languages[0].bytes, 100000);
  assert.equal(result.languages[0].percentage, 80);
  assert.equal(result.languages[1].name, 'Rust');
  assert.equal(result.languages[1].bytes, 25000);
  assert.equal(result.languages[1].percentage, 20);
});

test('extractCommitsFromUser calculates commits and handles lifetime data', () => {
  const rawUser = {
    login: 'commitmaster',
    contributionsCollection: {
      totalCommitContributions: 1200,
      restrictedContributionsCount: 300,
    },
  };

  // Without lifetime
  const resPastYear = extractCommitsFromUser(rawUser);
  assert.equal(resPastYear.item, 'commits');
  assert.equal(resPastYear.value, 1500);
  assert.equal(resPastYear.grade, 'S');

  // With lifetime higher than past year
  const resLifetime = extractCommitsFromUser(rawUser, {
    totalLifetimeCommits: 5500,
    restrictedLifetimeCommits: 500,
  });
  assert.equal(resLifetime.value, 5500);
  assert.equal(resLifetime.grade, 'S');

  // With lifetime lower than past year
  const resLowerLifetime = extractCommitsFromUser(rawUser, {
    totalLifetimeCommits: 1000,
    restrictedLifetimeCommits: 0,
  });
  assert.equal(resLowerLifetime.value, 1500);
});

test('extractPRsFromUser, extractIssuesFromUser, extractStarsFromUser, extractReposFromUser', () => {
  const rawUser = {
    login: 'powerdev',
    contributionsCollection: {
      totalPullRequestContributions: 85,
      totalIssueContributions: 40,
    },
    repositories: {
      totalCount: 35,
      nodes: [
        { stargazerCount: 120 },
        { stargazerCount: 80 },
        { stargazerCount: 15 },
      ],
    },
  };

  const prs = extractPRsFromUser(rawUser);
  assert.equal(prs.item, 'prs');
  assert.equal(prs.value, 85);
  assert.equal(prs.grade, 'S');

  const issues = extractIssuesFromUser(rawUser);
  assert.equal(issues.item, 'issues');
  assert.equal(issues.value, 40);
  assert.equal(issues.grade, 'S');

  const stars = extractStarsFromUser(rawUser);
  assert.equal(stars.item, 'stars');
  assert.equal(stars.value, 215);
  assert.equal(stars.grade, 'S');

  const repos = extractReposFromUser(rawUser);
  assert.equal(repos.item, 'repos');
  assert.equal(repos.value, 35);
  assert.equal(repos.grade, 'S');
});

test('extractPolyglotFromLanguages extracts language count and grade', () => {
  const langsData: LanguagesItemData = {
    item: 'languages',
    username: 'polyglot',
    languages: [
      { name: 'TypeScript', bytes: 1000, percentage: 50, color: '#3178c6' },
      { name: 'Python', bytes: 500, percentage: 25, color: '#3572A5' },
      { name: 'Rust', bytes: 300, percentage: 15, color: '#dea584' },
      { name: 'Go', bytes: 200, percentage: 10, color: '#00ADD8' },
    ],
    totalBytes: 2000,
    totalLanguagesCount: 4,
  };

  const polyglot = extractPolyglotFromLanguages(langsData);
  assert.equal(polyglot.item, 'polyglot');
  assert.equal(polyglot.value, 4);
  assert.equal(polyglot.grade, 'C');
});

test('extractContributionsFromCalendar parses calendar contributions and weeks', () => {
  const calendar = {
    totalContributions: 842,
    weeks: [
      {
        contributionDays: [
          { date: '2024-01-01', contributionCount: 5, weekday: 1 },
          { date: '2024-01-02', contributionCount: 8, weekday: 2 },
        ],
      },
    ],
  };

  const result = extractContributionsFromCalendar(calendar, 'testuser');
  assert.equal(result.item, 'contributions');
  assert.equal(result.username, 'testuser');
  assert.equal(result.totalCommits, 842);
  assert.equal(result.rightLabel, '842 contributions');
  assert.equal(result.weeks.length, 1);
});

test('extractStreakStatsFromCalendar delegates correctly to streak calculator', () => {
  const calendar = {
    weeks: [
      {
        contributionDays: [
          { date: '2024-01-01', contributionCount: 3, weekday: 1 },
          { date: '2024-01-02', contributionCount: 4, weekday: 2 },
          { date: '2024-01-03', contributionCount: 0, weekday: 3 },
        ],
      },
    ],
  };

  const streak = extractStreakStatsFromCalendar(calendar);
  assert.equal(streak.totalContributionsPastYear, 7);
  assert.equal(streak.totalActiveDays, 2);
  assert.equal(streak.longestStreak.days, 2);
});
