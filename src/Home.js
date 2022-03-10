import Header from './components/Header.js';
import { useState } from 'react';
import CoinCard from './components/CoinCard.js';
import styled from 'styled-components';
import SearchBar from './components/SearchBar.js';

function Home({ coins, currency }) {
  const [search, setSearch] = useState('');
  const [searchError, setSearchError] = useState(false);

  const filterdCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = e => {
    setSearch(e.target.value.trim());

    if (e.target.value.trim() !== '') {
      if (!e.target.value.trim().match(/^[a-zA-Z0-9_.]+$/)) {
        setSearchError(true);
      } else {
        setSearchError(false);
      }
    } else {
      setSearchError(false);
    }
  };
  return (
    <>
      <Header title="Crypto Cloud" />
      <CoinSearch>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <SearchBar handleChange={handleChange} />
          {searchError ? (
            <SearchErrorMessage>
              Please don't use special characters
            </SearchErrorMessage>
          ) : (
            ''
          )}
        </form>
      </CoinSearch>
      <TableHeading>
        <p>#</p>
        <p>Name</p>
        <StackedHeading>
          <p>Price</p>
          <p>% Change 24H</p>
        </StackedHeading>
      </TableHeading>
      <CoinList role="list">
        {filterdCoins.map(coin => {
          return (
            <CoinCard
              currency={currency}
              rank={coin.market_cap_rank}
              key={coin.id}
              name={coin.name}
              symbol={coin.symbol}
              image={coin.image}
              price={coin.current_price}
              price_change_percentage_24h={coin.price_change_percentage_24h}
            />
          );
        })}
      </CoinList>
      {filterdCoins.length === 0 ? (
        <CoinNotFound>Searched coin is not in the database</CoinNotFound>
      ) : (
        ''
      )}
    </>
  );
}

export default Home;

const CoinList = styled.ul``;

const CoinSearch = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TableHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  margin: 0 auto;
  padding: 5px 0 5px;
  width: 90%;
  margin-bottom: 24px;
`;

const StackedHeading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const SearchErrorMessage = styled.p`
  color: red;
  text-align: center;
  padding-bottom: 5px;
`;

const CoinNotFound = styled.p`
  color: black;
  text-align: center;
`;
