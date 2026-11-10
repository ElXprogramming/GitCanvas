/**
 * High-performance Bounded LRU Cache with TTL support.
 * Prevents memory leaks by evicting least-recently used or expired entries.
 */
interface CacheEntry<T> {
  value: T;
  expiry: number;
}

export class BoundedMemoryCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>();
  private readonly defaultTtlMs: number;
  private readonly maxSize: number;

  constructor(options: { defaultTtlMs?: number; maxSize?: number } = {}) {
    this.defaultTtlMs = options.defaultTtlMs ?? 60 * 1000; // 60s default
    this.maxSize = options.maxSize ?? 500; // Max 500 entries default
  }

  get<R = T>(key: string): R | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }

    // Refresh LRU order: delete and re-insert
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value as unknown as R;
  }

  set(key: string, value: T, ttlMs?: number): void {
    const expiry = Date.now() + (ttlMs ?? this.defaultTtlMs);

    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxSize) {
      // Evict oldest (first) entry or first expired entry
      const now = Date.now();
      let expiredKey: string | null = null;
      this.store.forEach((e, k) => {
        if (!expiredKey && now > e.expiry) {
          expiredKey = k;
        }
      });

      if (expiredKey) {
        this.store.delete(expiredKey);
      } else {
        // Evict least-recently used (oldest inserted in Map iteration order)
        const oldestKey = this.store.keys().next().value;
        if (oldestKey !== undefined) {
          this.store.delete(oldestKey);
        }
      }
    }

    this.store.set(key, { value, expiry });
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  deletePrefix(prefix: string): void {
    const p = prefix.toLowerCase();
    const toDelete: string[] = [];
    this.store.forEach((_, key) => {
      if (key.toLowerCase().includes(p)) {
        toDelete.push(key);
      }
    });
    for (let i = 0; i < toDelete.length; i++) {
      this.store.delete(toDelete[i]);
    }
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

// Global shared cache instance for GitHub API data
export const globalApiCache = new BoundedMemoryCache<any>({
  defaultTtlMs: 60 * 1000,
  maxSize: 500,
});
