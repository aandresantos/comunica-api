export interface CacheOpts {
  ttlInSeconds?: number;
}

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, opts?: Partial<CacheOpts>): Promise<void>;
  del(key: string): Promise<void>;
}
