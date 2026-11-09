// Fixtures are verbatim records from CoinGecko /coins/markets?vs_currency=eur
// (2026-11-09). figure-heloc is the record with null 24h values that blanked
// the live demo; shiba-inu has a sub-cent price.
import rawMarkets from './fixtures/markets.json';
import rawChart from './fixtures/chart-bitcoin-1d.json';
import { parseMarkets } from '../api/coingecko.js';

export { rawMarkets, rawChart };

export const coins = parseMarkets(rawMarkets);

export function coinById(id) {
  return coins.find(coin => coin.id === id);
}

export function rawCoin(id) {
  return rawMarkets.find(coin => coin.id === id);
}
