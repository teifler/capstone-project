import { describe, expect, it } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { renderApp } from './test/render.jsx';
import { coinGecko, mockFetch, rateLimited } from './test/api.js';
import { useFavorites } from './store/favorites.js';

// jsdom cannot lay out or paint, so colour contrast and reflow are checked
// in the browser smoke test instead.
async function violations() {
  const result = await axe.run(document.body, {
    rules: { 'color-contrast': { enabled: false } },
  });
  return result.violations.map(v => `${v.impact} ${v.id}: ${v.help}`);
}

describe('accessibility (axe)', () => {
  it.each([
    ['/', 'Bitcoin'],
    ['/bitcoin', 'Bitcoin Price'],
    ['/converter', 'Crypto Currency Converter'],
    ['/tracker', 'Bitcoin'],
    ['/no/such/page', 'Page not found'],
  ])('%s has no violations', async (path, text) => {
    useFavorites.setState({ favorites: ['bitcoin'] });
    mockFetch(coinGecko());
    renderApp(path);
    await screen.findAllByText(text);
    expect(await violations()).toEqual([]);
  });

  it('error states have no violations', async () => {
    mockFetch(() => rateLimited(20));
    renderApp('/');
    await screen.findByRole('alert');
    expect(await violations()).toEqual([]);
  });
});

describe('layout', () => {
  it('has a skip link, one main landmark and the navigation before it', async () => {
    mockFetch(coinGecko());
    renderApp('/');
    await screen.findByText('Bitcoin');
    const skip = screen.getByRole('link', { name: 'Skip to content' });
    const main = screen.getByRole('main');
    expect(skip).toHaveAttribute('href', `#${main.id}`);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(
      nav.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Top 100 cryptocurrencies by market cap'
    );
  });

  it('wraps every card in a list item', async () => {
    mockFetch(coinGecko());
    renderApp('/');
    await screen.findByText('Bitcoin');
    const list = screen.getAllByRole('list')[0];
    const items = Array.from(list.children);
    expect(items.every(item => item.tagName === 'LI')).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it('moves focus to the page, scrolls up and sets the title after navigating', async () => {
    mockFetch(coinGecko());
    const user = userEvent.setup();
    renderApp('/');
    await screen.findByText('Bitcoin');
    expect(document.title).toBe('Top 100 coins – Crypto Cloud');
    expect(window.scrollTo).not.toHaveBeenCalled();

    await user.click(screen.getByRole('link', { name: /Bitcoin/ }));
    await screen.findByText('Bitcoin Price');
    expect(document.activeElement).toBe(screen.getByRole('main'));
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    await waitFor(() =>
      expect(document.title).toBe('Bitcoin (BTC) – Crypto Cloud')
    );

    await act(() => screen.getByRole('link', { name: 'Convert' }).click());
    await waitFor(() =>
      expect(document.title).toBe('Converter – Crypto Cloud')
    );
  });

  it('keeps focus where it is when only the timeframe changes', async () => {
    mockFetch(coinGecko());
    renderApp('/bitcoin');
    await screen.findByText('Bitcoin Price');
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
