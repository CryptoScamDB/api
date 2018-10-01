import 'mocha';
import { expect } from 'chai';
import { CacheProvider, MemoryCacheProvider } from '../src/cache';

let cache: CacheProvider;

beforeEach(async (): Promise<void> => {
    // Creates a new instance of the cache provider and sets a value before each test
    cache = new MemoryCacheProvider();
    await cache.set('foo', 'bar');
});

describe('cache', () => {
    it('should contain a value', async (): Promise<void> => {
        expect(await cache.has('foo')).to.equal(true);
        expect(await cache.get('foo')).to.equal('bar');
    });

    it('should have a timestamp', async (): Promise<void> => {
        expect(await cache.getTimestamp('foo')).to.not.equal(undefined);
    });

    it('should update the value', async (): Promise<void> => {
        await cache.set('foo', 'baz');
        expect(await cache.get('foo')).to.equal('baz');
    });

    it('should remove the value', async (): Promise<void> => {
        await cache.remove('foo');
        expect(await cache.has('foo')).to.equal(false);
    });
});
