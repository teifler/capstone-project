import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../test/render.jsx';
import { coinGecko, mockFetch } from '../test/api.js';
import { coins } from '../test/fixtures.js';

describe('HomePage', () => {
  it('renders the live top list including the coin with null 24h values', async () => {
    mockFetch(coinGecko());
    renderApp('/');
    expect(await screen.findByText('Figure Heloc')).toBeInTheDocument();
    const list = screen.getAllByRole('list')[0];
    expect(list.querySelectorAll('a')).toHaveLength(coins.length);
  });
});

describe('search', () => {
  it('matches name or symbol, accepts punctuation and explains empty results', async () => {
    mockFetch(coinGecko());
    const user = userEvent.setup();
    renderApp('/');
    await screen.findByText('Bitcoin');
    const search = screen.getByRole('textbox', { name: /search/i });
    const shown = () =>
      within(screen.getAllByRole('list')[0])
        .queryAllByRole('heading')
        .map(h => h.textContent);

    await user.type(search, 'btc');
    expect(shown()).toEqual(['Bitcoin']);

    await user.clear(search);
    await user.type(search, '(prev.');
    expect(shown()).toEqual(['Gram (prev. Toncoin)']);
    expect(screen.queryByText(/special characters/)).toBeNull();

    await user.clear(search);
    await user.type(search, 'zzz');
    expect(shown()).toEqual([]);
    expect(
      screen.getByText('No coin in today’s top 100 matches “zzz”.')
    ).toBeInTheDocument();
  });
});
