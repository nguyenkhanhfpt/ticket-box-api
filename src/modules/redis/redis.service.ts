import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get a value from the cache
   * @param key - The key to get
   * @returns The value or undefined if it doesn't exist
   */
  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get(key);
  }

  /**
   * Set a value in the cache
   * @param key - The key to set
   * @param value - The value to set
   * @param ttl - The time to live in seconds
   * @returns void
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const options = ttl ? { ttl } : {};
    return await this.cacheManager.set(key, value, options as any);
  }

  /**
   * Delete a value from the cache
   * @param key - The key to delete
   * @returns void
   */
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  /**
   * Wrap a function in the cache
   * @param key - The key to wrap
   * @param fn - The function to wrap
   * @param ttl - The time to live in seconds
   * @returns The value
   */
  async wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    return await this.cacheManager.wrap(key, fn, ttl);
  }
}
