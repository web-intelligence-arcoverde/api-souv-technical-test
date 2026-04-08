export interface ICacheProvider {
	get<T = unknown>(key: string): Promise<T | null>;
	set(key: string, value: unknown, ttl?: number): Promise<void>;
	del(key: string): Promise<void>;
	invalidateByPattern(pattern: string): Promise<void>;
}
