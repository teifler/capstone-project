import Header from './components/Header.js';
import { useState } from 'react';
import CoinCard from './components/CoinCard.js';
//import styled from 'styled-components';

function Home({ coins }) {
  const [search, setSearch] = useState('');

  const filterdCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = e => {
    setSearch(e.target.value);
  };
  console.log(coins);
  return (
    <>
      <Header />
      <div className="coins-container">
        <div className="coin-search">
          <form>
            <label>
              Search
              <input
                id="search-input"
                name="search-input"
                onChange={handleChange}
                className="searchInput"
                type="text"
                placeholder="Search here"
              ></input>
            </label>
          </form>
        </div>
        <ul>
          {filterdCoins.map(coin => {
            return (
              <CoinCard
                key={coin.id}
                name={coin.name}
                symbol={coin.symbol}
                image={coin.image}
                price={coin.current_price}
                price_change_percentage_24h={coin.price_change_percentage_24h}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Home;
