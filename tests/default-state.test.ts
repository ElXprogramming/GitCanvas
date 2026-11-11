import test from 'node:test';
import assert from 'node:assert/strict';
import { createDefaultBlocks } from '@/lib/default-state';
import { GitHubUserProfile, DeveloperArchetype, LanguageDistribution, Repository, PinnedProjectItem } from '@/types';

test('createDefaultBlocks generates complete block configurations with defaults', () => {
  const profile: GitHubUserProfile = {
    login: 'elxprogramming',
    name: 'ElX',
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    bio: 'Software engineer & OSS creator',
    company: 'Tech Corp',
    location: 'Tokyo, Japan',
    blog: 'https://example.com',
    twitter_username: 'elxdev',
    public_repos: 42,
    followers: 120,
    following: 30,
    html_url: 'https://github.com/elxprogramming',
  };

  const archetype: DeveloperArchetype = {
    id: 'fullstack',
    label: 'Fullstack Architect',
    tagline: 'Bridging elegant frontends with scalable distributed systems.',
    score: 95,
    recommendedTaglines: ['Architecting full-stack systems.'],
    color: '#8b5cf6',
    iconName: 'Layers',
  };

  const languages: LanguageDistribution[] = [
    { name: 'TypeScript', bytes: 80000, percentage: 80, color: '#3178c6' },
    { name: 'Go', bytes: 20000, percentage: 20, color: '#00ADD8' },
  ];

  const repos: Repository[] = [
    {
      name: 'star-repo',
      description: 'A popular open source repo',
      html_url: 'https://github.com/elxprogramming/star-repo',
      stargazers_count: 500,
      forks_count: 50,
      language: 'TypeScript',
      fork: false,
    },
  ];

  const blocks = createDefaultBlocks(profile, archetype, languages, repos);

  assert.equal(blocks.length, 6);
  assert.deepEqual(
    blocks.map((b) => b.id),
    ['hero', 'pinned_projects', 'tech_stack', 'github_stats', 'streak_trophies', 'bio']
  );

  // Check hero block settings
  const heroBlock = blocks.find((b) => b.id === 'hero');
  assert.ok(heroBlock?.enabled);
  assert.equal(heroBlock?.settings.greeting, 'ElX');
  assert.equal(heroBlock?.settings.company, 'Tech Corp');
  assert.equal(heroBlock?.settings.showCompany, true);
  assert.equal(heroBlock?.settings.bio, 'Software engineer & OSS creator');
  assert.equal(heroBlock?.settings.showBio, true);

  // Check tech stack block auto-detection
  const techStackBlock = blocks.find((b) => b.id === 'tech_stack');
  assert.ok(techStackBlock?.enabled);
  const badgeIds = techStackBlock?.settings.selectedBadges.map((b: any) => b.id);
  assert.ok(badgeIds.includes('typescript'));
  assert.ok(badgeIds.includes('go'));

  // Check pinned projects
  const pinnedBlock = blocks.find((b) => b.id === 'pinned_projects');
  assert.ok(pinnedBlock?.enabled);
  assert.equal(pinnedBlock?.settings.featuredProjects[0].name, 'star-repo');
});

test('createDefaultBlocks handles null profile and pinned projects override', () => {
  const pinned: PinnedProjectItem[] = [
    {
      name: 'pinned-repo-1',
      description: 'My pinned repo',
      url: 'https://github.com/user/pinned-repo-1',
      homepageUrl: null,
      stars: 45,
      forks: 3,
      language: 'Rust',
      languageColor: '#dea584',
    },
  ];

  const blocks = createDefaultBlocks(null, null, [], [], pinned);

  const heroBlock = blocks.find((b) => b.id === 'hero');
  assert.equal(heroBlock?.settings.greeting, 'ElXprogramming'); // default fallback username
  assert.equal(heroBlock?.settings.company, '');
  assert.equal(heroBlock?.settings.showCompany, false);

  const pinnedBlock = blocks.find((b) => b.id === 'pinned_projects');
  assert.equal(pinnedBlock?.settings.featuredProjects[0].name, 'pinned-repo-1');
  assert.equal(pinnedBlock?.settings.featuredProjects[0].url, 'https://github.com/user/pinned-repo-1');
});
