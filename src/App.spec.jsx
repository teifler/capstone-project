import { describe, expect, it } from 'vitest';
import { act, screen, waitFor, within } from '@testing-library/react';
import { renderApp } from './test/render.jsx';
import {
  coinGecko,
  deferred,
  jsonResponse,
  mockFetch,
  rateLimited,
  requestedUrls,
} from './test/api.js';
import { useFavorites } from './store/favorites.js';

const shell = () => {
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
};

describe('routing', () => {
  it('opens any coin by deep link, also outside the top list', async () => {
    const fetchMock = mockFetch(coinGecko());
    renderApp('/the-open-network');
    expect(
      await screen.findByText('Gram (prev. Toncoin) Price')
    ).toBeInTheDocument();
    const [coinRequest] = requestedUrls(fetchMock);
    expect(coinRequest.searchParams.get('ids')).toBe('the-open-network');
    await waitFor(() =>
      expect(
        requestedUrls(fetchMock).some(u =>
          u.pathname.endsWith('/the-open-network/market_chart')
        )
      ).toBe(true)
    );
  });

  it('shows "Coin not found" for a well-formed id CoinGecko does not know', async () => {
    mockFetch(coinGecko());
    renderApp('/no-such-coin');
    expect(
      await screen.findByRole('heading', { name: 'Coin not found' })
    ).toBeInTheDocument();
    shell();
  });

  it.each([
    '/%5Cevil.example',
    '/__proto__',
    '/bit.coin',
    '/bitcoin/extra',
    '/*',
  ])('answers %s with the 404 page without calling the API', path => {
    const fetchMock = mockFetch(coinGecko());
    renderApp(path);
    expect(
      screen.getByRole('heading', { name: 'Page not found' })
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    shell();
  });

  it('redirects upper-case coin ids to the canonical lower-case path', async () => {
    mockFetch(coinGecko());
    const { location } = renderApp('/Bitcoin?days=7');
    await screen.findByText('Bitcoin Price');
    expect(location().pathname).toBe('/bitcoin');
    expect(location().search).toBe('?days=7');
  });

  it('keeps the old /Tracker address working', () => {
    renderApp('/Tracker');
    expect(
      screen.getByText(/There is nothing in your tracking list/)
    ).toBeInTheDocument();
  });

  it('links coin cards only to validated same-origin paths', async () => {
    mockFetch(
      coinGecko({
        markets: [
          {
            id: '/evil.example',
            name: 'Evil',
            symbol: 'evl',
            current_price: 1,
          },
          {
            id: '\\evil.example',
            name: 'Evil2',
            symbol: 'ev2',
            current_price: 1,
          },
          { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 1 },
        ],
      })
    );
    renderApp('/');
    await screen.findByText('Bitcoin');
    const hrefs = within(screen.getAllByRole('list')[0])
      .getAllByRole('link')
      .map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/bitcoin']);
    expect(screen.queryByText('Evil')).not.toBeInTheDocument();
  });
});

describe('errors and rate limits', () => {
  it('explains a rate-limited coin list and keeps the shell', async () => {
    mockFetch(() => rateLimited(20));
    renderApp('/');
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('We couldn’t load the coin list.');
    expect(alert).toHaveTextContent('limiting the number of requests');
    expect(alert).toHaveTextContent(
      'Trying again automatically in about 20 seconds.'
    );
    shell();
  });

  it('offers a manual retry for other failures and recovers', async () => {
    let fail = true;
    const api = coinGecko();
    mockFetch(url => (fail ? jsonResponse({}, { status: 500 }) : api(url)));
    renderApp('/');
    const alert = await screen.findByRole('alert');
    fail = false;
    await act(() =>
      within(alert).getByRole('button', { name: 'Try again' }).click()
    );
    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
  });

  it('does not crash the tracker when its request fails', async () => {
    useFavorites.setState({ favorites: ['bitcoin'] });
    mockFetch(() => jsonResponse({}, { status: 502 }));
    renderApp('/tracker');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'We couldn’t load your tracked coins.'
    );
    shell();
  });

  it('keeps the coin data when only the chart is rate-limited', async () => {
    const api = coinGecko();
    mockFetch(url =>
      url.pathname.endsWith('/market_chart') ? rateLimited(15) : api(url)
    );
    renderApp('/bitcoin');
    expect(await screen.findByText('Bitcoin Price')).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'We couldn’t load the price chart.'
    );
    expect(screen.getByText('€66,433.00')).toBeInTheDocument();
  });
});

