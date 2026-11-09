import styled from 'styled-components';
import CoinCard from '../components/CoinCard.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';
import ApiErrorNotice from '../components/ApiErrorNotice.jsx';
import Loading from '../components/Loading.jsx';
import { useCoins, VS_CURRENCY } from '../api/coingecko.js';
import { useFavorites } from '../store/favorites.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

function Tracker() {
  const favorites = useFavorites(state => state.favorites);
  const toggleFavorite = useFavorites(state => state.toggleFavorite);
  const { coins, error, isLoading, retry, retryInSeconds } =
    useCoins(favorites);
  useDocumentTitle('Tracker');
  const heading = <h2 className="visually-hidden">Your tracking list</h2>;

  if (favorites.length === 0) {
    return (
      <Container>
        {heading}
        <Message>
          There is nothing in your tracking list. You can add cryptocurrencies
          to your tracking list by clicking the star icon on a coin’s page.
        </Message>
      </Container>
    );
  }
  if (isLoading) return <Loading label="Loading your tracked coins…" />;
  if (error) {
    return (
      <ApiErrorNotice
        what="your tracked coins"
        error={error}
        retryInSeconds={retryInSeconds}
        onRetry={retry}
      />
    );
  }

  const missing = favorites.filter(id => !coins.some(coin => coin.id === id));
  return (
    <Container>
      {heading}
      <CoinList role="list">
        {coins.map(coin => (
          <li key={coin.id}>
            <CoinCard coin={coin} currency={VS_CURRENCY} />
          </li>
        ))}
      </CoinList>
      {missing.length > 0 && (
        <Message>
          CoinGecko no longer lists {missing.length === 1 ? 'one' : 'some'} of
          your tracked coins:{' '}
          {missing.map(id => (
            <button key={id} type="button" onClick={() => toggleFavorite(id)}>
              Remove {id}
            </button>
          ))}
        </Message>
      )}
      <ScrollToTop />
    </Container>
  );
}

export default Tracker;

const Container = styled.div`
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const CoinList = styled.ul`
  width: 100%;
  max-width: 338px;
`;

const Message = styled.p`
  text-align: center;
  margin: 0 14px 16px;
  button {
    margin: 0.25rem;
  }
`;
