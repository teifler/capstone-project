import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { resetResources } from './api/resource.js';
import { resetHttpState } from './api/http.js';
import { useFavorites } from './store/favorites.js';

// jsdom has no canvas. Replace the Chart.js component with a stand-in that
// exposes what the app passes to it, so tests can assert on chart input.
vi.mock('react-chartjs-2', () => ({
  Line: ({ data, options, ...props }) => (
    <canvas
      data-testid="price-chart"
      data-labels={JSON.stringify(data.labels)}
      data-values={JSON.stringify(data.datasets[0].data)}
      data-animation={JSON.stringify(options?.animation ?? null)}
      {...props}
    />
  ),
}));

beforeEach(() => {
  // Unit tests never talk to the real API: any request a test did not mock
  // fails loudly.
  vi.stubGlobal(
    'fetch',
    vi.fn(async url => {
      throw new Error(`Unexpected network request: ${url}`);
    })
  );
  window.scrollTo = vi.fn();
  resetResources();
  resetHttpState();
  useFavorites.setState({ favorites: [] });
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  resetResources();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
