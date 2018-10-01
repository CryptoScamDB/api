export interface CacheProvider {
    get<T = any>(key: string): Promise<T | undefined>;
    getTimestamp(key: string): Promise<number>;
    set<T = any>(key: string, result: T): Promise<boolean>;
    has(key: string): Promise<boolean>;
    remove(key: string): Promise<boolean>;
}

interface MemoryCacheItem {
    timestamp: number;
    value: any;
}

export class MemoryCacheProvider implements CacheProvider {
    private cache: { [key: string]: MemoryCacheItem } = {};

    async get<T = object>(key: string): Promise<T | undefined> {
        return this.cache[key].value;
    }

    async getTimestamp(key: string): Promise<number> {
        return this.cache[key].timestamp;
    }

    async set(key: string, result: any): Promise<boolean> {
        this.cache[key] = {
            timestamp: new Date().getTime(),
            value: result
        };
        return true;
    }

    async has(key: string): Promise<boolean> {
        return !!this.cache[key];
    }

    async remove(key: string): Promise<boolean> {
        delete this.cache[key];
        return true;
    }
}
