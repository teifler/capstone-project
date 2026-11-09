import { describe, expect, it, vi } from 'vitest';
import { StrictMode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  MAX_AUTO_RETRIES,
  useCachedResource,
  useResource,
} from './resource.js';
import { ApiError } from './errors.js';
import { deferred } from '../test/api.js';

// A controllable loader: every call is recorded and can be settled by hand.
function controllableLoader() {
  const calls = [];
  const load = vi.fn((key, signal) => {
    const d = deferred();
    signal.addEventListener('abort', () =>
      d.reject(new ApiError('abort', 'aborted'))
    );
    calls.push({ key, signal, ...d });
    return d.promise;
  });
  return { load, calls };
}

describe('useResource', () => {
  it('loads a key once and serves it from the cache within the TTL', async () => {
    const load = vi.fn(async key => `data for ${key}`);
    const first = renderHook(() => useResource('a', load));
    expect(first.result.current.isLoading).toBe(true);
    await waitFor(() => expect(first.result.current.data).toBe('data for a'));

    const second = renderHook(() => useResource('a', load));
    expect(second.result.current.data).toBe('data for a');
    expect(second.result.current.isLoading).toBe(false);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('refreshes after the TTL', async () => {
    vi.useFakeTimers();
    const load = vi.fn(async () => 'v');
    const first = renderHook(() => useResource('a', load, { ttl: 1000 }));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(first.result.current.data).toBe('v');
    first.unmount();
    vi.advanceTimersByTime(1000);
    renderHook(() => useResource('a', load, { ttl: 1000 }));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('never shows the answer for a previous key (out-of-order responses)', async () => {
    const { load, calls } = controllableLoader();
    const hook = renderHook(({ id }) => useResource(id, load), {
      initialProps: { id: 'bitcoin?days=7' },
    });
    hook.rerender({ id: 'bitcoin?days=365' });
    await act(() => new Promise(resolve => setTimeout(resolve, 0)));

    // The first request was aborted when the key changed ...
    expect(calls[0].signal.aborted).toBe(true);
    // ... and even if its answer arrives late, it is not shown.
    calls[0].resolve('7 days');
    calls[1].resolve('365 days');
    await waitFor(() => expect(hook.result.current.data).toBe('365 days'));
    calls[0].resolve('7 days, very late');
    await act(() => Promise.resolve());
    expect(hook.result.current.data).toBe('365 days');
  });

  it('shows an error, not the previous key’s data, when a request fails', async () => {
    const { load, calls } = controllableLoader();
    const hook = renderHook(({ id }) => useResource(id, load), {
      initialProps: { id: 'bitcoin' },
    });
    calls[0].resolve({ name: 'Bitcoin' });
    await waitFor(() =>
      expect(hook.result.current.data).toEqual({ name: 'Bitcoin' })
    );

    hook.rerender({ id: 'ethereum' });
    expect(hook.result.current.data).toBeUndefined();
    calls[1].reject(new ApiError('http', 'HTTP 500', { status: 500 }));
    await waitFor(() => expect(hook.result.current.error).not.toBeNull());
    expect(hook.result.current.data).toBeUndefined();
    expect(hook.result.current.retryInSeconds).toBeNull();
  });

  it('shares one request between components and under StrictMode', async () => {
    const { load, calls } = controllableLoader();
    const wrapper = ({ children }) => <StrictMode>{children}</StrictMode>;
    const a = renderHook(() => useResource('k', load), { wrapper });
    const b = renderHook(() => useResource('k', load), { wrapper });
    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
    expect(load).toHaveBeenCalledTimes(1);
    calls[0].resolve(1);
    await waitFor(() => expect(a.result.current.data).toBe(1));
    expect(b.result.current.data).toBe(1);
  });

  it('aborts the request when the last user unmounts', async () => {
    const { load, calls } = controllableLoader();
    const hook = renderHook(() => useResource('k', load));
    hook.unmount();
    await act(() => new Promise(resolve => setTimeout(resolve, 0)));
    expect(calls[0].signal.aborted).toBe(true);
  });

  it('retries rate-limited requests automatically, then hands over to the user', async () => {
    vi.useFakeTimers();
    const load = vi.fn(async () => {
      throw new ApiError('rate-limit', 'HTTP 429', {
        status: 429,
        retryAfterMs: 2000,
      });
    });
    const hook = renderHook(() => useResource('k', load));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(hook.result.current.error.kind).toBe('rate-limit');
    expect(hook.result.current.retryInSeconds).toBe(2);

    for (let i = 0; i < MAX_AUTO_RETRIES; i += 1) {
      await act(() => vi.advanceTimersByTimeAsync(2000));
    }
    expect(load).toHaveBeenCalledTimes(1 + MAX_AUTO_RETRIES);
    expect(hook.result.current.retryInSeconds).toBeNull();
    await act(() => vi.advanceTimersByTimeAsync(60_000));
    expect(load).toHaveBeenCalledTimes(1 + MAX_AUTO_RETRIES);

    load.mockResolvedValueOnce('finally');
    act(() => hook.result.current.retry());
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(hook.result.current.data).toBe('finally');
  });

  it('retries a final error on the next mount after the TTL', async () => {
    vi.useFakeTimers();
    const load = vi
      .fn()
      .mockRejectedValueOnce(new ApiError('http', 'HTTP 500', { status: 500 }))
      .mockResolvedValueOnce('ok');
    const first = renderHook(() => useResource('k', load, { ttl: 1000 }));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(first.result.current.error.kind).toBe('http');
    first.unmount();

    const early = renderHook(() => useResource('k', load, { ttl: 1000 }));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(load).toHaveBeenCalledTimes(1);
    early.unmount();

    vi.advanceTimersByTime(1000);
    const later = renderHook(() => useResource('k', load, { ttl: 1000 }));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(later.result.current.data).toBe('ok');
  });

  it('does nothing for a null key', () => {
    const load = vi.fn();
    const hook = renderHook(() => useResource(null, load));
    expect(hook.result.current).toMatchObject({
      data: undefined,
      error: null,
      isLoading: false,
    });
    hook.result.current.retry();
    expect(load).not.toHaveBeenCalled();
  });
});

describe('useCachedResource', () => {
  it('reads cached data without starting a request', async () => {
    const load = vi.fn(async () => 'cached');
    const peek = renderHook(() => useCachedResource('k'));
    expect(peek.result.current).toBeUndefined();
    renderHook(() => useResource('k', load));
    await waitFor(() =>
      expect(peek.result.current).toEqual({ data: 'cached' })
    );
    expect(
      renderHook(() => useCachedResource(null)).result.current
    ).toBeUndefined();
  });
});
