# API

A Javascript wrapper for the CryptoScamDB API for Node.js and browser applications.

## Usage

> npm i -P @cryptoscamdb/api

## API

### Options

* **cache.enable** (default: false) - _Enable or disable the cache_
* **cache.cacheProvider** (default: `MemoryCacheProvider`, in-memory caching) - _Set the cache provider_
* **cache.cacheDuration** (default: 600000) - _Set the duration in milliseconds to cache a result for_

### Methods

All methods return a promise.

* **check(query: string)** - _Check a domain, Ethereum address or IP address_
* **getAllScams()** - _Get a list of all scams_
* **getAllScamsByAddress()** - _Get a list of all scams mapped by the Ethereum address_
* **getAllScamsByIP()** - _Get a list of all scams mapped by the IP address_

### Cache provider

You can use the `CacheProvider` interface to implement your own caching method (e.g. filesystem or Redis).

```typescript
interface CacheProvider {
    get<T = any>(key: string): Promise<T | undefined>;
    getTimestamp(key: string): Promise<number>;
    set<T = any>(key: string, result: T): Promise<boolean>;
    has(key: string): Promise<boolean>;
    remove(key: string): Promise<boolean>;
}
```

See [`cache.ts`](https://github.com/CryptoScamDB/api/blob/master/src/cache.ts#L14) for an example (in-memory) implementation.

## Example

```typescript
import CryptoScamDBAPI from '@cryptoscamdb/api';

const options = {
    cache: {
        enable: true
    }
};
const api = new CryptoScamDBAPI(options);

// Equal to https://cryptoscamdb.org/api/check/example.com
api.check('example.com')
    .then(result => {
        // Do something with the result
        console.log(result.entries);
    })
    // Handle error
    .catch(console.error);
```