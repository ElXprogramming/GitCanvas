import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCanvasCardUrl,
  generateMainReadmeLayout,
} from '@/designs/readme-layout';
import { createDefaultBlocks } from '@/lib/default-state';
import { GitHubUserProfile } from '@/types';

test('buildCanvasCardUrl constructs valid canvas URL with default settings', () => {
  const profile: GitHubUserProfile = {
    login: 'octocat',
    name: 'The Octocat',
    avatar_url: 'https://github.com/octocat.png',
    bio: 'GitHub mascot',
    company: 'GitHub',
    location: 'SF',
    blog: null,
    twitter_username: null,
    public_repos: 10,
    followers: 1000,
    following: 5,
    html_url: 'https://github.com/octocat',
  };

  const blocks = createDefaultBlocks(profile, null, [], []);
  const url = buildCanvasCardUrl(blocks, profile, 'default', 'octocat', 'josefin_slab');

  assert.ok(url.includes('/api/cards/canvas?'));
  assert.ok(url.includes('username=octocat'));
  assert.ok(url.includes('theme=default'));
});

test('buildCanvasCardUrl respects custom theme and font', () => {
  const blocks = createDefaultBlocks(null, null, [], []);
  const url = buildCanvasCardUrl(blocks, null, 'catppuccin_mocha', 'testdev', 'inter');

  assert.ok(url.includes('username=testdev'));
  assert.ok(url.includes('theme=catppuccin_mocha'));
  assert.ok(url.includes('font=inter'));
});

test('generateMainReadmeLayout produces valid markdown image link', () => {
  const profile: GitHubUserProfile = {
    login: 'testdev',
    name: 'Test Dev',
    avatar_url: 'https://github.com/testdev.png',
    bio: null,
    company: null,
    location: null,
    blog: null,
    twitter_username: null,
    public_repos: 5,
    followers: 10,
    following: 2,
    html_url: 'https://github.com/testdev',
  };

  const blocks = createDefaultBlocks(profile, null, [], []);
  const md = generateMainReadmeLayout(blocks, profile, 'nord', 'testdev');

  assert.ok(md.startsWith("![Test Dev's GitHub Profile]("));
  assert.ok(md.endsWith(')'));
  assert.ok(md.includes('/api/cards/canvas?'));
  assert.ok(md.includes('username=testdev'));
});
