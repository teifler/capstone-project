import { useEffect } from 'react';

import CoinCard from '../components/CoinCard.js';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar.js';
import ScrollToTop from '../components/ScrollToTop.js';

import useStore from '../hooks/useStore.js';

function HomePage({ coins, currency }) {
  const setSearchInput = useStore(state => state.setSearchInput);
  const search = useStore(state => state.search);

  useEffect(() => {
    useStore.getState().setSearchInput('', false);
  }, []);

  const filterdCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.input.toLowerCase())
  );
  const handleChange = e => {
    const trimmed = e.target.value.trim();
    if (trimmed !== '' && !trimmed.match(/^[a-zA-Z0-9_. ]+$/)) {
      setSearchInput(trimmed, true);
    } else {
      setSearchInput(trimmed, false);
    }
  };

  return (
    <Container>
      <CoinSearch>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <SearchBar handleChange={handleChange} />
          {search.error && (
            <SearchErrorMessage>
              Please don't use special characters
            </SearchErrorMessage>
          )}
        </form>
      </CoinSearch>

      <CoinList role="list">
        {filterdCoins.map(coin => {
          return (
            <CoinCard
              currency={currency}
              rank={coin.market_cap_rank}
              id={coin.id}
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
      <ScrollToTop />
      {filterdCoins.length === 0 ? (
        <CoinNotFound>Searched coin is not in the database</CoinNotFound>
      ) : null}
    </Container>
  );
}

export default HomePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CoinList = styled.ul`
  margin-bottom: 55px;
`;

const CoinSearch = styled.div``;

const SearchErrorMessage = styled.p`
  color: red;
  text-align: center;
  padding-bottom: 5px;
`;

const CoinNotFound = styled.p`
  color: black;
  text-align: center;
`;
