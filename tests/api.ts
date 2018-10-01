import 'mocha';
import { expect } from 'chai';
import CryptoScamDBAPI from '../src/api';

const api = new CryptoScamDBAPI();

describe('check', () => {
    it('should load the verified domain info', async (): Promise<void> => {
        const result = await api.check('mycrypto.com');
        expect(result.success).to.equal(true);
        expect(result.entries![0].featured).to.equal(true);
    });

    it('should load info for an Ethereum address', async (): Promise<void> => {
        const result = await api.check('0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520');
        expect(result.success).to.equal(true);
        expect(result.entries![0].name).to.equal('MyCrypto');
    });
});

describe('getAllScams', () => {
    it('should load all scams', async (): Promise<void> => {
        const result = await api.getAllScams();
        expect(result.success).to.equal(true);
        expect(result.result).to.be.an('array');
    });
});

describe('getAllScamsByAddress', () => {
    it('should load all scams mapped by addresses', async (): Promise<void> => {
        const result = await api.getAllScamsByAddress();
        expect(result.success).to.equal(true);
        expect(result.result).to.be.an('object');
    });
});

describe('getAllScamsByIP', () => {
    it('should load all scams mapped by IPs', async (): Promise<void> => {
        const result = await api.getAllScamsByIP();
        expect(result.success).to.equal(true);
        expect(result.result).to.be.an('object');
    });
});
