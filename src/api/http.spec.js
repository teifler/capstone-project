import { describe, expect, it, vi } from 'vitest';
import {
  BACKOFF_BASE_MS,
  BACKOFF_MAX_MS,
  DEFAULT_TIMEOUT_MS,
  getJson,
  parseRetryAfter,
} from './http.js';
import { ApiError } from './errors.js';
import { deferred, jsonResponse, mockFetch, rateLimited } from '../test/api.js';

const URL_A = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur';
const URL_B = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart';

async function failure(promise) {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('expected the request to fail');
}

describe('getJson', () => {
  it('returns the parsed body and sends no credentials', async () => {
    const fetchMock = mockFetch(() => jsonResponse([{ id: 'bitcoin' }]));
    await expect(getJson(URL_A)).resolves.toEqual([{ id: 'bitcoin' }]);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.credentials).toBe('omit');
    expect(init.headers).toEqual({ Accept: 'application/json' });
  });

  it('turns a 429 into a rate-limit error that honours Retry-After', async () => {
    mockFetch(() => rateLimited(30));
    const error = await failure(getJson(URL_A));
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      kind: 'rate-limit',
      status: 429,
      retryAfterMs: 30_000,
    });
  });

  it('stops sending requests to a rate-limited API until the cooldown ends', async () => {
    vi.useFakeTimers();
    const fetchMock = mockFetch(() => rateLimited());
    const first = await failure(getJson(URL_A));
    expect(first.retryAfterMs).toBe(BACKOFF_BASE_MS);

    // Another endpoint on the same host fails fast without a request.
    const blocked = await failure(getJson(URL_B));
    expect(blocked.kind).toBe('rate-limit');
    expect(blocked.retryAfterMs).toBe(BACKOFF_BASE_MS);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // After the cooldown a second 429 doubles the wait.
    vi.advanceTimersByTime(BACKOFF_BASE_MS);
    const second = await failure(getJson(URL_A));
    expect(second.retryAfterMs).toBe(BACKOFF_BASE_MS * 2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('caps the backoff and resets it after a success', async () => {
    vi.useFakeTimers();
    let status = 429;
    mockFetch(() => (status === 429 ? rateLimited() : jsonResponse([])));
    let wait = 0;
    for (let i = 0; i < 6; i += 1) {
      wait = (await failure(getJson(URL_A))).retryAfterMs;
      vi.advanceTimersByTime(wait);
    }
    expect(wait).toBe(BACKOFF_MAX_MS);

    status = 200;
    await expect(getJson(URL_A)).resolves.toEqual([]);
    status = 429;
    expect((await failure(getJson(URL_A))).retryAfterMs).toBe(BACKOFF_BASE_MS);
  });

  it('reports other HTTP errors with their status', async () => {
    mockFetch(() => jsonResponse({}, { status: 503 }));
    expect(await failure(getJson(URL_A))).toMatchObject({
      kind: 'http',
      status: 503,
    });
  });

  it('reports invalid JSON as a parse error', async () => {
    mockFetch(() => new Response('<html>', { status: 200 }));
    expect((await failure(getJson(URL_A))).kind).toBe('parse');
  });

  it('treats a network failure like a rate limit (CORS hides 429s)', async () => {
    mockFetch(() => {
      throw new TypeError('Failed to fetch');
    });
    expect(await failure(getJson(URL_A))).toMatchObject({
      kind: 'unreachable',
      retryAfterMs: BACKOFF_BASE_MS,
    });
  });

  it('says so when the browser is offline', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    mockFetch(() => {
      throw new TypeError('Failed to fetch');
    });
    expect((await failure(getJson(URL_A))).kind).toBe('offline');
  });

  it('gives up after the timeout', async () => {
    vi.useFakeTimers();
    mockFetch(() => deferred().promise);
    const pending = failure(getJson(URL_A));
    await vi.advanceTimersByTimeAsync(DEFAULT_TIMEOUT_MS);
    expect((await pending).kind).toBe('timeout');
  });

  it('can be aborted by the caller', async () => {
    mockFetch(() => deferred().promise);
    const controller = new AbortController();
    const pending = failure(getJson(URL_A, { signal: controller.signal }));
    controller.abort();
    expect((await pending).kind).toBe('abort');

    const already = new AbortController();
    already.abort();
    expect(
      (await failure(getJson(URL_A, { signal: already.signal }))).kind
    ).toBe('abort');
  });
});

describe('parseRetryAfter', () => {
  it('reads seconds and HTTP dates, ignores garbage', () => {
    const now = Date.parse('2026-11-09T12:00:00Z');
    expect(parseRetryAfter('42', now)).toBe(42_000);
    expect(parseRetryAfter('Mon, 09 Nov 2026 12:01:00 GMT', now)).toBe(60_000);
    expect(parseRetryAfter('Mon, 09 Nov 2026 11:00:00 GMT', now)).toBe(0);
    expect(parseRetryAfter('99999', now)).toBe(600_000);
    expect(parseRetryAfter('soon', now)).toBeNull();
    expect(parseRetryAfter('', now)).toBeNull();
    expect(parseRetryAfter(null, now)).toBeNull();
  });
});
