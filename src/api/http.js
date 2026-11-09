import { ApiError } from './errors.js';

export const DEFAULT_TIMEOUT_MS = 10_000;
// Wait at least this long after a 429 (doubling per consecutive 429, capped),
// or longer when the server sends Retry-After.
export const BACKOFF_BASE_MS = 15_000;
export const BACKOFF_MAX_MS = 120_000;
const RETRY_AFTER_MAX_MS = 10 * 60_000;

// Per API origin: no requests until `until`; `strikes` counts consecutive
// failures for the exponential backoff.
const cooldowns = new Map();

export function resetHttpState() {
  cooldowns.clear();
}

// Retry-After is either delta-seconds or an HTTP date.
export function parseRetryAfter(value, now = Date.now()) {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const text = value.trim();
  if (/^\d+$/.test(text)) {
    return Math.min(Number(text) * 1000, RETRY_AFTER_MAX_MS);
  }
  const date = Date.parse(text);
  if (Number.isNaN(date)) return null;
  return Math.min(Math.max(0, date - now), RETRY_AFTER_MAX_MS);
}

function startCooldown(origin, retryAfterMs) {
  const strikes = (cooldowns.get(origin)?.strikes ?? 0) + 1;
  const backoff = Math.min(
    BACKOFF_MAX_MS,
    BACKOFF_BASE_MS * 2 ** (strikes - 1)
  );
  const wait = Math.max(retryAfterMs ?? 0, backoff);
  cooldowns.set(origin, { until: Date.now() + wait, strikes });
  return wait;
}

// GET a JSON document. Rejects with ApiError only.
// - `signal` aborts the request (kind 'abort').
// - After a 429 (or a network failure, see below) further requests to the
//   same origin fail fast until the cooldown is over, so the app does not keep
//   hammering a rate-limited API.
export async function getJson(
  url,
  { signal, timeoutMs = DEFAULT_TIMEOUT_MS } = {}
) {
  const { origin } = new URL(url);
  const cooldown = cooldowns.get(origin);
  const remaining = cooldown ? cooldown.until - Date.now() : 0;
  if (remaining > 0) {
    throw new ApiError('rate-limit', 'Waiting for the rate limit to reset', {
      retryAfterMs: remaining,
    });
  }
  if (signal?.aborted) throw new ApiError('abort', 'Request aborted');

  const controller = new AbortController();
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort, { once: true });
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      credentials: 'omit',
    });
    if (response.status === 429) {
      const wait = startCooldown(
        origin,
        parseRetryAfter(response.headers.get('Retry-After'))
      );
      throw new ApiError('rate-limit', 'HTTP 429', {
        status: 429,
        retryAfterMs: wait,
      });
    }
    if (!response.ok) {
      throw new ApiError('http', `HTTP ${response.status}`, {
        status: response.status,
      });
    }
    const body = await response.json();
    cooldowns.delete(origin);
    return body;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (signal?.aborted) {
      throw new ApiError('abort', 'Request aborted', { cause: error });
    }
    if (timedOut) {
      throw new ApiError('timeout', 'Request timed out', { cause: error });
    }
    if (error instanceof SyntaxError) {
      throw new ApiError('parse', 'Response was not JSON', { cause: error });
    }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new ApiError('offline', 'Browser is offline', { cause: error });
    }
    // fetch() rejects with a TypeError when the network fails, and also when
    // a 429 arrives without CORS headers (the browser hides the status then).
    // Treat it like a rate limit: back off and retry later.
    const wait = startCooldown(origin, null);
    throw new ApiError('unreachable', 'Network request failed', {
      retryAfterMs: wait,
      cause: error,
    });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
}
