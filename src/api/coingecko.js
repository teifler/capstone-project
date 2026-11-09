import { ApiError } from './errors.js';
import { getJson } from './http.js';
import { useCachedResource, useResource } from './resource.js';
import {
  isValidCoinId,
  safeImageUrl,
  toFiniteNumber,
  toText,
} from '../lib/validate.js';

export const API_BASE = 'https://api.coingecko.com/api/v3';
export const VS_CURRENCY = 'eur';
export const TOP_COINS_LIMIT = 100;

// Turns one /coins/markets record into the shape the UI uses. Returns null for
// records without a valid id; every number is either finite or null.
export function parseCoin(raw) {
  if (!raw || typeof raw !== 'object' || !isValidCoinId(raw.id)) return null;
  return {
    id: raw.id,
    name: toText(raw.name) || raw.id,
    symbol: toText(raw.symbol, 20).toUpperCase(),
    image: safeImageUrl(raw.image),
    rank: toFiniteNumber(raw.market_cap_rank),
    price: toFiniteNumber(raw.current_price),
    change24h: toFiniteNumber(raw.price_change_24h),
    changePercent24h: toFiniteNumber(raw.price_change_percentage_24h),
    marketCap: toFiniteNumber(raw.market_cap),
    marketCapChangePercent24h: toFiniteNumber(
      raw.market_cap_change_percentage_24h
    ),
    low24h: toFiniteNumber(raw.low_24h),
    high24h: toFiniteNumber(raw.high_24h),
    ath: toFiniteNumber(raw.ath),
    atl: toFiniteNumber(raw.atl),
    lastUpdated: typeof raw.last_updated === 'string' ? raw.last_updated : null,
  };
}

export function parseMarkets(json) {
  if (!Array.isArray(json)) {
    throw new ApiError('parse', 'Expected a list of coins');
  }
  const seen = new Set();
  const coins = [];
  for (const raw of json) {
    const coin = parseCoin(raw);
    if (coin && !seen.has(coin.id)) {
      seen.add(coin.id);
      coins.push(coin);
    }
  }
  return coins;
}

// /coins/{id}/market_chart -> [{ time, price }], invalid points dropped.
export function parseChart(json) {
  if (!json || !Array.isArray(json.prices)) {
    throw new ApiError('parse', 'Expected a price history');
  }
  return json.prices
    .filter(
      point =>
        Array.isArray(point) &&
        toFiniteNumber(point[0]) !== null &&
        toFiniteNumber(point[1]) !== null
    )
    .map(([time, price]) => ({ time, price }));
}

// Chart timeframes offered on the coin page (days -> label).
export const TIMEFRAMES = [
  { days: 1, label: '1 Day' },
  { days: 7, label: '7 Days' },
  { days: 30, label: '1 Month' },
  { days: 90, label: '3 Months' },
  { days: 365, label: '1 Year' },
];
export const DEFAULT_DAYS = 1;

export function parseDays(value) {
  const days = Number(value);
  return TIMEFRAMES.some(t => t.days === days) ? days : DEFAULT_DAYS;
}

// URLs are built with URL/URLSearchParams from validated ids only.
export function marketsUrl({ ids } = {}) {
  const url = new URL(`${API_BASE}/coins/markets`);
  url.searchParams.set('vs_currency', VS_CURRENCY);
  url.searchParams.set('order', 'market_cap_desc');
  if (ids) {
    const valid = ids.filter(isValidCoinId);
    url.searchParams.set('ids', valid.join(','));
    url.searchParams.set('per_page', String(Math.max(1, valid.length)));
  } else {
    url.searchParams.set('per_page', String(TOP_COINS_LIMIT));
  }
  url.searchParams.set('page', '1');
  url.searchParams.set('sparkline', 'false');
  return url.href;
}

export function chartUrl(id, days) {
  if (!isValidCoinId(id)) throw new ApiError('parse', 'Invalid coin id');
  const url = new URL(
    `${API_BASE}/coins/${encodeURIComponent(id)}/market_chart`
  );
  url.searchParams.set('vs_currency', VS_CURRENCY);
  url.searchParams.set('days', String(parseDays(days)));
  return url.href;
}

const loadMarkets = (url, signal) =>
  getJson(url, { signal }).then(parseMarkets);
const loadChart = (url, signal) => getJson(url, { signal }).then(parseChart);

const byRank = (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity);

// Top 100 by market cap (home page, converter).
export function useTopCoins() {
  return useResource(marketsUrl(), loadMarkets);
}

// A single coin. Reuses the top list when the visitor came from there, so a
// coin page usually costs only the chart request.
export function useCoin(id) {
  const valid = isValidCoinId(id);
  const top = useCachedResource(valid ? marketsUrl() : null);
  const fromList = top?.data?.find(coin => coin.id === id);
  const single = useResource(
    valid && !fromList ? marketsUrl({ ids: [id] }) : null,
    loadMarkets
  );
  if (fromList) {
    return { ...single, coin: fromList, isLoading: false, error: null };
  }
  return { ...single, coin: single.data?.[0] ?? null };
}

// Any set of coins by id (tracker), not limited to today's top 100.
export function useCoins(ids) {
  const top = useCachedResource(ids.length ? marketsUrl() : null);
  const all = top?.data;
  const fromList =
    all && ids.every(id => all.some(coin => coin.id === id))
      ? all.filter(coin => ids.includes(coin.id))
      : undefined;
  const key =
    ids.length && !fromList ? marketsUrl({ ids: [...ids].sort() }) : null;
  const result = useResource(key, loadMarkets);
  if (!ids.length) return { ...result, coins: [], isLoading: false };
  if (fromList) {
    return { ...result, coins: fromList, isLoading: false, error: null };
  }
  return {
    ...result,
    coins: result.data ? [...result.data].sort(byRank) : null,
  };
}

export function useChart(id, days) {
  return useResource(isValidCoinId(id) ? chartUrl(id, days) : null, loadChart);
}
