import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import spinner from './images/spinner.svg';
import CoinPage from './pages/CoinPage.js';
import { nanoid } from 'nanoid';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState('eur');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const url = `hqttps://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
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
        element={
          error ? (
            <ErrorMessage>
              We had issues fetching the coins for you. Please reload the page
              to try it again!
            </ErrorMessage>
          ) : (
            <HomePage coins={coins} currency={currency} />
          )
        }
      />
      {coins.map(coin => (
        <Route
          key={nanoid()}
          path={`${coin.id}`}
          element={
            <CoinPage
              key={nanoid()}
              title={coin.name}
              coin={coin}
              currency={currency}
            />
          }
        />
      ))}
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
