class InMemoryCache {
  private ttls;
  private cache;

  constructor() {
    this.cache = new Map();
    this.ttls = new Map();
  }

  async get(key: string) {
    if (this.ttls.has(key) && Date.now() > this.ttls.get(key)) {
      this.cache.delete(key);
      this.ttls.delete(key);
      return null;
    }
    return this.cache.get(key) || null;
  }

  async set(key: string, value: string, ttlSeconds = 3600) {
    this.cache.set(key, value);
    this.ttls.set(key, Date.now() + ttlSeconds * 1000);
  }

  async delete(key: string) {
    this.cache.delete(key);
    this.ttls.delete(key);
  }
}

export class CacheManager {
  private cache;
  constructor() {
    this.cache = new InMemoryCache();
  }

  async get(key: string) {
    return await this.cache.get(key);
  }

  async set(key: string, value: string, ttlSeconds = 3600) {
    return await this.cache.set(key, value, ttlSeconds);
  }

  async delete(key: string) {
    return await this.cache.delete(key);
  }
}
