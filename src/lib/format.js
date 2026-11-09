// Null-safe number formatting. Every API number goes through these helpers,
// so a missing value renders as a dash instead of crashing the page.

export const LOCALE = 'en-US';
export const MISSING = '–';

const cache = new Map();
function formatter(options) {
  const key = JSON.stringify(options);
  if (!cache.has(key)) cache.set(key, new Intl.NumberFormat(LOCALE, options));
  return cache.get(key);
}

const isNumber = value => typeof value === 'number' && Number.isFinite(value);

// Prices: two decimals from 1 upwards, four significant digits below 1, so
// sub-cent coins (0.00000392) stay readable instead of showing 0.00.
export function formatPrice(value, currency) {
  if (!isNumber(value)) return MISSING;
  const abs = Math.abs(value);
  const digits =
    abs !== 0 && abs < 1
      ? { minimumSignificantDigits: 2, maximumSignificantDigits: 4 }
      : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return formatter({
    style: 'currency',
    currency: currency.toUpperCase(),
    ...digits,
  }).format(value);
}

// Absolute change with an explicit sign: +€12.30, -€1,345.14.
export function formatPriceChange(value, currency) {
  if (!isNumber(value)) return MISSING;
  const formatted = formatPrice(Math.abs(value), currency);
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

// Large amounts in compact notation: €1.34T.
export function formatCompactCurrency(value, currency) {
  if (!isNumber(value)) return MISSING;
  return formatter({
    style: 'currency',
    currency: currency.toUpperCase(),
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

// Percent values as the API sends them (2.5 means 2.5 %): +2.50%, -5.40%.
export function formatPercent(value) {
  if (!isNumber(value)) return MISSING;
  return formatter({
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  }).format(value / 100);
}

// Plain amounts (converter results): up to six decimals, or six significant
// digits for values below 1.
export function formatAmount(value) {
  if (!isNumber(value)) return MISSING;
  const abs = Math.abs(value);
  return formatter(
    abs !== 0 && abs < 1
      ? { maximumSignificantDigits: 6 }
      : { maximumFractionDigits: 6 }
  ).format(value);
}

// 'up', 'down', 'flat', or null when there is no value to compare.
export function trend(value) {
  if (!isNumber(value)) return null;
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'flat';
}
