import { useEffect } from 'react';

import CoinCard from '../components/CoinCard.jsx';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';

import useStore from '../hooks/useStore.js';
import { useTopCoins, VS_CURRENCY } from '../api/coingecko.js';
import ApiErrorNotice from '../components/ApiErrorNotice.jsx';
import Loading from '../components/Loading.jsx';

function HomePage() {
  const top = useTopCoins();
  const setSearchInput = useStore(state => state.setSearchInput);
  const search = useStore(state => state.search);

  useEffect(() => {
    useStore.getState().setSearchInput('', false);
  }, []);

  if (top.isLoading) return <Loading label="Loading coins…" />;
  if (top.error) {
    return (
      <ApiErrorNotice
        what="the coin list"
        error={top.error}
        retryInSeconds={top.retryInSeconds}
        onRetry={top.retry}
      />
    );
  }

  const filterdCoins = (top.data ?? []).filter(coin =>
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
              Please do not use special characters
            </SearchErrorMessage>
          )}
        </form>
      </CoinSearch>

      <CoinList role="list">
        {filterdCoins.map(coin => {
          return <CoinCard key={coin.id} coin={coin} currency={VS_CURRENCY} />;
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