describe('coin page', () => {
  it('renders a coin whose 24h values are null', async () => {
    mockFetch(coinGecko());
    renderApp('/figure-heloc');
    expect(await screen.findByText('Figure Heloc Price')).toBeInTheDocument();
    expect(screen.getByText(/Last 24hrs/)).toHaveTextContent('– (–)');
  });

  it('never shows the previous coin’s values while the next one loads or fails', async () => {
    const api = coinGecko();
    const ethereum = deferred();
    mockFetch(url =>
      url.searchParams.get('ids') === 'ethereum' ? ethereum.promise : api(url)
    );
    const view = renderApp('/bitcoin');
    await screen.findByText('Bitcoin Price');
    view.unmount();

    renderApp('/ethereum');
    expect(screen.queryByText('Bitcoin Price')).not.toBeInTheDocument();
    expect(screen.queryByText('€65,842.00')).not.toBeInTheDocument();
    ethereum.resolve(rateLimited(30));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'We couldn’t load this coin.'
    );
    expect(screen.queryByText('€65,842.00')).not.toBeInTheDocument();
    expect(screen.queryByText('€107,662.00')).not.toBeInTheDocument();
  });

  it('reuses the home page list instead of fetching the coin again', async () => {
    const fetchMock = mockFetch(coinGecko());
    renderApp('/');
    await screen.findByText('Bitcoin');
    await act(() => screen.getByRole('link', { name: /Bitcoin/ }).click());
    await screen.findByText('Bitcoin Price');
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const [list, chart] = requestedUrls(fetchMock);
    expect(list.searchParams.get('ids')).toBeNull();
    expect(chart.pathname).toBe('/api/v3/coins/bitcoin/market_chart');
  });

  it('loads the chart for the chosen timeframe and keeps it in the URL', async () => {
    const fetchMock = mockFetch(coinGecko());
    const { location } = renderApp('/bitcoin?days=30');
    await screen.findByText('Bitcoin Price');
    await waitFor(() => {
      const chart = requestedUrls(fetchMock).find(u =>
        u.pathname.endsWith('/market_chart')
      );
      expect(chart.searchParams.get('days')).toBe('30');
    });
    expect(location().search).toBe('?days=30');
  });

  it('falls back to one day for an unknown timeframe', async () => {
    const fetchMock = mockFetch(coinGecko());
    renderApp('/bitcoin?days=14');
    await screen.findByText('Bitcoin Price');
    await waitFor(() => {
      const chart = requestedUrls(fetchMock).find(u =>
        u.pathname.endsWith('/market_chart')
      );
      expect(chart.searchParams.get('days')).toBe('1');
    });
  });

  it('adds and removes the coin from the tracker', async () => {
    mockFetch(coinGecko());
    renderApp('/bitcoin');
    const star = await screen.findByRole('button', { name: 'Track Bitcoin' });
    expect(star).toHaveAttribute('aria-pressed', 'false');
    await act(() => star.click());
    expect(star).toHaveAttribute('aria-pressed', 'true');
    expect(useFavorites.getState().favorites).toEqual(['bitcoin']);
    await act(() => star.click());
    expect(useFavorites.getState().favorites).toEqual([]);
  });
});

describe('tracker', () => {
  it('lists tracked coins by id, also outside the top list, in rank order', async () => {
    useFavorites.setState({ favorites: ['the-open-network', 'bitcoin'] });
    const fetchMock = mockFetch(coinGecko());
    renderApp('/tracker');
    await screen.findByText('Bitcoin');
    const names = within(screen.getAllByRole('list')[0])
      .getAllByRole('heading')
      .map(h => h.textContent);
    expect(names).toEqual(['Bitcoin', 'Gram (prev. Toncoin)']);
    expect(requestedUrls(fetchMock)[0].searchParams.get('ids')).toBe(
      'bitcoin,the-open-network'
    );
  });

  it('offers to remove coins CoinGecko no longer lists', async () => {
    useFavorites.setState({ favorites: ['bitcoin', 'gone-coin'] });
    mockFetch(coinGecko());
    renderApp('/tracker');
    const remove = await screen.findByRole('button', {
      name: 'Remove gone-coin',
    });
    await act(() => remove.click());
    expect(useFavorites.getState().favorites).toEqual(['bitcoin']);
  });
});
