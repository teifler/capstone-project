import Header from './components/Header.js';
import { useState, useEffect } from 'react';

function Home() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const currency = 'eur';
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('ERROR:', error);
      }
    };

    fetchData();
  }, []); // Fetch API Data

  return (
    <>
      <Header />
    </>
  );
}

export default Home;
