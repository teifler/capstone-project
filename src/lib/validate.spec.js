import { describe, expect, it } from 'vitest';
import {
  coinPath,
  isValidCoinId,
  safeImageUrl,
  toFiniteNumber,
  toText,
} from './validate.js';

describe('isValidCoinId', () => {
  it.each(['bitcoin', 'the-open-network', 'usd-coin', '0x', 'a'])(
    'accepts %s',
    id => {
      expect(isValidCoinId(id)).toBe(true);
    }
  );

  it.each([
    '/evil.example',
    '\\evil.example',
    '/\\evil.example',
    '__proto__',
    'constructor ',
    '../coins',
    '*',
    ':id',
    'Bitcoin',
    'bit coin',
    '',
    'a'.repeat(101),
    null,
    undefined,
    42,
  ])('rejects %j', id => {
    expect(isValidCoinId(id)).toBe(false);
  });
});

describe('coinPath', () => {
  it('builds same-origin paths for valid ids only', () => {
    expect(coinPath('bitcoin')).toBe('/bitcoin');
    // These became protocol-relative links (//evil.example) before.
    expect(coinPath('/evil.example')).toBeNull();
    expect(coinPath('\\evil.example')).toBeNull();
  });
});

describe('safeImageUrl', () => {
  it('allows https images from the CoinGecko image hosts', () => {
    const url =
      'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400';
    expect(safeImageUrl(url)).toBe(url);
  });

  it.each([
    'http://coin-images.coingecko.com/x.png',
    'https://evil.example/pixel.gif',
    'https://coin-images.coingecko.com.evil.example/x.png',
    'https://user:pw@coin-images.coingecko.com/x.png',
    'https://coin-images.coingecko.com:8443/x.png',
    'javascript:alert(1)',
    'data:image/png;base64,AAAA',
    '//coin-images.coingecko.com/x.png',
    'not a url',
    null,
  ])('rejects %j', value => {
    expect(safeImageUrl(value)).toBeNull();
  });
});

describe('toFiniteNumber / toText', () => {
  it('keeps finite numbers and maps everything else to null', () => {
    expect(toFiniteNumber(0)).toBe(0);
    expect(toFiniteNumber(-2.5)).toBe(-2.5);
    expect(toFiniteNumber(null)).toBeNull();
    expect(toFiniteNumber(NaN)).toBeNull();
    expect(toFiniteNumber('1')).toBeNull();
  });

  it('trims and bounds text', () => {
    expect(toText('  Bitcoin ')).toBe('Bitcoin');
    expect(toText('x'.repeat(200), 10)).toHaveLength(10);
    expect(toText(undefined)).toBe('');
  });
});
