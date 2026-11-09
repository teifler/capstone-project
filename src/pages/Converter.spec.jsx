import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../test/render.jsx';
import { coinGecko, jsonResponse, mockFetch } from '../test/api.js';
import { rawMarkets } from '../test/fixtures.js';

async function choose(user, label, text) {
  const input = screen.getByLabelText(label);
  await user.click(input);
  await user.type(input, `${text}{Enter}`);
}

const result = () => screen.getByRole('status', { name: 'Result' });

describe('Converter', () => {
  it('converts locally from the list prices, without a request per keystroke', async () => {
    const fetchMock = mockFetch(coinGecko());
    const user = userEvent.setup();
    renderApp('/converter');
    await screen.findByLabelText('Convert from');

    await choose(user, 'Convert from', 'Bitcoin');
    await choose(user, 'Convert to', 'Ethereum');
    expect(result()).toHaveTextContent('1 BTC = 35.116291 ETH');

    const amount = screen.getByLabelText('Amount');
    await user.clear(amount);
    await user.type(amount, '2');
    expect(result()).toHaveTextContent('2 BTC = 70.232583 ETH');

    await user.clear(amount);
    await user.type(amount, '1,5');
    expect(result()).toHaveTextContent('1.5 BTC = 52.674437 ETH');

    // One request for the whole session: the top list. No CoinPaprika.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      'api.coingecko.com/api/v3/coins/markets'
    );
  });

  it('swaps the two coins', async () => {
    mockFetch(coinGecko());
    const user = userEvent.setup();
    renderApp('/converter');
    await screen.findByLabelText('Convert from');
    await choose(user, 'Convert from', 'Bitcoin');
    await choose(user, 'Convert to', 'Ethereum');
    await user.click(screen.getByRole('button', { name: 'Swap coins' }));
    expect(result()).toHaveTextContent('1 ETH = 0.0284768 BTC');
  });

  it('explains invalid amounts and shows no result for them', async () => {
    mockFetch(coinGecko());
    const user = userEvent.setup();
    renderApp('/converter');
    await screen.findByLabelText('Convert from');
    await choose(user, 'Convert from', 'Bitcoin');
    await choose(user, 'Convert to', 'Ethereum');

    const amount = screen.getByLabelText('Amount');
    await user.clear(amount);
    expect(amount).toHaveValue('');
    expect(amount).not.toHaveAttribute('aria-invalid');
    expect(result()).toHaveTextContent('Choose two coins and an amount.');

    await user.type(amount, '-5');
    expect(amount).toHaveAttribute('aria-invalid', 'true');
    expect(amount).toHaveAccessibleDescription(
      'Enter a positive number, for example 1.5.'
    );
    expect(result()).toHaveTextContent('Choose two coins and an amount.');
  });

  it('says so when a coin has no current price', async () => {
    const markets = rawMarkets.map(coin =>
      coin.id === 'ethereum' ? { ...coin, current_price: null } : coin
    );
    mockFetch(coinGecko({ markets }));
    const user = userEvent.setup();
    renderApp('/converter');
    await screen.findByLabelText('Convert from');
    await choose(user, 'Convert from', 'Bitcoin');
    await choose(user, 'Convert to', 'Ethereum');
    expect(result()).toHaveTextContent('No current price for Ethereum.');
  });

  it('shows an error instead of a result when the prices cannot be loaded', async () => {
    mockFetch(() => jsonResponse({}, { status: 500 }));
    renderApp('/converter');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'We couldn’t load the prices.'
    );
    expect(screen.queryByRole('status', { name: 'Result' })).toBeNull();
  });

  it('shows no invented fee figures', async () => {
    mockFetch(coinGecko());
    const user = userEvent.setup();
    renderApp('/converter');
    await screen.findByLabelText('Convert from');
    await choose(user, 'Convert from', 'Bitcoin');
    await choose(user, 'Convert to', 'Ethereum');
    expect(screen.queryByText(/0\.10\s?%/)).toBeNull();
    expect(screen.queryByText('$25')).toBeNull();
    expect(
      screen.getByText(/does not include exchange fees/)
    ).toBeInTheDocument();
  });
});
