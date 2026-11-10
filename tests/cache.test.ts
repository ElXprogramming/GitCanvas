import test from 'node:test';
import assert from 'node:assert/strict';
import { BoundedMemoryCache } from '@/lib/cache';

test('BoundedMemoryCache stores and retrieves values', () => {
  const cache = new BoundedMemoryCache<string>({ defaultTtlMs: 1000, maxSize: 10 });
  cache.set('foo', 'bar');
  assert.equal(cache.get('foo'), 'bar');
  assert.equal(cache.get('unknown'), null);
});

test('BoundedMemoryCache expires entries after TTL', async () => {
  const cache = new BoundedMemoryCache<string>({ defaultTtlMs: 20, maxSize: 10 });
  cache.set('quick', 'val');
  assert.equal(cache.get('quick'), 'val');
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(cache.get('quick'), null);
});

test('BoundedMemoryCache enforces maxSize by evicting oldest', () => {
  const cache = new BoundedMemoryCache<number>({ defaultTtlMs: 10000, maxSize: 3 });
  cache.set('a', 1);
  cache.set('b', 2);
  cache.set('c', 3);
  assert.equal(cache.size, 3);

  // Access 'a' to refresh its LRU recency
  cache.get('a');

  // Insert 'd', which should evict 'b' (the oldest unaccessed)
  cache.set('d', 4);
  assert.equal(cache.size, 3);
  assert.equal(cache.get('b'), null);
  assert.equal(cache.get('a'), 1);
  assert.equal(cache.get('c'), 3);
  assert.equal(cache.get('d'), 4);
});

test('BoundedMemoryCache deletes by prefix', () => {
  const cache = new BoundedMemoryCache<string>();
  cache.set('user_john_profile', '1');
  cache.set('user_john_stats', '2');
  cache.set('user_mary_profile', '3');

  cache.deletePrefix('user_john');
  assert.equal(cache.get('user_john_profile'), null);
  assert.equal(cache.get('user_john_stats'), null);
  assert.equal(cache.get('user_mary_profile'), '3');
});
