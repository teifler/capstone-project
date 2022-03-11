import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import spinner from './images/spinner.svg';
import CoinPage from './pages/CoinPage.js';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState('eur');
  const [error, setError] = useState('');

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

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setCoins(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };
    setTimeout(() => fetchData(), 2000);
  }, []);

  if (isLoading) {
    return <SpinnerLogo src={spinner} height="80" width="80"></SpinnerLogo>;
  }

  console.log(coins);
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage coins={coins} currency={currency} />}
      />
      {coins.map(coin => (
        <Route
          path={`${coin.id}`}
          element={
            <CoinPage title={coin.name} coin={coin} currency={currency} />
          }
        />
      ))}

      {/*{!error ? (
        <Home coins={coins} currency={currency} />
      ) : (
        <ErrorMessage>
          We had issues fetching the coins for you. Please reload the page to
          try it again!
        </ErrorMessage>
      )}*/}
    </Routes>
  );
}

export default App;

const ErrorMessage = styled.h3`
  color: red;
`;

const SpinnerLogo = styled.img`
  margin-top: 40vh;
`;
