import { ApiError } from './errors.js';
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
