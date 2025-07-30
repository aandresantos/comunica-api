import NodeCache from "node-cache";
import { CacheOpts, ICacheService } from "./cache.interfaces";

export class NodeCacheService implements ICacheService {
  private cache: NodeCache;

  constructor(opts: CacheOpts) {
    this.cache = new NodeCache({ stdTTL: opts.ttlInSeconds });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = this.cache.get<T>(key);
    return value ? value : null;
  }

  async set(key: string, value: any, opts: CacheOpts): Promise<void> {
    if (opts?.ttlInSeconds) {
      const { ttlInSeconds } = opts;

      this.cache.set(key, value, ttlInSeconds);
    } else {
      this.cache.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    this.cache.del(key);
  }
}
