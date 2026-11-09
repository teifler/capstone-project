import { useState } from 'react';
import styled from 'styled-components';
import CoinCard from '../components/CoinCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';
import ApiErrorNotice from '../components/ApiErrorNotice.jsx';
import Loading from '../components/Loading.jsx';
import { useTopCoins, VS_CURRENCY } from '../api/coingecko.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

// Case-insensitive match on name or symbol. Any input is fine: the query
// only filters a local array and React escapes what is rendered.
export function matchesQuery(coin, query) {
  const needle = query.trim().toLowerCase();
  if (needle === '') return true;
  return (
    coin.name.toLowerCase().includes(needle) ||
    coin.symbol.toLowerCase().includes(needle)
  );
}

function HomePage() {
  const top = useTopCoins();
  const [query, setQuery] = useState('');
  useDocumentTitle('Top 100 coins');

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

  const coins = (top.data ?? []).filter(coin => matchesQuery(coin, query));

  return (
    <Container>
      <h2 className="visually-hidden">
        Top 100 cryptocurrencies by market cap
      </h2>
      <form role="search" onSubmit={event => event.preventDefault()}>
        <SearchBar handleChange={event => setQuery(event.target.value)} />
      </form>

      <CoinList role="list">
        {coins.map(coin => (
          <li key={coin.id}>
            <CoinCard coin={coin} currency={VS_CURRENCY} />
          </li>
        ))}
      </CoinList>
      {coins.length === 0 && (
        <CoinNotFound>
          No coin in today’s top 100 matches “{query}”.
        </CoinNotFound>
      )}
      <ScrollToTop />
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
  width: 100%;
  max-width: 338px;
  margin-bottom: 55px;
`;

const CoinNotFound = styled.p`
  text-align: center;
`;
