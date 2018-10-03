import 'isomorphic-fetch';
import { CacheProvider, MemoryCacheProvider } from './cache';

export const API_ENDPOINT = 'https://cryptoscamdb.org/api/v1';

export interface Options {
    cache?: {
        enabled: boolean;
        cacheProvider?: CacheProvider;
        cacheDuration?: number;
    };
}

export interface Entry {
    name?: string;
    url?: string;
    category?: string;
    subcategory?: string;
    description?: string;
    addresses?: string[];
    reporter?: string;
    coin?: string;
    featured?: boolean;
    status?: string;
    statusCode?: number;
    updated?: number;
}

export interface CheckResponse {
    success: boolean;
    message?: string;
    result?: 'neutral' | 'blocked' | 'verified' | 'whitelisted';
    type?: 'ip' | 'address' | 'domain';
    entries?: Entry[];
}

export interface AllScamsResponse {
    success: boolean;
    message?: string;
    result: Entry[];
}

export interface AllScamsByResponse {
    success: boolean;
    message?: string;
    result: {
        [key: string]: Entry[];
    };
}

export default class API {
    private readonly cacheEnabled: boolean = false;
    private readonly cacheProvider?: CacheProvider;
    private readonly cacheDuration?: number;

    /**
     * Construct a new instance of the API wrapper.
     * @param options
     */
    constructor(options: Options = { cache: { enabled: false } }) {
        if (options.cache && options.cache.enabled) {
            this.cacheEnabled = true;
            this.cacheProvider = options.cache.cacheProvider || new MemoryCacheProvider();
            this.cacheDuration = options.cache.cacheDuration || 600000;
        }
    }

    /**
     * Check a domain, Ethereum address or IP address.
     * @param query
     */
    async check(query: string): Promise<CheckResponse> {
        return this.getOrFetch(`check-${query}`, () => {
            return new Promise<CheckResponse>((resolve, reject) => {
                fetch(`${API_ENDPOINT}/check/${query}`)
                    .then(response => response.json())
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    /**
     * Get all scams.
     */
    async getAllScams(): Promise<AllScamsResponse> {
        return this.getOrFetch(`all-scams`, () => {
            return new Promise<AllScamsResponse>((resolve, reject) => {
                fetch(`${API_ENDPOINT}/scams`)
                    .then(response => response.json())
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    /**
     * Get all scams mapped by Ethereum addresses.
     */
    async getAllScamsByAddress(): Promise<AllScamsByResponse> {
        return this.getOrFetch(`all-scams-by-address`, () => {
            return new Promise<AllScamsByResponse>((resolve, reject) => {
                fetch(`${API_ENDPOINT}/addresses`)
                    .then(response => response.json())
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    /**
     * Get all scams mapped by IP address.
     */
    async getAllScamsByIP(): Promise<AllScamsByResponse> {
        return this.getOrFetch(`all-scams-by-ip`, () => {
            return new Promise<AllScamsByResponse>((resolve, reject) => {
                fetch(`${API_ENDPOINT}/ips`)
                    .then(response => response.json())
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    /**
     * Get an item from cache (if present) or fetch again using a callback.
     * @param key
     * @param callback
     */
    private async getOrFetch<T>(key: string, callback: () => Promise<T>): Promise<T> {
        if (this.cacheEnabled && (await this.cacheProvider!.has(key))) {
            const now = new Date().getTime();
            if (now - (await this.cacheProvider!.getTimestamp(key)) < this.cacheDuration!) {
                const result = await this.cacheProvider!.get<T>(key);
                if (result) {
                    return result;
                }
            }
        }

        const callbackResult = await callback();
        if (this.cacheEnabled) {
            await this.cacheProvider!.set<T>(key, callbackResult);
        }

        return callbackResult;
    }
}
