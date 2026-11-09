// Validation for data that crosses a trust boundary (API answers, URL
// parameters, localStorage). Everything else in the app relies on these
// checks instead of trusting the shape of external data.

// CoinGecko ids are lower-case slugs ("bitcoin", "the-open-network").
// Anything else (slashes, backslashes, dots, "__proto__", ":x", "*") is
// rejected before it can reach a link, a route, an API URL or an object key.
export const COIN_ID_PATTERN = /^[a-z0-9-]{1,100}$/;

export function isValidCoinId(value) {
  return typeof value === 'string' && COIN_ID_PATTERN.test(value);
}

// Path of a coin page, or null for an id that must not become a link.
export function coinPath(id) {
  return isValidCoinId(id) ? `/${id}` : null;
}

// Image hosts the API uses today; the CSP img-src allows the same list.
export const IMAGE_HOSTS = [
  'coin-images.coingecko.com',
  'assets.coingecko.com',
];

export function safeImageUrl(value) {
  if (typeof value !== 'string') return null;
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const ok =
    url.protocol === 'https:' &&
    IMAGE_HOSTS.includes(url.hostname) &&
    url.port === '' &&
    url.username === '' &&
    url.password === '';
  return ok ? url.href : null;
}

export function toFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function toText(value, maxLength = 100) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}
