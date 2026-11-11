import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TECH_CATALOG,
  BADGE_CATEGORIES,
  buildBadgeUrl,
} from '@/lib/tech-catalog';
import { TechBadgeItem } from '@/types';

test('TECH_CATALOG entries have valid required fields and unique ids', () => {
  assert.ok(TECH_CATALOG.length > 50, 'Catalog should contain substantial number of badges');

  const seenIds = new Set<string>();
  const validCategories = new Set([
    'languages',
    'frontend',
    'backend',
    'database',
    'devops',
    'tools',
  ]);

  for (const item of TECH_CATALOG) {
    assert.ok(item.id, `Item must have an id`);
    assert.ok(item.name, `Item ${item.id} must have a name`);
    assert.ok(item.category, `Item ${item.id} must have a category`);
    assert.ok(validCategories.has(item.category), `Category ${item.category} in item ${item.id} must be valid`);
    assert.ok(item.logo, `Item ${item.id} must have a logo`);
    assert.ok(item.bgColor, `Item ${item.id} must have a bgColor`);

    assert.ok(!seenIds.has(item.id), `Duplicate ID found in TECH_CATALOG: ${item.id}`);
    seenIds.add(item.id);
  }
});

test('BADGE_CATEGORIES contains all expected filter categories', () => {
  const categoryIds = BADGE_CATEGORIES.map((c) => c.id);
  assert.ok(categoryIds.includes('all'));
  assert.ok(categoryIds.includes('languages'));
  assert.ok(categoryIds.includes('frontend'));
  assert.ok(categoryIds.includes('backend'));
  assert.ok(categoryIds.includes('database'));
  assert.ok(categoryIds.includes('devops'));
  assert.ok(categoryIds.includes('tools'));
});

test('buildBadgeUrl constructs proper shields.io URLs with default style', () => {
  const tsItem: TechBadgeItem = {
    id: 'typescript',
    name: 'TypeScript',
    category: 'languages',
    logo: 'typescript',
    bgColor: '3178C6',
  };

  const url = buildBadgeUrl(tsItem);
  assert.equal(
    url,
    'https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white'
  );
});

test('buildBadgeUrl respects custom badge styles', () => {
  const reactItem: TechBadgeItem = {
    id: 'react',
    name: 'React',
    category: 'frontend',
    logo: 'react',
    bgColor: '20232A',
    logoColor: '61DAFB',
  };

  const urlFlat = buildBadgeUrl(reactItem, 'flat');
  assert.equal(
    urlFlat,
    'https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB'
  );

  const urlFlatSquare = buildBadgeUrl(reactItem, 'flat-square');
  assert.equal(
    urlFlatSquare,
    'https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB'
  );
});

test('buildBadgeUrl handles hyphen escaping and labelColor', () => {
  const jsItem: TechBadgeItem = {
    id: 'javascript',
    name: 'Java-Script',
    category: 'languages',
    logo: 'javascript',
    bgColor: 'F7DF1E',
    logoColor: 'black',
    labelColor: 'black',
  };

  const url = buildBadgeUrl(jsItem, 'flat');
  // shields.io convention converts '-' into '--'
  assert.ok(url.includes('Java--Script-F7DF1E'));
  assert.ok(url.includes('&logoColor=black'));
  assert.ok(url.includes('&labelColor=black'));
});
