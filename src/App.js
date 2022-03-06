import React from 'react';
import Home from './Home.js';
//import styled from 'styled-components';
import { useEffect, useState } from 'react';

//import { ErrorBoundary } from 'react-error-boundary';
//import ErrorFallback from './components/ErrorFallback.js';

function App() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const currency = 'eur';
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error('ERROR:', error);
      }
    };
    fetchData();
  }, []); // Fetch API Data
  return (
    <>
      {
        //<ErrorBoundary FallbackComponent={ErrorFallback}>
      }
      <Home coins={coins} />
    </>
  );
}

export default App;
