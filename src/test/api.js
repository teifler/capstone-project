import { vi } from 'vitest';
import { rawChart, rawMarkets } from './fixtures.js';

export function jsonResponse(body, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

export function rateLimited(retryAfter) {
  return jsonResponse(
    { status: { error_code: 429, error_message: 'Rate limit' } },
    {
      status: 429,
      headers: retryAfter == null ? {} : { 'Retry-After': String(retryAfter) },
    }
  );
}

export function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// Replaces fetch with `handler(url: URL, init)`; the mock honours AbortSignal
// like the real fetch. Returns the vi.fn so tests can inspect calls.
export function mockFetch(handler) {
  const fn = vi.fn(
    (input, init = {}) =>
      new Promise((resolve, reject) => {
        const { signal } = init;
        const abort = () =>
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        if (signal?.aborted) return abort();
        signal?.addEventListener('abort', abort, { once: true });
        Promise.resolve()
          .then(() => handler(new URL(String(input)), init))
          .then(resolve, reject);
      })
  );
  vi.stubGlobal('fetch', fn);
  return fn;
}

// Serves the fixtures like the CoinGecko endpoints the app uses.
export function coinGecko({ markets = rawMarkets, chart = rawChart } = {}) {
  return url => {
    if (url.pathname === '/api/v3/coins/markets') {
      const ids = url.searchParams.get('ids');
      if (ids === null) return jsonResponse(markets);
      const wanted = ids.split(',');
      return jsonResponse(markets.filter(coin => wanted.includes(coin.id)));
    }
    if (/^\/api\/v3\/coins\/[a-z0-9-]+\/market_chart$/.test(url.pathname)) {
      return jsonResponse(chart);
    }
    return jsonResponse({ error: 'not found' }, { status: 404 });
  };
}

// URLs of all requests made so far.
export function requestedUrls(fetchMock) {
  return fetchMock.mock.calls.map(([input]) => new URL(String(input)));
}
