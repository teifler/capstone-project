import CoinCard from '../components/CoinCard.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';

import styled from 'styled-components';
import { useFavorites } from '../store/favorites.js';

function Tracker({ coins, currency }) {
  const favorites = useFavorites(state => state.favorites);
  const tracked = (coins ?? []).filter(coin => favorites.includes(coin.id));
  return (
    <Container>
      <CoinList role="list">
        {tracked.map(coin => {
          return <CoinCard key={coin.id} coin={coin} currency={currency} />;
        })}
      </CoinList>
      <ScrollToTop />
      {tracked.length === 0 ? (
        <CoinNotFound>
          There is nothing in your tracking list. You can add cryptocurrencys to
          your tracking list by clicking the star icon.
        </CoinNotFound>
      ) : (
        ''
      )}
    </Container>
  );
}

export default Tracker;

const Container = styled.div`
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const CoinList = styled.ul``;

const CoinNotFound = styled.p`
  color: black;
  text-align: center;
  margin-left: 30px;
  margin-right: 30px;
`;
