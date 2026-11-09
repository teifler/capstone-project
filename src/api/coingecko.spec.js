import { describe, expect, it } from 'vitest';
import { parseChart, parseCoin, parseMarkets } from './coingecko.js';
import { ApiError } from './errors.js';
import { rawChart, rawCoin, rawMarkets } from '../test/fixtures.js';

describe('parseMarkets', () => {
  it('normalises the live payload, including null 24h values', () => {
    const coins = parseMarkets(rawMarkets);
    expect(coins.map(c => c.id)).toEqual(rawMarkets.map(c => c.id));
    const heloc = coins.find(c => c.id === 'figure-heloc');
    expect(heloc.changePercent24h).toBeNull();
    expect(heloc.change24h).toBeNull();
    expect(heloc.price).toBe(0.943388);
    expect(coins[0]).toMatchObject({
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      rank: 1,
      price: 66433,
      low24h: 65842,
      ath: 107662,
      atl: 51.3,
    });
  });

  it('drops records whose id must not reach links, routes or object keys', () => {
    const btc = rawCoin('bitcoin');
    const coins = parseMarkets([
      { ...btc, id: '/evil.example' },
      { ...btc, id: '\\evil.example' },
      { ...btc, id: '__proto__' },
      { ...btc, id: '*' },
      null,
      'bitcoin',
      btc,
      { ...btc, name: 'Duplicate' },
    ]);
    expect(coins).toHaveLength(1);
    expect(coins[0].name).toBe('Bitcoin');
  });

  it('removes images from unexpected hosts', () => {
    const coin = parseCoin({
      ...rawCoin('bitcoin'),
      image: 'https://tracker.evil.example/p.gif',
    });
    expect(coin.image).toBeNull();
  });

  it('maps wrong types to null and falls back to the id as name', () => {
    const coin = parseCoin({
      id: 'x',
      name: 42,
      symbol: null,
      current_price: '1',
      market_cap_rank: NaN,
    });
    expect(coin).toMatchObject({
      id: 'x',
      name: 'x',
      symbol: '',
      price: null,
      rank: null,
    });
  });

  it('rejects answers that are not a list', () => {
    expect(() => parseMarkets({ status: { error_code: 429 } })).toThrow(
      ApiError
    );
  });
});

describe('parseChart', () => {
  it('returns time/price points and skips broken ones', () => {
    const points = parseChart({
      prices: [[1, 2], [3, null], 'x', [5, 6]],
    });
    expect(points).toEqual([
      { time: 1, price: 2 },
      { time: 5, price: 6 },
    ]);
    expect(parseChart(rawChart)).toHaveLength(rawChart.prices.length);
  });

  it('rejects answers without prices', () => {
    expect(() => parseChart({ status: { error_code: 429 } })).toThrow(ApiError);
    expect(() => parseChart(null)).toThrow(ApiError);
  });
});
