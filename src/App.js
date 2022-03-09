import React from 'react';
import Home from './Home.js';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import spinner from './images/spinner.svg';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState('eur');
  const [error, setError] = useState('');

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
  return (
    <>
      {!error ? (
        <Home coins={coins} currency={currency} />
      ) : (
        <ErrorMessage>
          We had issues fetching the coins for you. Please reload the page to
          try it again!
        </ErrorMessage>
      )}
    </>
  );
}

export default App;

const ErrorMessage = styled.h2`
  color: blue;
`;

const SpinnerLogo = styled.img`
  margin-top: 40vh;
`;
