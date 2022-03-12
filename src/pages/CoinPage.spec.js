import { render, screen } from '@testing-library/react';
import CoinPage from './CoinPage.js';
import { MemoryRouter } from 'react-router';

// Sample data for test

const sample = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image:
    'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
  current_price: 35245,
  market_cap: 668970695709,
  market_cap_rank: 1,
  fully_diluted_valuation: 740302859784,
  total_volume: 17926994182,
  high_24h: 35977,
  low_24h: 34808,
  price_change_24h: -515.460254804602,
  price_change_percentage_24h: -1.44141,
  market_cap_change_24h: -13264263108.407715,
  market_cap_change_percentage_24h: -1.94424,
  circulating_supply: 18976537,
  total_supply: 21000000,
  max_supply: 21000000,
  ath: 59717,
  ath_change_percentage: -40.96719,
  ath_date: '2021-11-10T14:24:11.849Z',
  atl: 51.3,
  atl_change_percentage: 68620.50031,
  atl_date: '2013-07-05T00:00:00.000Z',
  roi: null,
  last_updated: '2022-03-07T09:22:37.003Z',
};

describe('CoinPage', () => {
  it('Renders CoinPage with sample data', () => {
    render(
      <MemoryRouter>
        <CoinPage coin={sample} currency="eur" />
      </MemoryRouter>
    );
    const favIcon = screen.getByAltText('icon-fav');
    const link = screen.getByRole('link');
    const btc = screen.getByText('Bitcoin');

    expect(favIcon).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(btc).toBeInTheDocument();
  });
});
