import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { isRetryable } from './errors.js';

// A small cache for API resources, keyed by request URL.
//
// - Each key has its own entry, so one coin's data can never be shown for
//   another coin, and a failed request never leaves an older answer on screen.
// - Results are cached for `ttl` ms (CoinGecko itself caches for 30-60 s).
// - Components that need the same key share one request. When the last one
//   unmounts (or switches to another key) the request is aborted, so a late
//   answer cannot overwrite newer state.
// - Rate-limit and network errors are retried automatically after the
//   backoff the HTTP layer computed, a few times, then the user can retry.

export const DEFAULT_TTL_MS = 60_000;
export const MAX_AUTO_RETRIES = 3;
const MAX_ENTRIES = 100;

const entries = new Map(); // key -> { status, data, error, fetchedAt, retryInMs }
const inflight = new Map(); // key -> { controller, refs, abortTimer }
const attempts = new Map(); // key -> automatic retries done
const listeners = new Set();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeEntry(key, entry) {
  entries.delete(key);
  entries.set(key, entry);
  while (entries.size > MAX_ENTRIES) {
    entries.delete(entries.keys().next().value);
  }
  emit();
}

// Read-only view of a cached entry (no request is started).
export function useCachedResource(key) {
  const entry = useSyncExternalStore(
    subscribe,
    () => (key == null ? undefined : entries.get(key)),
    () => undefined
  );
  return entry?.status === 'success' ? { data: entry.data } : undefined;
}

export function invalidateResource(key) {
  if (entries.delete(key)) emit();
}

// Test helper: forget everything and abort pending requests.
export function resetResources() {
  for (const request of inflight.values()) {
    clearTimeout(request.abortTimer);
    request.controller.abort();
  }
  inflight.clear();
  entries.clear();
  attempts.clear();
  emit();
}

// Starts (or joins) the request for `key`; returns a release function.
function acquire(key, load) {
  let request = inflight.get(key);
  if (!request) {
    const controller = new AbortController();
    request = { controller, refs: 0, abortTimer: undefined };
    const current = request;
    inflight.set(key, current);
    load(key, controller.signal).then(
      data => {
        if (inflight.get(key) !== current) return;
        inflight.delete(key);
        attempts.delete(key);
        writeEntry(key, {
          status: 'success',
          data,
          error: null,
          fetchedAt: Date.now(),
        });
      },
      error => {
        if (inflight.get(key) !== current) return;
        inflight.delete(key);
        if (controller.signal.aborted) return;
        const done = attempts.get(key) ?? 0;
        writeEntry(key, {
          status: 'error',
          data: undefined,
          error,
          fetchedAt: Date.now(),
          retryInMs:
            isRetryable(error) && done < MAX_AUTO_RETRIES
              ? error.retryAfterMs
              : null,
        });
      }
    );
  }
  request.refs += 1;
  clearTimeout(request.abortTimer);
  const held = request;
  return () => {
    held.refs -= 1;
    if (held.refs > 0) return;
    // Deferred, so React StrictMode's unmount/remount in development and a
    // quick re-render reuse the request instead of sending a second one.
    held.abortTimer = setTimeout(() => {
      if (held.refs === 0 && inflight.get(key) === held) {
        inflight.delete(key);
        held.controller.abort();
      }
    }, 0);
  };
}

// `key` is the request URL (null = nothing to load). `load(key, signal)` must
// be a stable, module-level function that returns a promise of parsed data.
export function useResource(key, load, { ttl = DEFAULT_TTL_MS } = {}) {
  const entry = useSyncExternalStore(
    subscribe,
    () => (key == null ? undefined : entries.get(key)),
    () => undefined
  );
  const status = entry?.status ?? 'missing';

  useEffect(() => {
    if (key == null) return undefined;
    const current = entries.get(key);
    if (current?.status === 'error') {
      if (current.retryInMs == null) {
        // A final error is kept for `ttl`; after that a remount tries again.
        return Date.now() - current.fetchedAt < ttl
          ? undefined
          : acquire(key, load);
      }
      const timer = setTimeout(() => {
        attempts.set(key, (attempts.get(key) ?? 0) + 1);
        invalidateResource(key);
      }, current.retryInMs);
      return () => clearTimeout(timer);
    }
    if (current?.status === 'success' && Date.now() - current.fetchedAt < ttl) {
      return undefined;
    }
    return acquire(key, load);
  }, [key, load, ttl, status]);

  const retry = useCallback(() => {
    if (key == null) return;
    attempts.delete(key);
    invalidateResource(key);
  }, [key]);

  return {
    data: entry?.status === 'success' ? entry.data : undefined,
    error: entry?.status === 'error' ? entry.error : null,
    isLoading: key != null && entry === undefined,
    retryInSeconds:
      entry?.status === 'error' && entry.retryInMs != null
        ? Math.max(1, Math.ceil(entry.retryInMs / 1000))
        : null,
    retry,
  };
}
