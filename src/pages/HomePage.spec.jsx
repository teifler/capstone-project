import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
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
