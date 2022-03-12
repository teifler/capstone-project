import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import Home from '../pages/HomePage.js';

// Sample data for test
const sample = [
  {
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
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    current_price: 2338.94,
    market_cap: 280406134887,
    market_cap_rank: 2,
    fully_diluted_valuation: null,
    total_volume: 10668132882,
    high_24h: 2425.98,
    low_24h: 2315.23,
    price_change_24h: -67.06447375771,
    price_change_percentage_24h: -2.78738,
    market_cap_change_24h: -9504633041.78833,
    market_cap_change_percentage_24h: -3.27847,
    circulating_supply: 119859472.749,
    total_supply: null,
    max_supply: null,
    ath: 4228.93,
    ath_change_percentage: -44.67969,
    ath_date: '2021-12-01T08:38:24.623Z',
    atl: 0.381455,
    atl_change_percentage: 613197.7153,
    atl_date: '2015-10-20T00:00:00.000Z',
    roi: {
      times: 87.75186409006773,
      currency: 'btc',
      percentage: 8775.186409006774,
    },
  },
];

//

describe('CoinCard', () => {
  it('renders the sample data from above', () => {
    render(
      <MemoryRouter>
        <Home coins={sample} currency="usd" />
      </MemoryRouter>
    );
    const btc = screen.getByText('Bitcoin');
    const eth = screen.getByText('Ethereum');

    const image = screen.getByAltText('Bitcoin');

    expect(image.src).toContain(
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
    );

    expect(btc).toBeInTheDocument();
    expect(eth).toBeInTheDocument();
  });
});
